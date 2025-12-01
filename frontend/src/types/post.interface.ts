import type { User } from "./user.interface";

export type Category = 'ventas' | 'rentas' | 'servicios' | 'anuncios';

export interface Post {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: Category;
    images: string[];
    author: User | string; 
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}