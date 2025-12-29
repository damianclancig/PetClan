import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import HealthRecord from '@/models/HealthRecord';

export async function POST(req: Request) {
    try {
        const { petId, days } = await req.json();

        if (!petId || typeof days !== 'number') {
            return NextResponse.json({ error: 'Missing petId or days' }, { status: 400 });
        }

        await dbConnect();

        const pet = await Pet.findById(petId);
        if (!pet) {
            return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
        }

        // Shift logic:
        // To simulate that "Days" have passed, we must move the "Birth Date" and events INTO THE PAST.
        // Example: If today is Day 10, and I want it to be Day 15 (Aging +5 days),
        // I must move the Birth Date 5 days back.
        // 5 days = 5 * 24 * 60 * 60 * 1000 ms
        const shiftMillis = days * 24 * 60 * 60 * 1000;

        // 1. Update Pet
        pet.birthDate = new Date(pet.birthDate.getTime() - shiftMillis);

        if (pet.lastWeightUpdate) {
            pet.lastWeightUpdate = new Date(pet.lastWeightUpdate.getTime() - shiftMillis);
        }

        await pet.save();

        // 2. Update Health Records
        const records = await HealthRecord.find({ petId });

        const updatePromises = records.map(async (record) => {
            record.appliedAt = new Date(record.appliedAt.getTime() - shiftMillis);

            // Optional: Also shift nextDueAt if it exists?
            // Usually nextDueAt is calculated, but if it's stored static:
            if (record.nextDueAt) {
                record.nextDueAt = new Date(record.nextDueAt.getTime() - shiftMillis);
            }

            return record.save();
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: `Simulated ${days} days passing.`,
            newAge: new Date(pet.birthDate)
        });

    } catch (error: any) {
        console.error('Time Travel Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
