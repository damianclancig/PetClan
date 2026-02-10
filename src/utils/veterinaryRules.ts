import { addDays, addMonths, addYears, differenceInMonths, differenceInDays } from 'date-fns';
import { IHealthRecord } from '@/models/HealthRecord';
import dayjs from 'dayjs';
import { getPetAge } from '@/lib/dateUtils';

export type Species = 'dog' | 'cat';
export type VaccineType = 'rabies' | 'polyvalent' | 'other';
export type DewormingType = 'internal' | 'external';
export type VaccineStatus = 'completed' | 'missed_replaced' | 'due_soon' | 'overdue' | 'pending' | 'current_due';

export interface VaccineSlot {
    id: string;
    label: string;
    ageLabel: string;
    minAgeWeeks: number;
    maxAgeWeeks: number;
    vaccineType: string[];
    isCore: boolean;
    replacesPrevious?: string[];
}

export const CAT_VACCINATION_SCHEDULE: VaccineSlot[] = [
    {
        id: 'cat_deworm_1',
        label: 'Desparasitación 15 días',
        ageLabel: '2-3 Semanas',
        minAgeWeeks: 2,
        maxAgeWeeks: 4, // 2-3 weeks inclusive
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_2',
        label: 'Desparasitación 30 días',
        ageLabel: '4-5 Semanas',
        minAgeWeeks: 4,
        maxAgeWeeks: 6, // 4-5 weeks inclusive
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_3',
        label: 'Desparasitación 45 días',
        ageLabel: '6-7 Semanas',
        minAgeWeeks: 6,
        maxAgeWeeks: 8, // 6-7 weeks inclusive
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_2m',
        label: 'Desparasitación 2 Meses',
        ageLabel: '8-9 Semanas',
        minAgeWeeks: 8,
        maxAgeWeeks: 10, // 8-9 weeks inclusive (Up to end of week 9)
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_3m',
        label: 'Desparasitación 3 Meses',
        ageLabel: '3 Meses',
        minAgeWeeks: 12,
        maxAgeWeeks: 13,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_4m',
        label: 'Desparasitación 4 Meses',
        ageLabel: '4 Meses',
        minAgeWeeks: 16,
        maxAgeWeeks: 17,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_5m',
        label: 'Desparasitación 5 Meses',
        ageLabel: '5 Meses',
        minAgeWeeks: 20,
        maxAgeWeeks: 21,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_6m',
        label: 'Desparasitación 6 Meses',
        ageLabel: '6 Meses',
        minAgeWeeks: 24,
        maxAgeWeeks: 25,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_triple_1',
        label: 'Triple Felina 1º Dosis',
        ageLabel: '8 Semanas',
        minAgeWeeks: 8,
        maxAgeWeeks: 10,
        vaccineType: ['triple', 'felina', 'panleucopenia', 'rinotraqueitis', 'calicivirus'],
        isCore: true
    },
    {
        id: 'cat_triple_2',
        label: 'Triple Felina 2º Dosis',
        ageLabel: '10-12 Semanas',
        minAgeWeeks: 10,
        maxAgeWeeks: 13,
        vaccineType: ['triple', 'felina', 'panleucopenia', 'rinotraqueitis', 'calicivirus'],
        isCore: true
    },
    {
        id: 'cat_triple_3',
        label: 'Triple Felina 3º Dosis',
        ageLabel: '14-16 Semanas',
        minAgeWeeks: 14,
        maxAgeWeeks: 18,
        vaccineType: ['triple', 'felina', 'panleucopenia', 'rinotraqueitis', 'calicivirus'],
        isCore: true
    },
    {
        id: 'cat_rabies',
        label: 'Antirrábica',
        ageLabel: '3-4 Meses',
        minAgeWeeks: 12,
        maxAgeWeeks: 24,
        vaccineType: ['rabia', 'antirrabica', 'rabies'],
        isCore: true
    },
    {
        id: 'cat_annual_triple',
        label: 'Triple Felina Anual',
        ageLabel: 'Anual',
        minAgeWeeks: 52,
        maxAgeWeeks: 1000,
        vaccineType: ['triple', 'felina', 'panleucopenia', 'rinotraqueitis', 'calicivirus'],
        isCore: true,
        replacesPrevious: ['cat_triple_1', 'cat_triple_2', 'cat_triple_3']
    },
    {
        id: 'cat_annual_rabies',
        label: 'Antirrábica Anual',
        ageLabel: 'Anual',
        minAgeWeeks: 52,
        maxAgeWeeks: 1000,
        vaccineType: ['rabia', 'antirrabica', 'rabies'],
        isCore: true,
        replacesPrevious: ['cat_rabies']
    },
    {
        id: 'cat_deworm_trimestral',
        label: 'Desparasitación Adultos',
        ageLabel: 'Cada 3-4 Meses',
        minAgeWeeks: 26,
        maxAgeWeeks: 1000,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_external',
        label: 'Control Pulgas/Garrapatas',
        ageLabel: 'Mensual / Según Producto',
        minAgeWeeks: 8,
        maxAgeWeeks: 1000,
        vaccineType: ['pipeta', 'pulgas', 'garrapatas', 'bravecto', 'nexgard', 'simparica', 'external', 'externa'],
        isCore: false
    }
];

