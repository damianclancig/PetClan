import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IHealthRecord {
    petId: Types.ObjectId;
    type: 'vaccine' | 'deworming' | 'consultation' | 'weight';
    weightValue?: number;
    vaccineType?: string;
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
