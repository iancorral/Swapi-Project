// Define la estructura de un Usuario
export interface User {
    _id: string; // MongoDB siempre devuelve _id
    firstName: string;
    paternalSurname?: string; // Opcional porque en tu modelo no es 'required' estricto a veces
    email: string;
    phone: string;
    role: 'user' | 'admin'; // Tipado estricto de roles
    avatar?: string; // Para la foto de perfil futura
    isVerified: boolean;
    savedPosts?: string[]; // Array de IDs de posts guardados
    createdAt?: string;
    updatedAt?: string;
}