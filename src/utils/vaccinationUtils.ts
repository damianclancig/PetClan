import { IHealthRecord } from '@/models/HealthRecord';
import dayjs from 'dayjs';
import { VeterinaryRules, VaccineSlot, VaccineStatus } from './veterinaryRules';

export type { VaccineSlot, VaccineStatus };

// Re-export schedules for compatibility, but generated from VetRules
export const CAT_VACCINATION_SCHEDULE = VeterinaryRules.getSchedule('cat');
export const DOG_VACCINATION_SCHEDULE = VeterinaryRules.getSchedule('dog');

export function getVaccineStatus(
    slot: VaccineSlot,
    petBirthDate: Date,
    records: IHealthRecord[]
): { status: VaccineStatus; matchRecord?: IHealthRecord } {
    return VeterinaryRules.getSlotStatus(slot, petBirthDate, records);
}

export function getVaccinationSchedule(species: string): VaccineSlot[] {
    return VeterinaryRules.getSchedule(species);
}

export function calculateNextDueDate(slot: VaccineSlot, appliedDate: Date): Date | undefined {
    // Basic mapping to call the VetRules calculator
    // VetRules expects (type, subtype, applied, birth).
    // Here we only have slot (which has type) and appliedDate. We lack birthDate.
    // However, calculateNextDueDate in VetRules requires birthDate for Puppy logic.
    // The legacy function here didn't require birthDate, it used slot.maxAgeWeeks.
    // We should probably keep the legacy logic for this helper OR try to align.
    // Since this helper is used for "Generic Suggestion" in Modal, where we might not have birthDate easy?
    // Actually Modal has pet birthDate.

    // For now, let's keep a simplified version here compatible with the new 15-day rule
    // explicitly matching the logic we added earlier.

    if (slot.ageLabel === 'Anual' || slot.label.includes('Anual')) {
        return dayjs(appliedDate).add(1, 'year').toDate();
    }

    if (slot.label.toLowerCase().includes('desparasitación') && slot.label.toLowerCase().includes('adulto')) {
        return dayjs(appliedDate).add(3, 'month').toDate();
    }

    // Puppy/Kitten shots rules
    if (slot.maxAgeWeeks < 20) {
        // Deworming for very young puppies -> 15 days
        if (slot.vaccineType.some(t => t.includes('desparasitacion') || t.includes('deworming'))) {
            return dayjs(appliedDate).add(15, 'day').toDate();
        }
        // Vaccines -> 21 days
        return dayjs(appliedDate).add(21, 'day').toDate();
    }

    return undefined;
}

export function getPetHealthSummary(pet: { species: string; birthDate: Date }, records: IHealthRecord[]) {
    const schedule = getVaccinationSchedule(pet.species);
    const scheduleStatuses = schedule.map(slot => ({
        slot,
        ...getVaccineStatus(slot, pet.birthDate, records)
    }));

    const getSlotFamily = (id: string) => {
        if (id.includes('external') || id.includes('pulgas')) return 'external';
        if (id.includes('deworm')) return 'deworm';
        if (id.includes('poly') || id.includes('triple') || id.includes('sextuple')) return 'poly';
        if (id.includes('rabies')) return 'rabies';
        return 'other';
    };

    const visibleSlotIds = new Set<string>();
    const families = ['deworm', 'external', 'poly', 'rabies', 'other'];

    families.forEach(family => {
        const familySlots = scheduleStatuses.filter(s => getSlotFamily(s.slot.id) === family);
        let foundFirstPending = false;
        familySlots.forEach(s => {
            if (s.status === 'completed' || s.status === 'missed_replaced') {
                // skip
            } else {
                if (!foundFirstPending) {
                    visibleSlotIds.add(s.slot.id);
                    foundFirstPending = true;
                }
            }
        });
    });

    const visibleStatuses = scheduleStatuses.filter(s => visibleSlotIds.has(s.slot.id));

    const overdueCount = visibleStatuses.filter(s => s.status === 'overdue').length;
    const dueNowCount = visibleStatuses.filter(s => s.status === 'current_due').length;
    const upcomingCount = visibleStatuses.filter(s => s.status === 'due_soon').length;
    const isUpToDate = overdueCount === 0 && dueNowCount === 0;

    const hasOverdueRabies = scheduleStatuses.some((s) =>
        s.slot.vaccineType.includes('rabies') && s.status === 'overdue'
    );
    const hasCompletedRabies = scheduleStatuses.some((s) =>
        s.slot.vaccineType.includes('rabies') && s.status === 'completed'
    );
    const hasRabies = !hasOverdueRabies && hasCompletedRabies;

    return { overdueCount, dueNowCount, upcomingCount, isUpToDate, hasRabies };
}
