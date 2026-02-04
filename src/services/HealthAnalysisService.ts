import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { VeterinaryRules } from '@/utils/veterinaryRules';

export interface HealthAlert {
    id: string; // Unique virtual ID for this alert
    type: 'health';
    title: string;
    message: string;
    link: string;
    severity: 'warning' | 'critical'; // warning (upcoming), critical (overdue)
    date: Date; // Effective date (dueDate or today)
}

export class HealthAnalysisService {

    /**
     * Analyzes a pet's health history and returns a list of active alerts.
     */
    static analyzePetHealth(pet: IPet, records: IHealthRecord[]): HealthAlert[] {
        const alerts: HealthAlert[] = [];

        // 1. Analyze Weight
        const weightAlert = this.checkWeightStatus(pet);
        if (weightAlert) alerts.push(weightAlert);

        // 2. Analyze Vaccines & Deworming
        const medicalAlerts = this.checkMedicalRecords(pet, records);
        alerts.push(...medicalAlerts);

        return alerts;
    }

    /**
     * Checks if weight update is overdue based on age.
     */
    private static checkWeightStatus(pet: IPet): HealthAlert | null {
        if (!pet.lastWeightUpdate) return null;

        const today = new Date();
        const lastUpdate = new Date(pet.lastWeightUpdate);
        const birthDate = new Date(pet.birthDate);

        const isPuppy = VeterinaryRules.isPuppy(birthDate);
        const daysThreshold = isPuppy ? 15 : 30; // 15 days puppy, 30 adult

        const daysSinceLastUpdate = differenceInDays(today, lastUpdate);

        if (daysSinceLastUpdate > daysThreshold) {
            return {
                id: `weight-${pet._id}`,
                type: 'health',
                title: `Actualización de Peso: ${pet.name}`,
                message: `Hace ${daysSinceLastUpdate} días que no registras el peso de ${pet.name}. ` +
                    `Para su edad (${isPuppy ? 'Cachorro' : 'Adulto'}), recomendamos control cada ${daysThreshold} días.`,
                link: `/dashboard/pets/${pet._id}?tab=health`,
                severity: 'warning',
                date: today
            };
        }
        return null;
    }

    /**
     * Checks vaccines and deworming for overdue status.
     * Uses "Lifeline" logic: Groups by vaccine line (e.g. Rabies) and checks if the LINE is valid.
     */
    private static checkMedicalRecords(pet: IPet, records: IHealthRecord[]): HealthAlert[] {
        const alerts: HealthAlert[] = [];
        const today = new Date();

        // 1. Filter relevant records
        const medicalRecords = records.filter(r => r.type === 'vaccine' || r.type === 'deworming');

        // 2. Group by Normalized Category (The "Line" of treatment)
        // e.g. "Rabies" bucket, "Polyvalent" bucket.
        const healthLines = new Map<string, IHealthRecord[]>();

        for (const record of medicalRecords) {
            const key = this.getGroupKey(record);
            if (!healthLines.has(key)) {
                healthLines.set(key, []);
            }
            healthLines.get(key)?.push(record);
        }

        // 3. Evaluate each Line
        for (const [key, lineRecords] of healthLines.entries()) {
            // Sort by appliedAt DESC (Newest first)
            const sortedLine = lineRecords.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
            const latestRecord = sortedLine[0];

            if (!latestRecord) continue;

            // DETERMINE DUE DATE
            // Priority 1: Manual nextDueAt
            // Priority 2: Calculated via VetRules
            let effectiveDueDate: Date;

            if (latestRecord.nextDueAt) {
                effectiveDueDate = new Date(latestRecord.nextDueAt);
            } else {
                // Auto-calculate logic
                effectiveDueDate = VeterinaryRules.calculateNextDueDate(
                    latestRecord.type as 'vaccine' | 'deworming',
                    this.getSubtype(latestRecord),
                    new Date(latestRecord.appliedAt),
                    new Date(pet.birthDate)
                );
            }

            const daysUntilDue = differenceInCalendarDays(effectiveDueDate, today);

            // ANALYZE STATUS
            // If daysUntilDue > 7, it's valid. No alert.
            // If daysUntilDue < 0, it's overdue.
            // If 0 <= daysUntilDue <= 7, it's upcoming.

            // CRITICAL CHECK: "Lifeline" validity
            // If the *latest* record seems expired by manual date, check if Biological Rule says otherwise?
            // (e.g. User put due date 1 month ago, but vet rule says 1 year).
            // For now, we trust the manual date if present, OR our calc if not.

            if (daysUntilDue < 0) {
                // OVERDUE
                const daysOverdue = Math.abs(daysUntilDue);
                alerts.push({
                    id: `med-overdue-${latestRecord._id}`,
                    type: 'health',
                    title: `¡Atención! ${latestRecord.title} vencida`,
                    message: `${pet.name} tiene ${latestRecord.title} vencida hace ${daysOverdue} días. Por favor actualiza su historial.`,
                    link: `/dashboard/pets/${pet._id}?tab=health`,
                    severity: 'critical',
                    date: effectiveDueDate
                });
            } else if (daysUntilDue <= 7) {
                // UPCOMING
                alerts.push({
                    id: `med-upcoming-${latestRecord._id}`,
                    type: 'health',
                    title: `Recordatorio: ${latestRecord.title}`,
                    message: `${latestRecord.title} para ${pet.name} vence en ${daysUntilDue === 0 ? 'hoy' : daysUntilDue + ' días'}.`,
                    link: `/dashboard/pets/${pet._id}?tab=health`,
                    severity: 'warning',
                    date: effectiveDueDate
                });
            }
        }

        return alerts;
    }

    /**
     * Generates a grouping key based on biological type.
     */
    private static getGroupKey(record: IHealthRecord): string {
        if (record.type === 'vaccine') {
            const raw = record.vaccineType || record.title;
            const normalized = VeterinaryRules.normalizeVaccineType(raw);
            // If 'other', use name to avoid grouping distinct 'other' vaccines together?
            // Better to group by name if 'other'.
            if (normalized === 'other') return this.cleanString(record.title);
            return normalized;
        } else {
            // Deworming
            const type = record.dewormingType || (record.title.toLowerCase().includes('interna') ? 'internal' : 'external');
            return `deworming-${type}`;
        }
    }

    private static getSubtype(record: IHealthRecord): string {
        if (record.type === 'vaccine') return record.vaccineType || record.title;
        return record.dewormingType || (record.title.toLowerCase().includes('interna') ? 'internal' : 'external');
    }

    private static cleanString(str: string): string {
        if (!str) return 'unknown';
        return str.toLowerCase().trim();
    }
}
