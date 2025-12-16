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
    owners: Types.ObjectId[];
    createdAt: Date;
}

const PetSchema = new Schema<IPet>({
    name: { type: String, required: true },
    species: {
        type: String,
        enum: ['dog', 'cat', 'other'],
        required: true
    },
    breed: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    weight: { type: Number, required: true },
    chipId: { type: String },
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

const Pet: Model<IPet> = mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema);

export default Pet;
