import { configureStore } from "@reduxjs/toolkit";
import superheroReducer from '../../modules/superhero/store/superhero.slice.ts';

export const createStore = () => {
    return configureStore({
        reducer: {
            superheroes: superheroReducer,
        },
    });
};

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export const store = createStore();
