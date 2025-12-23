import { IHealthRecord } from '@/models/HealthRecord';

/**
 * Sorts health records by:
 * 1. appliedAt (Descending - Newest date first)
 * 2. createdAt (Descending - Newest entry first for same-day records)
 * 3. _id (Descending - Fallback for stability)
 */
export function sortHealthRecords(records: IHealthRecord[]): IHealthRecord[] {
    if (!records) return [];

    return [...records].sort((a, b) => {
        // 1. Applied Date (Time-agnostic comparison for date part, but we have full ISO strings)
        // Ensure we parse consistently (in case they are strings or Date objects)
        // We want desc: b - a
        const dateA = new Date(a.appliedAt).getTime();
        const dateB = new Date(b.appliedAt).getTime();
        const diff = dateB - dateA;
        if (diff !== 0) return diff;

        // 2. Created Date (LIFO)
        const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const createdDiff = createdB - createdA;
        if (createdDiff !== 0) return createdDiff;

        // 3. ID (Fallback)
        const idA = (a._id || '').toString();
        const idB = (b._id || '').toString();
        // localeCompare: referenceStr.localeCompare(compareString)
        // If referenceStr > compareString, returns 1.
        // We want Descending: B compared to A.
        return idB.localeCompare(idA);
    });
}
