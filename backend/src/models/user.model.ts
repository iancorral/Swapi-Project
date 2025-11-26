import mongoose, { Document, Schema } from 'mongoose';

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
}

// 2. Schema: Define la estructura para MongoDB
const UserSchema: Schema = new Schema({
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
    }
}, {
    timestamps: true
});

UserSchema.index({ createdAt: 1 }, { 
    expireAfterSeconds: 900, 
    partialFilterExpression: { isVerified: false } 
});

// 3. Exportar el Modelo
export default mongoose.model<IUser>('User', UserSchema);