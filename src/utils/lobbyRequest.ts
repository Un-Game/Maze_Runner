import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_URL = "https://maze-runner-backend-1.onrender.com";

const instance = axios.create({ baseURL: BASE_URL });

export const getLobby = async () => {
    const { data } = await instance.get(`/lobby`);
    return data
}

export const createLobby = async (players: string[], map: string, status: string, game_mode: string, isPrivate: boolean, name: string) => {
    const body = { players, map, status, game_mode, isPrivate, name };
    const { data } = await instance.post(`/lobby`, body);
    return data
}

export const updateLobby = async (id: string, updates: { players?: string[]; status?: string; game_mode?: string; map?: string; name?: string }) => {
    const { data } = await instance.put(`/lobby/${id}`, updates);
    return data;
};

export const deleteLobby = async (id: string) => {
    const { data } = await instance.delete(`/lobby/${id}`);
    return data;
};
