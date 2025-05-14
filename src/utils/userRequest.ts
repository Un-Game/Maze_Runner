import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_URL = "https://maze-runner-backend-2.onrender.com";

const instance = axios.create({ baseURL: BASE_URL });

export const getUser = async () => {
    const { data } = await instance.get(`/user`);
    return data
}

export const createUser = async (email: string, password: string, username: string) => {
    const body = { email, password, username }
    const { data } = await instance.post('/user', body)
    return data
};

export const updateUser = async (id: string, updates: {
    password?: string, avatar?: string, exp?: number
}) => {
    const { data } = await instance.put(`/user/${id}`, updates);
    return data;
};

export const updatePassword = async (id: string, password: string) => {
    const { data } = await instance.put(`/user/${id}/password`, { password })
    return data;
}

export const deleteUser = async (id: string) => {
    const { data } = await instance.delete(`/user/${id}`);
    return data;
};
