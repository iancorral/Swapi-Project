import axios from 'axios';

// Detecta automáticamente:
// - Si estás en Vercel, usa la variable de entorno VITE_API_URL
// - Si estás en tu compu, usa localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
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