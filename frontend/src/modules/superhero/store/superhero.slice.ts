import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {Superhero, superheroService} from "../services/superheroService.ts";

interface SuperheroState {
    items: Superhero[];
    selected: Superhero | null;
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: SuperheroState = {
    items: [],
    selected: null,
    total: 0,
    loading: false,
    error: null,
};

export const fetchSuperheroes = createAsyncThunk(
    "superheroes/fetchAll",
    async ({ page, limit }: { page: number; limit: number }) => {
        return await superheroService.getAll(page, limit);
    }
);

export const fetchSuperhero = createAsyncThunk(
    "superheroes/fetchOne",
    async (id: number) => {
        return await superheroService.getById(id);
    }
);

export const createSuperhero = createAsyncThunk(
    "superheroes/create",
    async (hero: FormData) => {
        return await superheroService.create(hero);
    }
);

export const updateSuperhero = createAsyncThunk(
    "superheroes/update",
    async ({ id, hero }: { id: number; hero: FormData }) => {
        return await superheroService.update(id, hero);
    }
);

export const deleteSuperhero = createAsyncThunk(
    "superheroes/delete",
    async (id: number) => {
        return await superheroService.remove(id);
    }
);

const superheroSlice = createSlice({
    name: "superheroes",
    initialState,
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperheroes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuperheroes.fulfilled, (state, action) => {
                state.items = action.payload.data.data;
                state.total = action.payload.data.total;
                state.loading = false;
            })
            .addCase(fetchSuperheroes.rejected, (state, action) => {
                state.error = action.error.message || "Failed to load superheroes";
                state.loading = false;
            })

            .addCase(fetchSuperhero.fulfilled, (state, action) => {
                state.selected = action.payload;
            })

            .addCase(createSuperhero.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(updateSuperhero.fulfilled, (state, action) => {
                const idx = state.items.findIndex((h: Superhero) => h.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })

            .addCase(deleteSuperhero.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((h: Superhero) => h.id !== action.payload);
            });
    },
});

export const { clearSelected, setSelected } = superheroSlice.actions;
export default superheroSlice.reducer;
