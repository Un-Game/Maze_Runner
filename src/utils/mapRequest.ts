import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const instance = axios.create({ baseURL: BASE_URL });

export const getMap = async () => {
    const { data } = await instance.get(`/map`);
    return data
}

export const createMap = async (name: string, layout: string, start_points: { player1: string; player2: string }) => {
    const body = { name, layout, start_points };
    const { data } = await instance.post("/map", body);
    return data;
};

export const updateMap = async (id: string, updates: { name?: string; layout?: string; start_points?: { player1: string; player2: string }; }) => {
    const { data } = await instance.put(`/map/${id}`, updates);
    return data;
};

export const deleteMap = async (id: string) => {
    const { data } = await instance.delete(`/map/${id}`);
    return data;
};
