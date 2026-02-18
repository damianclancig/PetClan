import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IPet {
    _id?: string;
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed: string;
    birthDate: Date;
    sex: 'male' | 'female';
    weight: number;
    chipId?: string;
    photoUrl?: string; // Base64 optimised image
    characteristics?: string;
    diseases?: string;
    treatments?: string;
    notes?: string;
    lastWeightUpdate?: Date;
    environment: 'indoor' | 'outdoor' | 'mixed';
    riskLevel: 'low' | 'medium' | 'high';
    status: 'active' | 'lost' | 'deceased' | 'archived';
    owners: Types.ObjectId[];
    deathDate?: Date; // New field for deceased pets
    createdAt: Date;
    updatedAt: Date;
}

const PetSchema = new Schema<IPet>({
    name: { type: String, required: true },
    species: { type: String, enum: ['dog', 'cat', 'other'], required: true },
    breed: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: { type: String, enum: ['male', 'female'], required: true },
    weight: { type: Number, required: true },
    lastWeightUpdate: { type: Date },
    environment: {
        type: String,
        enum: ['indoor', 'outdoor', 'mixed'],
        default: 'indoor'
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    chipId: { type: String },
    photoUrl: { type: String },
    characteristics: { type: String },
    diseases: { type: String },
    treatments: { type: String },
    notes: { type: String },
    status: {
        type: String,
        enum: ['active', 'lost', 'deceased', 'archived'],
        default: 'active',
        required: true
    },
    deathDate: { type: Date }, // Optional
    owners: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Prevent Mongoose overwrite warning in development
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Pet) {
        delete mongoose.models.Pet;
    }
}

const Pet: Model<IPet> = mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema);

export default Pet;
