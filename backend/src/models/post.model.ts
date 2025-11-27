import mongoose, { Document, Schema, Types } from 'mongoose';

// Definimos la estructura de datos
export interface IPost extends Document {
    title: string;
    description: string;
    price: number;
    category: 'ventas' | 'rentas' | 'servicios' | 'anuncios';
    images: string[]; // Guardaremos URLs de las imágenes (por ahora strings)
    author: Types.ObjectId; // Relación con el Usuario que lo creó
    isActive: boolean;
}

const PostSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ['ventas', 'rentas', 'servicios', 'anuncios'],
            required: true,
        },
        images: {
            type: [String], // Array de strings
            default: []
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Importante: Esto conecta con tu modelo de usuarios
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true, // Por si quieres borrarlo lógicamente después
        }
    },
    {
        timestamps: true, // Crea createdAt y updatedAt automático
    }
);

export default mongoose.model<IPost>('Post', PostSchema);