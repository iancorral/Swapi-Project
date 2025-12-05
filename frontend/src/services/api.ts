// src/services/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Cambia a tu IP o URL de producción
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;