import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    paternalSurname: string;
    maternalSurname?: string; 
    email: string;
    password: string;
    age?: number;   
    gender?: string; 
    phone: string;
    role: 'student' | 'admin';
    isVerified: boolean;
    verificationCode?: string;
    savedPosts: Types.ObjectId[];
}

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
            required: false, 
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
            required: false 
        },
        gender: {
            type: String,
            required: false 
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

UserSchema.index(
    { createdAt: 1 },
    { 
        expireAfterSeconds: 900,
        partialFilterExpression: { isVerified: false } 
    }
);

export default mongoose.model<IUser>('User', UserSchema);