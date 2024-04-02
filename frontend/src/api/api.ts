import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3500/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// include JWT in the Authorization header of every request that requires authentication
api.interceptors.request.use((config) => {
  const token: string | null = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle expired tokens in the response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // If the token has expired, remove it from local storage and redirect the user to the login page
      localStorage.removeItem("token");
      const navigate = useNavigate();
      navigate("/signup");
    }
    return Promise.reject(error);
  }
);

export default api;
