import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5084/api", // troque pela porta da sua API C#
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;