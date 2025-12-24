import { IHealthRecord } from '@/models/HealthRecord';
import dayjs from 'dayjs';

export type VaccineStatus = 'completed' | 'missed_replaced' | 'due_soon' | 'overdue' | 'pending' | 'current_due';

export interface VaccineSlot {
    id: string;
    label: string;
    ageLabel: string;
    minAgeWeeks: number;
    maxAgeWeeks: number;
    vaccineType: string[]; // Can accept multiple types (e.g., Quintuple OR Sextuple)
    isCore: boolean;
    replacesPrevious?: string[];
}

// ... (interfaces remain)

export const CAT_VACCINATION_SCHEDULE: VaccineSlot[] = [
    {
        id: 'cat_deworm_1',
        label: 'Desparasitación 15 días',
        ageLabel: '2-3 Semanas',
        minAgeWeeks: 2,
        maxAgeWeeks: 3,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_2',
        label: 'Desparasitación 30 días',
        ageLabel: '4-5 Semanas',
        minAgeWeeks: 4,
        maxAgeWeeks: 5,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'cat_deworm_3',
        label: 'Desparasitación 45 días',
        ageLabel: '6-7 Semanas',
        minAgeWeeks: 6,
        maxAgeWeeks: 7,
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
        minAgeWeeks: 12, // 3 months
        maxAgeWeeks: 24, // 6 months
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
        minAgeWeeks: 26, // Starting from 6 months
        maxAgeWeeks: 1000,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    }
];

export const DOG_VACCINATION_SCHEDULE: VaccineSlot[] = [
    {
        id: 'pup_deworm_1',
        label: 'Desparasitación 15 días',
        ageLabel: '2-3 Semanas',
        minAgeWeeks: 2,
        maxAgeWeeks: 3,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_2',
        label: 'Desparasitación 30 días',
        ageLabel: '4-5 Semanas',
        minAgeWeeks: 4,
        maxAgeWeeks: 5,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_3',
        label: 'Desparasitación 45 días',
        ageLabel: '6-7 Semanas',
        minAgeWeeks: 6,
        maxAgeWeeks: 7,
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
        minAgeWeeks: 26, // Starting from 6 months
        maxAgeWeeks: 1000,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    }
];

export function getVaccineStatus(
    slot: VaccineSlot,
    petBirthDate: Date,
    records: IHealthRecord[]
): { status: VaccineStatus; matchRecord?: IHealthRecord } {
    if (!slot || !slot.id) return { status: 'pending' };

    const today = dayjs();
    const birthDate = dayjs(petBirthDate);

    // Find matching record
    // Look for records that match the vaccine type and are within a reasonable window OR strictly after the min age

    const relevantRecords = records.filter(r =>
        (r.type === 'vaccine' || r.type === 'deworming') &&
        slot.vaccineType.some(t => r.title.toLowerCase().includes(t) || r.vaccineType === t) &&
        dayjs(r.appliedAt).isAfter(birthDate.add(slot.minAgeWeeks - 2, 'week')) // Allow 2 weeks early buffer
    );

    // Simplification for now: If we find a record in the approximate window.
    const windowStart = birthDate.add(slot.minAgeWeeks - 2, 'week');
    const windowEnd = birthDate.add(slot.maxAgeWeeks + 2, 'week'); // 2 weeks late buffer

    const match = relevantRecords.find(r => {
        const d = dayjs(r.appliedAt);
        return d.isAfter(windowStart) && d.isBefore(windowEnd);
    });

    if (match) {
        return { status: 'completed', matchRecord: match };
    }

    // Check for replacement logic
    // If this is a puppy slot, and we have a later "adult" record (e.g. annual sextuple) given MUCH later,
    // AND the current date is way past the puppy window.
    if (slot.id.startsWith('pup_') && today.isAfter(windowEnd)) {
        // Check if there is a later record that "covers" this.
        const laterRecord = records.find(r =>
            (r.type === 'vaccine' || r.type === 'deworming') &&
            slot.vaccineType.some(t => r.title.toLowerCase().includes(t) || r.vaccineType === t) &&
            dayjs(r.appliedAt).isAfter(windowEnd)
        );

        if (laterRecord) {
            return { status: 'missed_replaced', matchRecord: laterRecord };
        }
    }

    // Check statuses based on dates
    const dueStart = birthDate.add(slot.minAgeWeeks, 'week');
    const dueEnd = birthDate.add(slot.maxAgeWeeks, 'week');

    if (today.isAfter(dueEnd)) {
        return { status: 'overdue' };
    }

    // Current Due: strictly within the window [Start, End]
    // or slightly flexible? The user said "within age range"
    if ((today.isAfter(dueStart) || today.isSame(dueStart)) && (today.isBefore(dueEnd) || today.isSame(dueEnd))) {
        return { status: 'current_due' };
    }

    // Upcoming: within 30 days of the start
    if (dueStart.diff(today, 'day') <= 30 && dueStart.diff(today, 'day') >= 0) {
        return { status: 'due_soon' };
    }

    // It's effectively pending or upcoming
    if (today.isBefore(dueStart)) {
        if (dueStart.diff(today, 'day') <= 30) return { status: 'due_soon' };
        return { status: 'pending' };
    }

    return { status: 'pending' };
}

export function getVaccinationSchedule(species: string): VaccineSlot[] {
    const normalized = (species || '').toLowerCase().trim();
    if (normalized === 'dog' || normalized === 'perro') return DOG_VACCINATION_SCHEDULE;
    if (normalized === 'cat' || normalized === 'gato') return CAT_VACCINATION_SCHEDULE;
    return []; // Empty for others
}

export function calculateNextDueDate(slot: VaccineSlot, appliedDate: Date): Date | undefined {
    // Simple logic based on age difference or standard intervals
    // If it's a puppy shot (minAge < 16 weeks), usually the next one is in 2-4 weeks or it's the annual.
    // If it's annual (replacesPrevious), next is in 1 year.

    // Logic for "Next Dose":
    // If slot has a "next" logical step in the array (hard to know here without the full schedule context).
    // Instead, we can use standard rules:

    if (slot.ageLabel === 'Anual' || slot.label.includes('Anual')) {
        return dayjs(appliedDate).add(1, 'year').toDate();
    }

    if (slot.label.toLowerCase().includes('desparasitación') && slot.label.toLowerCase().includes('adulto')) {
        return dayjs(appliedDate).add(3, 'month').toDate();
    }

    // Puppy/Kitten shots rules
    if (slot.maxAgeWeeks < 20) {
        // Typically next dose is in 21-30 days
        return dayjs(appliedDate).add(21, 'day').toDate();
    }

    return undefined;
}
