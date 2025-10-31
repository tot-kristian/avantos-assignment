import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1"; // TODO add base url

export const apiClient = axios.create({ baseURL: baseUrl });
