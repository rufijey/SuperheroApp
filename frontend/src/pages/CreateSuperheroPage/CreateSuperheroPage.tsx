import React from "react";
import { useNavigate } from "react-router-dom";
import {AppDispatch} from "../../shared/store/store.ts";
import {createSuperhero} from "../../modules/superhero/store/superhero.slice.ts";
import {useDispatch} from "react-redux";
import {SuperheroForm} from "../../modules/superhero/components/SuperheroForm/SuperheroForm.tsx";


const CreateSuperheroPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (fd: FormData) => {
        try{
            await dispatch(createSuperhero(fd)).unwrap();
            navigate("/");
        }
        catch(err){
            console.log(err);
        }
    };

    return (
        <div>
            <h2 className="title">Create Superhero</h2>
            <SuperheroForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateSuperheroPage;
