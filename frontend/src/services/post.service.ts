import api from "./api";
import type { Post } from "../types/post.interface";

export const PostService = {
    // Obtener todos los posts (con filtros opcionales para después)
    getAll: async (category?: string, search?: string): Promise<Post[]> => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);

        // Llamada a /api/post
        const { data } = await api.get<Post[]>(`/post?${params.toString()}`);
        return data;
    },

    // Obtener detalle de un post
    getOne: async (id: string): Promise<Post> => {
        const { data } = await api.get<Post>(`/post/${id}`);
        return data;
    }
};