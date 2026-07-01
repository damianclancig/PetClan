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

import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IHealthRecord {
    petId: Types.ObjectId;
    type: 'vaccine' | 'deworming' | 'consultation' | 'weight';
    weightValue?: number;
    vaccineType?: string;
    dewormingType?: 'internal' | 'external';
    durationDays?: number; // Duración del producto externo en días (independiente del idioma)
    title: string;
    description?: string;
    appliedAt: Date;
    nextDueAt?: Date;
    vetName?: string;
    clinicName?: string;
    createdBy: Types.ObjectId;
    version: number;
    createdAt: Date;
    updatedAt?: Date;
    _id?: Types.ObjectId | string;
}

const HealthRecordSchema = new Schema<IHealthRecord>({
    petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    type: {
        type: String,
        enum: ['vaccine', 'deworming', 'consultation', 'weight'],
        required: true
    },
    weightValue: { type: Number },
    vaccineType: { type: String }, // Opcional, solo si type === 'vaccine'
    dewormingType: { type: String, enum: ['internal', 'external'] }, // Opcional, solo si type === 'deworming'
    durationDays: { type: Number }, // Duración (días) del producto externo
    title: { type: String, required: true },
    description: { type: String },
    appliedAt: { type: Date, required: true },
    nextDueAt: { type: Date },
    vetName: { type: String },
    clinicName: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: Number, default: 1 },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` on save
HealthRecordSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const HealthRecord: Model<IHealthRecord> = mongoose.models.HealthRecord || mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);

export default HealthRecord;
