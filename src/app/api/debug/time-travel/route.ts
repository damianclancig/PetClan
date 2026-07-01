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
        const shiftMillis = days * 24 * 60 * 60 * 1000;

        // 1. Update Pet (Using updateOne to bypass pre-save hooks if any, or just to be raw)
        // We shift birthDate, lastWeightUpdate, createdAt, updatedAt
        const petUpdates: any = {
            birthDate: new Date(pet.birthDate.getTime() - shiftMillis),
            createdAt: new Date(pet.createdAt.getTime() - shiftMillis),
            updatedAt: new Date(pet.updatedAt.getTime() - shiftMillis),
        };

        if (pet.lastWeightUpdate) {
            petUpdates.lastWeightUpdate = new Date(pet.lastWeightUpdate.getTime() - shiftMillis);
        }

        await Pet.updateOne({ _id: pet._id }, { $set: petUpdates });

        // 2. Update Health Records
        const records = await HealthRecord.find({ petId });

        if (records.length > 0) {
            const bulkOps = records.map((record) => {
                const updates: any = {
                    appliedAt: new Date(record.appliedAt.getTime() - shiftMillis),
                    createdAt: new Date(record.createdAt.getTime() - shiftMillis),
                    updatedAt: record.updatedAt ? new Date(record.updatedAt.getTime() - shiftMillis) : undefined
                };

                if (record.nextDueAt) {
                    updates.nextDueAt = new Date(record.nextDueAt.getTime() - shiftMillis);
                }

                return {
                    updateOne: {
                        filter: { _id: record._id },
                        update: { $set: updates }
                    }
                };
            });

            await HealthRecord.bulkWrite(bulkOps);
        }

        return NextResponse.json({
            success: true,
            message: `Simulated ${days} days passing.`,
            recordsUpdated: records.length
        });

    } catch (error: any) {
        console.error('Time Travel Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
