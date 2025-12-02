import api from "./api";
import type { Post } from "../types/post.interface";

export const UserService = {
    // Obtener mis guardados
    getSavedPosts: async (): Promise<string[]> => {
        // En tu backend, /api/user/saved devuelve los objetos completos.
        // Para verificar rápido si está guardado, podemos mapear solo los IDs o usar la lista completa.
        const { data } = await api.get<Post[]>('/user/saved');
        return data.map(post => post._id);
    },

    // Guardar/Quitar (Toggle)
    toggleSave: async (postId: string): Promise<{ saved: boolean; message: string }> => {
        const { data } = await api.post(`/user/save/${postId}`);
        return data;
    }
};