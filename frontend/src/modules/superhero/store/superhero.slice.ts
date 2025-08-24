import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Superhero, superheroService } from "../services/superheroService.ts";
import axios from "axios";

interface SuperheroState {
    items: Superhero[];
    selected: Superhero | null;
    total: number;
    loading: boolean;
    errors: string[] | null;
}

const initialState: SuperheroState = {
    items: [],
    selected: null,
    total: 0,
    loading: false,
    errors: [],
};


const handleError = (err: unknown): string[] => {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        return Array.isArray(msg) ? msg : [msg];
    }

    if (err instanceof Error) {
        return [err.message];
    }

    return ["Unknown error"];
};

export const fetchSuperheroes = createAsyncThunk(
    "superheroes/fetchAll",
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            return await superheroService.getAll(page, limit);
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const fetchSuperhero = createAsyncThunk(
    "superheroes/fetchOne",
    async (id: number, { rejectWithValue }) => {
        try {
            return await superheroService.getById(id);
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const createSuperhero = createAsyncThunk(
    "superheroes/create",
    async (hero: FormData, { rejectWithValue }) => {
        try {
            return await superheroService.create(hero);
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const updateSuperhero = createAsyncThunk(
    "superheroes/update",
    async ({ id, hero }: { id: number; hero: FormData }, { rejectWithValue }) => {
        try {
            return await superheroService.update(id, hero);
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const deleteSuperhero = createAsyncThunk(
    "superheroes/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await superheroService.remove(id);
            return id;
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

const superheroSlice = createSlice({
    name: "superheroes",
    initialState,
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
        setSelected: (state, action: PayloadAction<Superhero>) => {
            state.selected = action.payload;
        },
        clearError: (state) => {
            state.errors = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperheroes.pending, (state) => {
                state.loading = true;
                state.errors = [];
            })
            .addCase(fetchSuperheroes.fulfilled, (state, action) => {
                state.items = action.payload.data.data;
                state.total = action.payload.data.total;
                state.loading = false;
            })
            .addCase(fetchSuperheroes.rejected, (state, action) => {
                state.errors = action.payload as string[];
                state.loading = false;
            })

            .addCase(fetchSuperhero.fulfilled, (state, action) => {
                state.selected = action.payload;
            })
            .addCase(fetchSuperhero.rejected, (state, action) => {
                state.errors = action.payload as string[];
            })

            .addCase(createSuperhero.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(createSuperhero.rejected, (state, action) => {
                state.errors = action.payload as string[];
            })

            .addCase(updateSuperhero.fulfilled, (state, action) => {
                const idx = state.items.findIndex((h: Superhero) => h.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateSuperhero.rejected, (state, action) => {
                state.errors = action.payload as string[];
            })

            .addCase(deleteSuperhero.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((h: Superhero) => h.id !== action.payload);
            })
            .addCase(deleteSuperhero.rejected, (state, action) => {
                state.errors = action.payload as string[];
            });
    },
});

export const { clearSelected, setSelected, clearError } = superheroSlice.actions;
export default superheroSlice.reducer;
