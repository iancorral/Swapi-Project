export interface User {
    _id: string; 
    firstName: string;
    paternalSurname?: string; 
    email: string;
    phone: string;
    role: 'user' | 'admin'; 
    avatar?: string; 
    isVerified: boolean;
    savedPosts?: string[]; 
    createdAt?: string;
    updatedAt?: string;
}