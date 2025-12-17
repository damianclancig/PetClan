import { IHealthRecord } from '@/models/HealthRecord';
import dayjs from 'dayjs';

export type VaccineStatus = {
    isUpToDate: boolean;
    overdueCount: number;
    hasRabies: boolean;
    rabiesExpires?: Date;
    totalVaccines: number;
};

// Helper for type guard if we are using raw objects from API
interface SimpleHealthRecord {
    type: string;
    title: string;
    appliedAt: string | Date; // API dates come as strings often
    nextDueAt?: string | Date;
}

export function calculateVaccineStatus(records: SimpleHealthRecord[]): VaccineStatus {
    const vaccines = records.filter(r => r.type === 'vaccine');
    const now = dayjs();

    let overdueCount = 0;
    let hasRabies = false;
    let rabiesExpires: Date | undefined = undefined;

    for (const v of vaccines) {
        // Check for Rabies
        // Regex for Rabies, Antirábica, Rabia (case insensitive)
        if (/rabia|antirábica|rabies/i.test(v.title)) {
            const dueDate = v.nextDueAt ? dayjs(v.nextDueAt) : null;

            // If it has a due date in the future, OR no due date (assuming it's valid if recent? No, usually valid if not expired)
            // Strict check: valid if nextDueAt is future.
            if (dueDate && dueDate.isAfter(now)) {
                hasRabies = true;
                rabiesExpires = v.nextDueAt ? new Date(v.nextDueAt) : undefined;
            } else if (!v.nextDueAt) {
                // If no due date, maybe valid forever or we don't know? 
                // Let's assume valid for now if applied recently? 
                // Better safe: Only count as "Has Rabies" if we know it's not expired. 
                // But typically if you just applied it, it's valid.
                // Let's count it as valid if applied < 1 year ago if no due date provided?
                // Or just simpler: If title matches, and NOT expired.
                hasRabies = true;
            }
        }

        // Check Overdue
        if (v.nextDueAt) {
            if (dayjs(v.nextDueAt).isBefore(now, 'day')) {
                overdueCount++;
            }
        }
    }

    // Up to date if NO overdue vaccines
    const isUpToDate = overdueCount === 0;

    return {
        isUpToDate,
        overdueCount,
        hasRabies,
        rabiesExpires,
        totalVaccines: vaccines.length
    };
}