export const DOG_VACCINATION_SCHEDULE: VaccineSlot[] = [
    {
        id: 'pup_deworm_1',
        label: 'Desparasitación 15 días',
        ageLabel: '2-3 Semanas',
        minAgeWeeks: 2,
        maxAgeWeeks: 4,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_2',
        label: 'Desparasitación 30 días',
        ageLabel: '4-5 Semanas',
        minAgeWeeks: 4,
        maxAgeWeeks: 6,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_3',
        label: 'Desparasitación 45 días',
        ageLabel: '6-7 Semanas',
        minAgeWeeks: 6,
        maxAgeWeeks: 8,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_2m',
        label: 'Desparasitación 2 Meses',
        ageLabel: '8-9 Semanas',
        minAgeWeeks: 8,
        maxAgeWeeks: 12, // Extended to cover gap to 3m
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_3m',
        label: 'Desparasitación 3 Meses',
        ageLabel: '3 Meses',
        minAgeWeeks: 12,
        maxAgeWeeks: 16, // Extended to cover gap to 4m
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_4m',
        label: 'Desparasitación 4 Meses',
        ageLabel: '4 Meses',
        minAgeWeeks: 16,
        maxAgeWeeks: 20, // Extended to cover gap to 5m
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_5m',
        label: 'Desparasitación 5 Meses',
        ageLabel: '5 Meses',
        minAgeWeeks: 20,
        maxAgeWeeks: 24, // Extended to cover gap to 6m
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_6m',
        label: 'Desparasitación 6 Meses',
        ageLabel: '6 Meses',
        minAgeWeeks: 24,
        maxAgeWeeks: 26, // Extended to start of adult schedule
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_poly_1',
        label: 'Polivalente 1º Dosis',
        ageLabel: '6-8 Semanas',
        minAgeWeeks: 6,
        maxAgeWeeks: 9,
        vaccineType: ['polivalente', 'sextuple', 'quintuple', 'triple', 'moquillo'],
        isCore: true
    },
    {
        id: 'pup_poly_2',
        label: 'Polivalente 2º Dosis',
        ageLabel: '10-12 Semanas',
        minAgeWeeks: 10,
        maxAgeWeeks: 13,
        vaccineType: ['polivalente', 'sextuple', 'quintuple'],
        isCore: true
    },
    {
        id: 'pup_poly_3',
        label: 'Polivalente 3º Dosis',
        ageLabel: '14-16 Semanas',
        minAgeWeeks: 14,
        maxAgeWeeks: 18,
        vaccineType: ['polivalente', 'sextuple', 'quintuple'],
        isCore: true
    },
    {
        id: 'pup_rabies',
        label: 'Antirrábica',
        ageLabel: '14-16 Semanas',
        minAgeWeeks: 14,
        maxAgeWeeks: 24,
        vaccineType: ['rabia', 'antirrabica', 'rabies'],
        isCore: true
    },
    {
        id: 'adult_annual_poly',
        label: 'Polivalente Anual',
        ageLabel: 'Anual',
        minAgeWeeks: 52,
        maxAgeWeeks: 1000,
        vaccineType: ['polivalente', 'sextuple', 'quintuple'],
        isCore: true,
        replacesPrevious: ['pup_poly_1', 'pup_poly_2', 'pup_poly_3']
    },
    {
        id: 'adult_annual_rabies',
        label: 'Antirrábica Anual',
        ageLabel: 'Anual',
        minAgeWeeks: 52,
        maxAgeWeeks: 1000,
        vaccineType: ['rabia', 'antirrabica', 'rabies'],
        isCore: true,
        replacesPrevious: ['pup_rabies']
    },
    {
        id: 'adult_deworm_trimestral',
        label: 'Desparasitación Adultos',
        ageLabel: 'Cada 3-4 Meses',
        minAgeWeeks: 26,
        maxAgeWeeks: 1000,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_external',
        label: 'Control Pulgas/Garrapatas',
        ageLabel: 'Mensual / Según Producto',
        minAgeWeeks: 8,
        maxAgeWeeks: 1000,
        vaccineType: ['pipeta', 'pulgas', 'garrapatas', 'bravecto', 'nexgard', 'simparica', 'external', 'externa'],
        isCore: false
    }
];

