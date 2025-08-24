import axios from "axios";

const API_URL = "http://localhost:3000/superhero";

export interface Superhero {
    id?: number;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string;
    catch_phrase: string;
    images: Image[];
}

export interface Image {
    id: number;
    path: string;
    url: string;
}

export const superheroService = {
    getAll: async (page: number, limit: number = 5) => {
        const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
        return { data: res.data, total: Number(res.headers["x-total-count"]) || 0 };
    },
    getById: async (id: number) => {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    },
    create: async (hero: FormData) => {
        const res = await axios.post(API_URL, hero);
        return res.data;
    },
    update: async (id: number, hero: FormData) => {
        const res = await axios.patch(`${API_URL}/${id}`, hero);
        return res.data;
    },
    remove: async (id: number) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    },
};
