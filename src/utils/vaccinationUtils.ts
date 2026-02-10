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
