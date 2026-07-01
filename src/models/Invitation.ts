/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
    token: string;
    petId: mongoose.Types.ObjectId;
    inviterId: mongoose.Types.ObjectId;
    type?: 'invitation' | 'removal';
    email: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
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
            enum: ['pending', 'accepted', 'rejected', 'expired'],
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
