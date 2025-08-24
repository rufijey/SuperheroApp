import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchSuperhero, clearSelected } from "../../modules/superhero/store/superhero.slice";

export const useSelectedSuperhero = (id: number | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selected, loading } = useSelector((state: RootState) => state.superheroes);

    useEffect(() => {
        if (id !== null) {
            dispatch(fetchSuperhero(id));
        }
        return () => {
            dispatch(clearSelected());
        };
    }, [dispatch, id]);

    return { selected, loading };
};
