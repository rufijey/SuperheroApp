import React, { useEffect } from "react";
import { Pagination, Stack, Button } from "@mui/material";
import styles from "./SuperheroList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../shared/store/store.ts";
import { fetchSuperheroes } from "../../store/superhero.slice.ts";
import { useSearchParams, useNavigate } from "react-router-dom";
import SuperheroCard from "../SuperheroCard/SuperheroCard.tsx";
import Loader from "../../../../shared/components/UI/loader/Loader.tsx";

const SuperheroList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, total } = useSelector((state: RootState) => state.superheroes);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(searchParams.get("page")) || 1;
    const limit = 5;

    useEffect(() => {
        dispatch(fetchSuperheroes({ page, limit }));
    }, [dispatch, page]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({ page: value.toString() });
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <div className={styles.createButtonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/superheroes/create")}
                >
                    + Create Superhero
                </Button>
            </div>

            <Stack spacing={2}>
                {items.map((hero) => (
                    <SuperheroCard
                        key={hero.id}
                        id={hero.id!}
                        nickname={hero.nickname}
                        images={hero.images}
                        page={page}
                        limit={limit}
                    />
                ))}
            </Stack>

            <div className={styles.pagination}>
                <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
};

export default SuperheroList;
