
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

        // 3. Process Pets & Alerts
        const dashboardPets: DashboardPet[] = [];
        let allAlerts: DashboardAlert[] = [];

        const plainPets = JSON.parse(JSON.stringify(pets));

        for (const pet of plainPets) {
            // Fetch health records
            const records = await HealthRecord.find({ petId: pet._id }).lean();
            const plainRecords = JSON.parse(JSON.stringify(records));

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

            allAlerts = [...allAlerts, ...dtoAlerts];

            // Map Pet to DashboardPet (DTO)
            const ageLabel = formatAgeTranslated(pet.birthDate, tPets);

            // Find last weight record
            const lastWeightRecord = plainRecords
                .filter((r: any) => r.type === 'weight')
                .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

            dashboardPets.push({
                _id: pet._id,
                name: pet.name,
                species: pet.species,
                photoUrl: pet.photoUrl,
                birthDate: new Date(pet.birthDate).toISOString(),
                weight: pet.weight,
                ageLabel,
                identityColor: getPetIdentityColor(pet._id),
                lastWeightDate: lastWeightRecord ? new Date(lastWeightRecord.appliedAt).toISOString() : undefined,
                status: pet.status
            });
        }

        // 4. Sort Alerts
        const priorityMap: Record<string, number> = { 'critical': 0, 'success': 1, 'warning': 2 };
        allAlerts.sort((a, b) => (priorityMap[a.severity] ?? 99) - (priorityMap[b.severity] ?? 99));

        return {
            userName,
            pets: dashboardPets,
            alerts: allAlerts
        };
    }
}
