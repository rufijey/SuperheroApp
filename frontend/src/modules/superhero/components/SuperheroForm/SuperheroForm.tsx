import React, {useState, useEffect, useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {RxCross2} from "react-icons/rx";
import {TextField, Button, Stack, Alert} from "@mui/material";
import styles from "./SuperheroForm.module.css";
import {Image, Superhero} from "../../services/superheroService.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../../shared/store/store.ts";

interface ImagePreview {
    file?: File;
    id?: number;
    url: string;
}

interface SuperheroFormProps {
    initialData?: Superhero;
    onSubmit: (formData: FormData) => void;
}

export const SuperheroForm: React.FC<SuperheroFormProps> = ({initialData, onSubmit}) => {
    const [form, setForm] = useState({
        nickname: "",
        real_name: "",
        origin_description: "",
        superpowers: "",
        catch_phrase: "",
    });

    const [images, setImages] = useState<ImagePreview[]>([]);
    const [removeImageIds, setRemoveImageIds] = useState<number[]>([]);

    const errors = useSelector((state: RootState) => state.superheroes.errors);

    useEffect(() => {
        if (initialData) {
            setForm({
                nickname: initialData.nickname,
                real_name: initialData.real_name,
                origin_description: initialData.origin_description,
                superpowers: initialData.superpowers,
                catch_phrase: initialData.catch_phrase,
            });
            const existing: ImagePreview[] = initialData.images.map((img: Image) => ({
                id: img.id,
                url: img.url,
            }));
            setImages(existing);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newFiles]);
    }, []);

    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        onDrop,
        accept: {"image/*": []},
        multiple: true,
    });

    const handleRemoveImage = (image: ImagePreview) => {
        if (image.id) setRemoveImageIds(prev => [...prev, image.id!]);
        setImages(prev => prev.filter(i => i !== image));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v as string));
        images.forEach(img => {
            if (img.file) fd.append("images", img.file);
        });
        removeImageIds.forEach(id => fd.append("removeImageIds[]", String(id)));
        onSubmit(fd);
    };

    const dropzoneClasses = [
        styles.dropzone,
        isDragActive ? styles.active : "",
        isDragReject ? styles.reject : "",
    ].filter(Boolean).join(" ");

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
                label="Nickname"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Real Name"
                name="real_name"
                value={form.real_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Origin Description"
                name="origin_description"
                value={form.origin_description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
            />
            <TextField
                label="Superpowers"
                name="superpowers"
                value={form.superpowers}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Catch Phrase"
                name="catch_phrase"
                value={form.catch_phrase}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            <div {...getRootProps({className: dropzoneClasses})}>
                <input {...getInputProps()} />
                <p>Drag & drop images here, or click to select</p>
                <div className={styles.preview__container}>
                    {images.map((image, index) => (
                        <div key={index} className={styles.previewItem}>
                            <img src={image.url} alt="Preview" className={styles.previewImage}/>
                            <RxCross2 className={styles.delete} onClick={() => handleRemoveImage(image)}/>
                        </div>
                    ))}
                </div>
            </div>

            {errors && errors.length > 0 && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                    {errors.map((msg, i) => (
                        <Alert key={i} severity="error" variant="filled">
                            {msg}
                        </Alert>
                    ))}
                </Stack>
            )}

            <Button type="submit" variant="contained" className={styles.submit}>
                Save
            </Button>
        </form>
    );
};
