import axios from "axios";

const baseUrl = import.meta.env.VITE_AVANTOS_BASE_URL;

export const apiClient = axios.create({ baseURL: baseUrl });
