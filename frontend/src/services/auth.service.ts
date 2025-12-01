import api from "./api"; // Importamos la instancia de Axios que configuramos antes
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth.interface";

export const AuthService = {
    // Función para Iniciar Sesión
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        // Axios ya devuelve la respuesta en 'data', y le decimos que esperamos un AuthResponse
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    // Función para Registrarse
    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        return data;
    }
};