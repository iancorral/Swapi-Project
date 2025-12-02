import api from "./api";
import type { Post } from "../types/post.interface";

export const PostService = {
    getAll: async (category?: string, search?: string): Promise<Post[]> => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        const { data } = await api.get<Post[]>(`/post?${params.toString()}`);
        return data;
    },

    getOne: async (id: string): Promise<Post> => {
        const { data } = await api.get<Post>(`/post/${id}`);
        return data;
    },

    create: async (formData: FormData): Promise<Post> => {
        const { data } = await api.post<Post>('/post', formData);
        return data;
    }
};