import api from "./api"; 
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth.interface";

export const AuthService = {
    // Función para Iniciar Sesión
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {

        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    // Función para Registrarse
    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        return data;

    },
    verifyCode: async (email: string, code: string): Promise<any> => {

        const { data } = await api.post('/auth/verify', { email, code });
        return data;
    }
};