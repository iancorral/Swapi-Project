import mongoose, { Document, Schema, Types } from 'mongoose';

// 1. Interface: Define la estructura para TypeScript
export interface IUser extends Document {
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    phone: string;
    role: 'student' | 'admin';
    isVerified: boolean;
    verificationCode?: string;
    savedPosts: Types.ObjectId[];
}

// 2. Schema: Define la estructura para MongoDB
const UserSchema: Schema = new Schema(
    {
        firstName: { 
            type: String, 
            required: true,
            trim: true 
        },
        paternalSurname: { 
            type: String, 
            required: true,
            trim: true 
        },
        maternalSurname: { 
            type: String, 
            required: true,
            trim: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true,
            trim: true
        },
        password: { 
            type: String, 
            required: true 
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        role: { 
            type: String, 
            enum: ['student', 'admin'], 
            default: 'student' 
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        verificationCode: { 
            type: String 
        },

        savedPosts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Índice para borrar usuarios no verificados (ej. códigos expiran)
UserSchema.index(
    { createdAt: 1 },
    { 
        expireAfterSeconds: 900,
        partialFilterExpression: { isVerified: false } 
    }
);

// 3. Exportar el modelo
export default mongoose.model<IUser>('User', UserSchema);
