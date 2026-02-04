import { addDays, addMonths, addYears, differenceInMonths } from 'date-fns';

export type Species = 'dog' | 'cat';
export type VaccineType = 'rabies' | 'polyvalent' | 'other';
export type DewormingType = 'internal' | 'external';

export const VET_RULES = {
    PUPPY_AGE_MONTHS: 12, // Generic threshold for "Adult" logic

    // Weight Check Intervals
    WEIGHT: {
        PUPPY_DAYS: 15,
        ADULT_DAYS: 30
    },

    // Default Intervals
    DEWORMING: {
        INTERNAL: {
            PUPPY_DAYS: 15, // aggressive schedule for young puppies
            ADULT_MONTHS: 3, // Quarterly standard
        },
        EXTERNAL: {
            DEFAULT_MONTHS: 1 // Monthly pipettes
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
                // Determine if very young (less than 6 months) -> 15-30 days
                if (ageAtApplication < 6) return addDays(appliedAt, 30); // Monthly until 6mo
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
    }
};
