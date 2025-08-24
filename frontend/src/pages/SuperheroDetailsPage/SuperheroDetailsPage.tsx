import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SuperheroDetails from "../../modules/superhero/components/SuperheroDetails/SuperheroDetails";
import {useSelectedSuperhero} from "../../shared/hooks/useSelectedSuperhero.ts";
import Loader from "../../shared/components/UI/loader/Loader.tsx";

const SuperheroDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const heroId = id ? Number(id) : null;
    const navigate = useNavigate();
    const { selected: hero, loading } = useSelectedSuperhero(heroId);

    if (!heroId) return <div>Invalid ID</div>;
    if (loading || !hero) return <Loader />;

    return <SuperheroDetails hero={hero} onBack={() => navigate(-1)} />;
};

export default SuperheroDetailsPage;
