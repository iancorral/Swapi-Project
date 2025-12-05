import api from "./api";
import type { Post } from "../types/post.interface";

export const UserService = {
    getSavedPosts: async (): Promise<Post[]> => {
        const { data } = await api.get<Post[]>('/user/saved');
        return data; 
    },

    toggleSave: async (postId: string): Promise<{ saved: boolean; message: string }> => {
        const { data } = await api.post(`/user/save/${postId}`);
        return data;
    }
};