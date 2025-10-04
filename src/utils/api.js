import axios from "axios";

const api = axios.create({
  baseURL: "https://workasana-backend-liard.vercel.app/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from context
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;