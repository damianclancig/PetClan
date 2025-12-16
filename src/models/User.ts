import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    image?: string;
    role: 'OWNER' | 'VET' | 'ADMIN';
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: {
        type: String,
        enum: ['OWNER', 'VET', 'ADMIN'],
        default: 'OWNER'
    },
    createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
