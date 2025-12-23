import dayjs from 'dayjs';
import { VACCINATION_SCHEDULE, VACCINES, ScheduleEvent } from '@/lib/vaccinationRules';
import { IHealthRecord } from '@/models/HealthRecord';
import { IPet } from '@/models/Pet';

export interface VaccinationStatus {
    vaccineName: string;
    dueDate: Date;
    status: 'pending' | 'applied' | 'overdue' | 'upcoming';
    doseNumber: number;
    description?: string;
    isMandatory: boolean;
    vaccineId?: string;
}

export function getVaccinationStatus(pet: IPet, healthRecords: IHealthRecord[]) {
    // Logic Split:
    // 1. Fixed "Puppy" milestones (relevant for historical record or if pet is still young/unvaccinated).
    // 2. Dynamic "Next Booster" (calculated from Last Dose).

    const birthDate = dayjs(pet.birthDate);
    const today = dayjs();
    const species = pet.species as 'dog' | 'cat';
    if (!VACCINATION_SCHEDULE[species]) return [];

    const schedule: VaccinationStatus[] = [];

    // --- 1. Process Puppy Milestones --- 
    // We only create specific puppy items if they are RELEVANT.
    // However, usually we want to see the "history" of what should have happened.
    // If the pet is an adult and missed these, we might mark them as 'skipped' or simply 'overdue' 
    // BUT if a later adult dose effectively covers it, we mark them as 'superseded' (conceptually applied or not needed).

    const youngSchedule = species === 'dog' ? VACCINATION_SCHEDULE.dog.puppy : VACCINATION_SCHEDULE.cat.kitten;

    // Identify which vaccines are "core" / "recurring" to handle boosters
    const distinctVaccineIds = Array.from(new Set(youngSchedule.map(e => e.vaccineId)));

    // For each Vaccine Type, we track the "Latest Applied Date" to calculate next booster
    const vaccineStatusMap: Record<string, { lastDate?: Date, count: number }> = {};

    // Initialize map
    distinctVaccineIds.forEach(vid => { vaccineStatusMap[vid] = { count: 0 } });

    // --- 2. Analyze Records First ---
    healthRecords.forEach(r => {
        if (r.type !== 'vaccine') return;
        // Match record to vaccine ID
        const matchedId = r.vaccineType || Object.keys(VACCINES).find(k => r.title.toLowerCase().includes(VACCINES[k].name.toLowerCase()));

        if (matchedId && vaccineStatusMap[matchedId]) {
            vaccineStatusMap[matchedId].count++;
            const appliedDate = new Date(r.appliedAt);
            if (!vaccineStatusMap[matchedId].lastDate || appliedDate > new Date(vaccineStatusMap[matchedId].lastDate!)) {
                vaccineStatusMap[matchedId].lastDate = appliedDate; // Keep newest
            }
        }
    });

    // --- 3. Build Status List ---

    // A. Puppy Milestones
    youngSchedule.forEach((event: ScheduleEvent) => {
        const dueDate = birthDate.add(event.ageDays, 'day');
        const vaccine = VACCINES[event.vaccineId];

        // Find if we have a record that "matches" this specific dose? 
        // Heuristic: If we have X records, we assume records 1..X satisfy doses 1..X of the schedule.
        // LIMITATION: If I got a dose at 2 years old, does it satisfy the "45 day" dose? 
        // YES, in the sense that the requirement is met. We don't want to say "45 day overdue".

        let status: 'pending' | 'applied' | 'overdue' | 'upcoming' | 'superseded' = 'pending';

        // Does a record exist?
        // We match strictly by count for the puppy phase items.
        // i.e. Dose 1 needs at least 1 record. Dose 2 needs at least 2 records.
        if (vaccineStatusMap[event.vaccineId].count >= event.doseNumber) {
            status = 'applied';
        } else {
            // Not applied (by count).
            // Is it overdue?
            if (dueDate.isBefore(today.subtract(14, 'day'))) {
                // It is overdue.
                // BUT, if the pet is now an Adult (> 1 year) and has at least ONE valid dose (the adult one), 
                // we consider these old puppy milestones as "superseded" or hidden?
                // The user requirement: "If gave at 2 years, it supersedes first schemes".
                // So if (count > 0) but (count < doseNumber) -> e.g. applied 1 dose at 2 years.
                // Dose #1 (45d) is APPLIED (by count rules). 
                // Dose #2 (60d) is PENDING. But since pet is 2 years old, Dose #2 is irrelevant if we moved to Annual scheme.
                // Logic: If pet is Adult (>1y) and we are creating the schedule, we generally SKIP listing missing puppy doses 
                // IF there is a more recent "Adult" recommendation due.

                // Simplified approach for UI:
                // Show puppy items ONLY if (status === 'applied') OR (pet < 1 year old).
                // If pet > 1 year and status != applied, we HIDE it (don't push to array) because we will generate a "Booster" item instead.
            }

            // Standard overdue logic
            if (dayjs(dueDate).isBefore(today.subtract(7, 'day'))) status = 'overdue';
        }

        // Add to schedule ONLY if relevant
        const isAdult = today.diff(birthDate, 'year') >= 1;
        if (!isAdult || status === 'applied') {
            schedule.push({
                vaccineName: vaccine.name,
                dueDate: dueDate.toDate(),
                status: status as any,
                doseNumber: event.doseNumber,
                description: vaccine.description,
                isMandatory: event.mandatory,
                vaccineId: event.vaccineId
            });
        }
    });

    // B. Adult / Recurring Boosters
    // For every Distinct Vaccine ID in the system (core ones), calculate the NEXT Due Date based on Last Applied.

    distinctVaccineIds.forEach(vid => {
        const lastDate = vaccineStatusMap[vid].lastDate;
        const vaccine = VACCINES[vid];
        const isAdult = today.diff(birthDate, 'year') >= 1;
        const interval = vaccine.intervalDays || 365;

        let nextDueDate: dayjs.Dayjs;
        let notes = 'Refuerzo Anual';

        if (lastDate) {
            // If we have a record, next due is Last + Interval
            nextDueDate = dayjs(lastDate).add(interval, 'day');
        } else {
            // No record ever.
            if (isAdult) {
                // Adult with no vaccine -> Due ASAP (technically "today" or "tomorrow")
                // Use today for logic "It's due now".
                nextDueDate = today;
                notes = 'Inicio de esquema (Adulto)';
            } else {
                // Puppy with no record -> Handled by Puppy Schedule above.
                return;
            }
        }

        // Check if this calculated booster is already covered?
        // No, by definition it is the NEXT one.
        // We only add this item if it is in the future OR if it is overdue.
        // Note: The "Puppy" loop handles doses 1..N. The "Adult" loop handles dose N+1 (the booster).

        // Special Case: If I just applied a dose today. 
        // Puppy loop says: Dose 1 Applied (if count >= 1).
        // This loop says: Next due = Today + 1 year.
        // PERFECT. This is exactly what we want.

        // What if pet is adult, no vaccines?
        // Puppy loop (Pet > 1y): Hides puppy items (lines 85-95).
        // This loop: Adds "Inicio de esquema" due Today. 
        // PERFECT.

        // Determine status
        let status: 'pending' | 'overdue' | 'applied' | 'upcoming' = 'pending';
        // It's never "applied" because this is the *Next* projection. It is either pending or overdue.

        if (nextDueDate.isBefore(today.subtract(14, 'day'))) status = 'overdue';
        else if (nextDueDate.diff(today, 'day') <= 30) status = 'upcoming';
        else status = 'pending'; // Future

        schedule.push({
            vaccineName: vaccine.name,
            dueDate: nextDueDate.toDate(),
            status: status,
            doseNumber: vaccineStatusMap[vid].count + 1, // Next dose
            description: notes,
            isMandatory: vaccine.type === 'mandatory',
            vaccineId: vid
        });
    });

    return schedule.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function calculateIdealSchedule(pet: IPet): VaccinationStatus[] {
    // Legacy / Fallback if needed, but getVaccinationStatus is now the main one.
    // We can just call getVaccinationStatus with empty records?
    return getVaccinationStatus(pet, []);
}
