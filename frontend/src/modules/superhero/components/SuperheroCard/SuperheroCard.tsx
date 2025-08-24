import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import styles from "./SuperheroCard.module.css";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../shared/store/store.ts";
import { useDispatch } from "react-redux";
import { deleteSuperhero } from "../../store/superhero.slice.ts";

export interface SuperheroCardProps {
    id: number;
    nickname: string;
    images?: { url: string }[];
    page: number;
    limit: number;
}

const SuperheroCard: React.FC<SuperheroCardProps> = ({ id, nickname, images, page, limit }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async () => {
        await dispatch(deleteSuperhero(id));
        dispatch({ type: "superheroes/fetchAll", payload: { page, limit } }); // обновление списка
    };

    return (
        <Card className={styles.card}>
            <CardContent>
                <Typography variant="h6">{nickname}</Typography>
                {images?.[0] && (
                    <div className={styles.hero__info}>
                        <img src={images[0].url} alt={nickname} className={styles.image} />
                    </div>
                )}

                <Stack direction="row" spacing={1} className={styles.actions}>
                    <Button variant="outlined" size="small" onClick={() => navigate(`/superheroes/${id}`)}>
                        Details
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => navigate(`/superheroes/${id}/edit`)}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
                        Delete
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SuperheroCard;
