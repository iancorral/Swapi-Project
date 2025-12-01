import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user.interface';

// Definimos qué datos tendrá nuestro estado global
interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    
    // Acciones (Métodos para modificar el estado)
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

// Creamos el store con persistencia (se guarda solo en localStorage)
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            // Acción para guardar sesión (Login exitoso)
            setAuth: (token, user) => {
                // Guardamos también en localStorage manual para el interceptor de Axios
                localStorage.setItem('token', token);
                set({ token, user, isAuthenticated: true });
            },

            // Acción para cerrar sesión
            logout: () => {
                localStorage.removeItem('token');
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // Nombre con el que se guarda en el navegador
        }
    )
);