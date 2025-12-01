import type { User } from "./user.interface"; 

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    paternalSurname: string;
    email: string;
    phone: string;
    password: string;
}