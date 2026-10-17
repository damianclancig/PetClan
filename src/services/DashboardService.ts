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
import HealthRecord from '@/models/HealthRecord';
import User from '@/models/User';
import { HealthAnalysisService } from '@/services/HealthAnalysisService';
import { DashboardData, DashboardPet, DashboardAlert } from '@/types/dashboard';
import { formatAgeTranslated } from '@/lib/dateUtils';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { getTranslations } from 'next-intl/server';

export class DashboardService {
    static async getDashboardData(userId: string): Promise<DashboardData> {
        const tPets = await getTranslations('DashboardView.Pets');
        const tAlerts = await getTranslations('DashboardView.Alerts');

        await dbConnect();

        // 1. Fetch User (for name)
        const user = await User.findById(userId).select('name').lean();
        const userName = user?.name || 'Usuario';

        // 2. Fetch Pets
        const pets = await Pet.find({
            owners: userId,
            status: { $in: ['active', 'lost'] }
        }).sort({ name: 1 }).lean();

        if (!pets.length) {
            return {
                userName,
                pets: [],
                alerts: []
            };
        }

        // 3. Batch fetch all health records for all pets to eliminate N+1 query problem
        const petIds = pets.map(p => p._id);
        const allRecords = await HealthRecord.find({ petId: { $in: petIds } }).lean();

        const recordsByPetId = new Map<string, any[]>();
        for (const record of allRecords) {
            const petIdStr = record.petId.toString();
            let list = recordsByPetId.get(petIdStr);
            if (!list) {
                list = [];
                recordsByPetId.set(petIdStr, list);
            }
            list.push(record);
        }

        // 4. Process Pets & Alerts in-memory
        const dashboardPets: DashboardPet[] = [];
        const allAlerts: DashboardAlert[] = [];

        const plainPets = JSON.parse(JSON.stringify(pets));

        for (const pet of plainPets) {
            const petIdStr = pet._id.toString();
            const plainRecords = JSON.parse(JSON.stringify(recordsByPetId.get(petIdStr) || []));

            // Analyze Alerts
            const analysisAlerts = HealthAnalysisService.analyzePetHealth(pet, plainRecords, tAlerts);

            // Map AnalysisAlerts to DashboardAlerts (DTO)
            const dtoAlerts: DashboardAlert[] = analysisAlerts.map(alert => ({
                id: alert.id,
                type: alert.type,
                title: alert.title,
                message: alert.message,
                link: alert.link,
                severity: alert.severity as 'critical' | 'warning' | 'success',
                date: new Date(alert.date).toISOString() // Ensure Date is string
            }));

            allAlerts.push(...dtoAlerts);

            // Map Pet to DashboardPet (DTO)
            const ageLabel = formatAgeTranslated(pet.birthDate, tPets);

            // Find last weight record
            const lastWeightRecord = plainRecords
                .filter((r: any) => r.type === 'weight')
                .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

            dashboardPets.push({
                _id: petIdStr,
                name: pet.name,
                species: pet.species,
                photoUrl: pet.photoUrl,
                birthDate: new Date(pet.birthDate).toISOString(),
                weight: pet.weight,
                ageLabel,
                identityColor: getPetIdentityColor(petIdStr),
                lastWeightDate: lastWeightRecord ? new Date(lastWeightRecord.appliedAt).toISOString() : undefined,
                status: pet.status
            });
        }

        // 5. Sort Alerts by priority
        const priorityMap: Record<string, number> = { 'critical': 0, 'success': 1, 'warning': 2 };
        allAlerts.sort((a, b) => (priorityMap[a.severity] ?? 99) - (priorityMap[b.severity] ?? 99));

        return {
            userName,
            pets: dashboardPets,
            alerts: allAlerts
        };
    }
}
