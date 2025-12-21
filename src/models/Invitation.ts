import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
    token: string;
    petId: mongoose.Types.ObjectId;
    inviterId: mongoose.Types.ObjectId;
    type?: 'invitation' | 'removal';
    email: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    expiresAt?: Date;
}

const InvitationSchema = new Schema<IInvitation>(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        petId: {
            type: Schema.Types.ObjectId,
            ref: 'Pet',
            required: true,
        },
        inviterId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['invitation', 'removal'],
            default: 'invitation',
        },
        email: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation error in Next.js
export default mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);