export const VET_RULES = {
    PUPPY_AGE_MONTHS: 12, // Generic threshold for "Adult" logic

    // Weight Check Intervals
    WEIGHT: {
        VERY_YOUNG_PUPPY_DAYS: 7, // < 2 months
        PUPPY_DAYS: 15, // 2-12 months
        ADULT_DAYS: 30
    },

    // Default Intervals
    DEWORMING: {
        INTERNAL: {
            PUPPY_DAYS: 15, // aggressive schedule for young puppies
            ADULT_MONTHS: 3, // Quarterly standard
        },
        EXTERNAL: {
            DEFAULT_MONTHS: 1, // Monthly pipettes
            MIN_AGE_MONTHS: 2 // Start at 2 months (standard for pipettes)
        }
    }
};

export const VeterinaryRules = {
    /**
     * Calculates the estimated next due date based on biological rules.
     * @param type 'vaccine' | 'deworming'
     * @param subtype specific vaccine name or deworming type
     * @param appliedAt Date of application
     * @param birthDate Pet's birth date
     */
    calculateNextDueDate(
        type: 'vaccine' | 'deworming',
        subtype: string,
        appliedAt: Date,
        birthDate: Date
    ): Date {
        const ageAtApplication = differenceInMonths(appliedAt, birthDate);
        const isPuppy = ageAtApplication < 12; // Simple threshold

        if (type === 'deworming') {
            if (subtype.includes('external')) {
                return addMonths(appliedAt, VET_RULES.DEWORMING.EXTERNAL.DEFAULT_MONTHS);
            }
            // Internal
            if (isPuppy) {
                // Determine if very young (less than 2 months) -> 15 days
                if (ageAtApplication < 2) return addDays(appliedAt, VET_RULES.DEWORMING.INTERNAL.PUPPY_DAYS);
                // 2-6 months -> Monthly
                if (ageAtApplication < 6) return addMonths(appliedAt, 1);
                // 6-12 months -> Quarterly (Adult schedule starts taking over, or keep monthly? Standard is monthly until 6mo, then trimestral)
                return addMonths(appliedAt, VET_RULES.DEWORMING.INTERNAL.ADULT_MONTHS);
            }
            return addMonths(appliedAt, VET_RULES.DEWORMING.INTERNAL.ADULT_MONTHS);
        }

        if (type === 'vaccine') {
            const normalized = this.normalizeVaccineType(subtype);

            if (normalized === 'rabies') {
                return addYears(appliedAt, 1); // Always annual
            }

            if (normalized === 'polyvalent') {
                // Complex simplified logic:
                // If puppy (<4-5 mo): typically every 21-30 days until ~4 months old.
                // If adult: Annual.
                if (ageAtApplication < 4) {
                    return addDays(appliedAt, 21); // Booster soon
                }
                return addYears(appliedAt, 1); // Annual booster
            }

            // Fallback for unknown vaccines
            return addYears(appliedAt, 1);
        }

        return addYears(appliedAt, 1); // Safe default
    },

    normalizeVaccineType(rawName: string): VaccineType {
        const lower = rawName.toLowerCase();
        if (lower.includes('rabia') || lower.includes('rabies') || lower.includes('antirrábica')) return 'rabies';
        if (lower.includes('sextuple') || lower.includes('quintuple') || lower.includes('triple') || lower.includes('polivalente') || lower.includes('parvo') || lower.includes('distemper')) return 'polyvalent';
        return 'other';
    },

    /**
     * Determines if a pet counts as "Puppy" for frequency rules
     */
    isPuppy(birthDate: Date): boolean {
        return differenceInMonths(new Date(), birthDate) < VET_RULES.PUPPY_AGE_MONTHS;
    },

    /**
     * Checks if the pet's weight is considered "valid" (recent enough) for administering medical treatments.
     */
    isWeightValid(birthDate: Date | string, lastWeightUpdate: Date | string | undefined): boolean {
        if (!lastWeightUpdate) return false;

        const today = new Date();
        const birth = new Date(birthDate);
        const lastUpdate = new Date(lastWeightUpdate);

        const ageInMonths = differenceInMonths(today, birth);
        const ageInDays = differenceInDays(today, birth);

        const daysSinceUpdate = differenceInDays(today, lastUpdate);

        // < 2 months: Valid for 7 days
        if (ageInDays < 60) return daysSinceUpdate <= VET_RULES.WEIGHT.VERY_YOUNG_PUPPY_DAYS;

        // < 6 months: Valid for 15 days
        if (ageInMonths < 6) return daysSinceUpdate <= VET_RULES.WEIGHT.PUPPY_DAYS;

        // Adult: Valid for 30 days
        return daysSinceUpdate <= VET_RULES.WEIGHT.ADULT_DAYS;
    },

    /**
     * Returns the Vaccination/Health Schedule for the species.
     */
    getSchedule(species: string): VaccineSlot[] {
        const normalized = (species || '').toLowerCase().trim();
        if (normalized === 'dog' || normalized === 'perro') return DOG_VACCINATION_SCHEDULE;
        if (normalized === 'cat' || normalized === 'gato') return CAT_VACCINATION_SCHEDULE;
        return [];
    },

    /**
     * Unified Logic to Check Health Status of a Slot.
     * Centralizes: "Are we in the window?" "Do we have a record?" "Is it expired?"
     */
    getSlotStatus(slot: VaccineSlot, petBirthDate: Date, records: IHealthRecord[]): { status: VaccineStatus; matchRecord?: IHealthRecord; dueDate?: Date } {
        if (!slot || !slot.id) return { status: 'pending' };

        const today = dayjs();
        const birthDate = dayjs(petBirthDate);

        // 1. Identify Slot Type
        const isDeworming = slot.vaccineType.some(t => t.includes('desparasitacion') || t.includes('deworming'));
        const isSlotExternal = slot.vaccineType.some(t => t === 'external' || t === 'pulgas' || t === 'garrapatas' || t.includes('pipeta'));
        const bufferWeeks = isDeworming ? 0.5 : 1;

        // 2. Filter Relevant Records
        const relevantRecords = records.filter(r => {
            if (r.type !== 'vaccine' && r.type !== 'deworming') return false;

            // Age check first
            if (!dayjs(r.appliedAt).isAfter(birthDate.add(slot.minAgeWeeks - bufferWeeks, 'week'))) return false;

            // Deworming Specific Logic
            if (r.type === 'deworming') {
                // If slot is external, accept explicit external type
                if (isSlotExternal && r.dewormingType === 'external') return true;
                // If slot is internal, reject explicit external type
                if (!isSlotExternal && r.dewormingType === 'external') return false;
                // If slot is external, reject explicit internal type
                if (isSlotExternal && r.dewormingType === 'internal') return false;
                // If slot is internal, accept explicit internal type
                if (!isSlotExternal && r.dewormingType === 'internal') return true;
            }

            // Fallback to text matching (Title or VaccineType string)
            return slot.vaccineType.some(t => r.title.toLowerCase().includes(t) || r.vaccineType === t);
        }).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()); // Newest first

        // 3. Special Logic for External Deworming (pipettes)
        const isExternal = isSlotExternal;

        if (isExternal) {
            const lastRecord = relevantRecords[0];
            if (!lastRecord) {
                // Check if we are in the age window to start
                const startAge = birthDate.add(slot.minAgeWeeks, 'week');
                if (today.isBefore(startAge)) return { status: 'pending', dueDate: startAge.toDate() };
                return { status: 'overdue', dueDate: today.toDate() }; // Should have one
            }

            // Validity Duration Logic
            const titleLower = lastRecord.title.toLowerCase();
            const noteLower = (lastRecord.description || '').toLowerCase();
            // Actually getSlotStatus receives IHealthRecord which has notes? Let's check IHealthRecord definition. 
            // Assuming title checks for now.

            let durationDays = 30; // Default
            if (
                titleLower.includes('bravecto') ||
                titleLower.includes('90 dias') ||
                titleLower.includes('90 días') ||
                titleLower.includes('3 meses') ||
                titleLower.includes('trimestral')
            ) {
                durationDays = 90;
            }
            else if (titleLower.includes('simparica')) durationDays = 35;
            else if (titleLower.includes('seresto')) durationDays = 240;

            const nextDueDate = dayjs(lastRecord.appliedAt).add(durationDays, 'days');

            if (today.isAfter(nextDueDate)) return { status: 'overdue', matchRecord: lastRecord, dueDate: nextDueDate.toDate() };
            if (nextDueDate.diff(today, 'days') <= 7) return { status: 'due_soon', matchRecord: lastRecord, dueDate: nextDueDate.toDate() };
            return { status: 'completed', matchRecord: lastRecord, dueDate: nextDueDate.toDate() };
        }

        // 3. Standard Window Logic (Puppy/Initial Series)
        // Find a record that fits THIS specific slot window
        const windowStart = birthDate.add(slot.minAgeWeeks - bufferWeeks, 'week');
        const windowEnd = birthDate.add(slot.maxAgeWeeks + bufferWeeks, 'week');

        // Match specific slot
        const match = relevantRecords.find(r => {
            const d = dayjs(r.appliedAt);
            return d.isAfter(windowStart) && d.isBefore(windowEnd);
        });

        // 4. Recurrence / Annual Logic
        // If this slot is "Annual" (recurrent), any record after minAge counts, BUT we must check if it's expired.
        const isAnnual = slot.label.toLowerCase().includes('anual') || slot.ageLabel.toLowerCase().includes('anual') || slot.ageLabel.toLowerCase().includes('cada');

        if (isAnnual) {
            // For annual, we look at the LATEST record (relevantRecords[0])
            const lastRecord = relevantRecords[0];

            if (lastRecord) {
                // Calculate expiry
                let nextDate = dayjs(lastRecord.appliedAt).add(1, 'year');
                // Trimestral logic for adult deworming
                if (slot.id.includes('deworm_trimestral')) nextDate = dayjs(lastRecord.appliedAt).add(3, 'month');

                if (today.isAfter(nextDate)) return { status: 'overdue', matchRecord: lastRecord, dueDate: nextDate.toDate() };
                if (nextDate.diff(today, 'days') <= 30) return { status: 'due_soon', matchRecord: lastRecord, dueDate: nextDate.toDate() };
                return { status: 'completed', matchRecord: lastRecord, dueDate: nextDate.toDate() };
            }
        } else {
            // For one-time slots (Puppy 1, 2, 3)
            if (match) return { status: 'completed', matchRecord: match };
        }

        // 5. Check Replacement (Puppy missed, but covered by later Annual?)
        if (slot.id.startsWith('pup_') && today.isAfter(windowEnd)) {
            // If the pet has an "Annual" record later on, this puppy slot is "Missed/Replaced" (Green/Gray state)
            // Logic: Is there a record AFTER this window?
            const laterRecord = relevantRecords.find(r => dayjs(r.appliedAt).isAfter(windowEnd));
            if (laterRecord) return { status: 'missed_replaced', matchRecord: laterRecord };
        }

        // 6. Determine Current Status (No match found)
        const dueStart = birthDate.add(slot.minAgeWeeks, 'week').startOf('day');
        const dueEnd = birthDate.add(slot.maxAgeWeeks, 'week').endOf('day');

        if (today.isAfter(dueEnd)) return { status: 'overdue', dueDate: dueStart.toDate() };

        // Current Due
        if ((today.isAfter(dueStart) || today.isSame(dueStart)) && (today.isBefore(dueEnd) || today.isSame(dueEnd))) {
            return { status: 'current_due', dueDate: dueEnd.toDate() };
        }

        // Upcoming
        const anticipationDays = isDeworming ? 7 : 21;
        if (today.isBefore(dueStart) && dueStart.diff(today, 'day') <= anticipationDays) {
            return { status: 'due_soon', dueDate: dueStart.toDate() };
        }

        return { status: 'pending', dueDate: dueStart.toDate() };
    }
};
