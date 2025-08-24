import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SuperheroForm } from "../../modules/superhero/components/SuperheroForm/SuperheroForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../shared/store/store";
import { updateSuperhero} from "../../modules/superhero/store/superhero.slice";
import { CircularProgress } from "@mui/material";
import {useSelectedSuperhero} from "../../shared/hooks/useSelectedSuperhero.ts";

const EditSuperheroPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const heroId = id ? Number(id) : null;
    const { selected, loading } = useSelectedSuperhero(heroId);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (fd: FormData) => {
        if (!heroId) return;

        try{
            await dispatch(updateSuperhero({ id: heroId, hero: fd })).unwrap();
            navigate(`/superheroes/${heroId}`);
        }
        catch(err){
            console.log(err);
        }
    };

    if (!heroId) return <div>Invalid ID</div>;
    if (loading || !selected) return <CircularProgress />;

    return (
        <div>
            <h2 className="title">Edit Superhero</h2>
            <SuperheroForm initialData={selected} onSubmit={handleSubmit} />
        </div>
    );
};

export default EditSuperheroPage;
