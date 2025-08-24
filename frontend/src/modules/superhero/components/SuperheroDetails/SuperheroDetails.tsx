import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./SuperheroDetails.module.css";
import { Superhero } from "../../services/superheroService.ts";

interface SuperheroDetailsProps {
    hero: Superhero;
    onBack: () => void;
}

const SuperheroDetails: React.FC<SuperheroDetailsProps> = ({ hero, onBack }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/superheroes/${hero.id}/edit`);
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CardContent>
                    <Typography variant="h4" className={styles.title}>
                        {hero.nickname}
                    </Typography>

                    <Stack spacing={1} className={styles.info}>
                        <Typography><b>Real Name:</b> {hero.real_name}</Typography>
                        <Typography>{hero.origin_description}</Typography>
                        <Typography><b>Powers:</b> {hero.superpowers}</Typography>
                        <Typography><b>Catchphrase:</b> {hero.catch_phrase}</Typography>
                    </Stack>

                    {hero.images.length > 0 && (
                        <div className={styles.images}>
                            {hero.images.map((img, idx) => (
                                <img key={idx} src={img.url} alt={hero.nickname} className={styles.image} />
                            ))}
                        </div>
                    )}

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onBack}
                        >
                            Back
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuperheroDetails;
