import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'health' | 'invitation' | 'social' | 'system';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Optimizes queries by user
        },
        type: {
            type: String,
            enum: ['health', 'invitation', 'social', 'system'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '90d', // Auto-delete after 90 days (TTL)
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation error in Next.js
export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
