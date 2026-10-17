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

import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import HealthRecord from '@/models/HealthRecord';
import { calculateVaccineStatus } from '@/lib/healthUtils';
import mongoose from 'mongoose';

// Ensure User schema is registered to prevent MissingSchemaError on populate
if (!User) {
    console.warn("User model not loaded.");
}

export interface PublicPetData {
    pet: any;
    owners: any[];
    vaccineStatus: any;
    healthRecords: any[];
}

export class PublicPetService {
    static async getPublicPetProfile(id: string): Promise<PublicPetData | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        try {
            await dbConnect();

            const pet = await Pet.findById(id)
                .populate('owners', 'name image email')
                .lean();

            if (!pet) {
                return null;
            }

            const rawRecords = await HealthRecord.find({
                petId: id,
                type: { $in: ['vaccine', 'deworming'] }
            }).sort({ appliedAt: -1 }).lean();

            const vaccineStatus = calculateVaccineStatus(rawRecords);

            const filteredRecords = rawRecords
                .filter(r => ['vaccine', 'deworming'].includes(r.type))
                .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                .slice(0, 30);

            // Serialization for Client Component boundary
            const serializedPet = JSON.parse(JSON.stringify(pet));
            const serializedOwners = JSON.parse(JSON.stringify(pet.owners || []));
            const serializedRecords = JSON.parse(JSON.stringify(filteredRecords));

            return {
                pet: serializedPet,
                owners: serializedOwners,
                vaccineStatus,
                healthRecords: serializedRecords,
            };
        } catch (error) {
            console.error("Error in PublicPetService.getPublicPetProfile:", error);
            return null;
        }
    }
}
