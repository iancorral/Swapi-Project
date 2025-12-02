import api from "./api";
import type { Post } from "../types/post.interface";

export const UserService = {
    // Obtener mis guardados (OBJETOS COMPLETOS)
    getSavedPosts: async (): Promise<Post[]> => {
        const { data } = await api.get<Post[]>('/user/saved');
        // DEVOLVEMOS DATA DIRECTAMENTE (Arrays de Objetos), NO SOLO LOS IDS
        return data; 
    },

    // Guardar/Quitar (Toggle)
    toggleSave: async (postId: string): Promise<{ saved: boolean; message: string }> => {
        const { data } = await api.post(`/user/save/${postId}`);
        return data;
    }
};