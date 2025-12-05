import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    description: string;
    price: number;
    category: 'ventas' | 'rentas' | 'servicios' | 'anuncios';
    images: string[];
    author: Types.ObjectId; 
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
            type: [String], 
            default: []
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true, 
        }
    },
    {
        timestamps: true, 
    }
);
// --- ÍNDICES ESTRATÉGICOS (Para la Rúbrica y Rendimiento) ---

// 1. Índice de Texto:
// Sirve para que el buscador encuentre palabras en título y descripción sin recorrer toda la base de datos.
PostSchema.index({ title: 'text', description: 'text' });

// 2. Índice Compuesto:
// Sirve para optimizar la consulta más frecuente: "Mostrar productos activos de cierta categoría".
PostSchema.index({ category: 1, isActive: 1 });

// 3. Índice Simple:
// Sirve para ordenar rápidamente por precio (menor a mayor o viceversa).
PostSchema.index({ price: 1 });

export default mongoose.model<IPost>('Post', PostSchema);