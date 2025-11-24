import mongoose, { Document, Schema } from 'mongoose';

// 1. Interface: Define la estructura para TypeScript (Tu seguridad mientras programas)
export interface IUser extends Document {
    firstName: string;
    paternalSurname: string; // Apellido Paterno
    maternalSurname: string; // Apellido Materno
    email: string;
    password: string;
    age: number;
    gender: string;
    phone: string;
    role: 'student' | 'admin'; // Roles definidos en el reporte
    isVerified: boolean; // Para saber si ya validó su correo
    verificationCode?: string; // El código PIN temporal
}

// 2. Schema: Define la estructura para MongoDB (Reglas de la base de datos)
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
        unique: true, // No pueden haber dos correos iguales
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
    timestamps: true // Crea automáticamente campos createdAt y updatedAt
});

// 3. Exportar el Modelo
export default mongoose.model<IUser>('User', UserSchema);