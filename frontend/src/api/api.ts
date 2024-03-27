import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3500/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// include JWT in the Authorization header of every request that requires authentication
// api.interceptors.request.use((config) => {
//   const token: string | null = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
