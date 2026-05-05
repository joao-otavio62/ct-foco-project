import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5084/api", // API C#
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem("ctfoco_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;