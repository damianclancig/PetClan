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
        id: 'cat_deworm_2m',
        label: 'Desparasitación 2 Meses',
        ageLabel: '8-9 Semanas',
        minAgeWeeks: 8,
        maxAgeWeeks: 9,
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
        id: 'pup_deworm_2m',
        label: 'Desparasitación 2 Meses',
        ageLabel: '8-9 Semanas',
        minAgeWeeks: 8,
        maxAgeWeeks: 9,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_3m',
        label: 'Desparasitación 3 Meses',
        ageLabel: '3 Meses',
        minAgeWeeks: 12,
        maxAgeWeeks: 13,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_4m',
        label: 'Desparasitación 4 Meses',
        ageLabel: '4 Meses',
        minAgeWeeks: 16,
        maxAgeWeeks: 17,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_5m',
        label: 'Desparasitación 5 Meses',
        ageLabel: '5 Meses',
        minAgeWeeks: 20,
        maxAgeWeeks: 21,
        vaccineType: ['desparasitacion', 'deworming', 'antiparasitario'],
        isCore: true
    },
    {
        id: 'pup_deworm_6m',
        label: 'Desparasitación 6 Meses',
        ageLabel: '6 Meses',
        minAgeWeeks: 24,
        maxAgeWeeks: 25,
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

    const isDeworming = slot.vaccineType.some(t => t.includes('desparasitacion') || t.includes('deworming'));
    const bufferWeeks = isDeworming ? 0.5 : 1;

    const relevantRecords = records.filter(r =>
        (r.type === 'vaccine' || r.type === 'deworming') &&
        slot.vaccineType.some(t => r.title.toLowerCase().includes(t) || r.vaccineType === t) &&
        dayjs(r.appliedAt).isAfter(birthDate.add(slot.minAgeWeeks - bufferWeeks, 'week'))
    );

    // Updated Logic for External Parasites (Smart Duration)
    const isExternal = slot.vaccineType.some(t => t === 'external' || t === 'pulgas' || t === 'garrapatas' || t.includes('pipeta'));

    if (isExternal) {
        const externalRecords = records.filter(r =>
            (r.type === 'deworming' && r.dewormingType === 'external') ||
            (r.type === 'vaccine' && slot.vaccineType.some(t => r.title.toLowerCase().includes(t))) || // Support vaccine type just in case user misclassified
            (r.type === 'deworming' && !r.dewormingType && slot.vaccineType.some(t => r.title.toLowerCase().includes(t)))
        ).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

        const lastRecord = externalRecords[0];

        if (!lastRecord) return { status: 'pending' };

        // Determine validity duration based on product name
        const titleLower = lastRecord.title.toLowerCase();
        let durationDays = 30; // Default (pipettes)

        if (titleLower.includes('bravecto') || titleLower.includes('90 dias') || titleLower.includes('90 días') || titleLower.includes('3 meses') || titleLower.includes('trimestral') || titleLower.includes('12 semanas')) durationDays = 90; // 3 months
        else if (titleLower.includes('simparica')) durationDays = 35; // 5 weeks
        else if (titleLower.includes('nexgard')) durationDays = 30;
        else if (titleLower.includes('seresto')) durationDays = 240; // 8 months collar

        const nextDueDate = dayjs(lastRecord.appliedAt).add(durationDays, 'days');
        const daysUntilDue = nextDueDate.diff(today, 'days');

        if (daysUntilDue < 0) return { status: 'overdue', matchRecord: lastRecord };
        if (daysUntilDue <= 7) return { status: 'due_soon', matchRecord: lastRecord };

        // If plenty of time left, it's considered effectively completed/current
        return { status: 'completed', matchRecord: lastRecord };
    }

    // Standard Logic for Vaccines/Internal Deworming
    // Simplification for now: If we find a record in the approximate window.
    const windowStart = birthDate.add(slot.minAgeWeeks - bufferWeeks, 'week');
    const windowEnd = birthDate.add(slot.maxAgeWeeks + bufferWeeks, 'week'); // 2 weeks late buffer

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

    // Upcoming determination
    // For deworming (short cycles), anticipation should be short (e.g. 7 days) to avoid overlap (showing 15d, 30d, 45d all at once).
    // For annual vaccines, 30 days is fine.

    // isDeworming is already calculated above
    const anticipationDays = isDeworming ? 7 : 21;

    if (dueStart.diff(today, 'day') <= anticipationDays && dueStart.diff(today, 'day') >= 0) {
        return { status: 'due_soon' };
    }

    // It's effectively pending or upcoming
    if (today.isBefore(dueStart)) {
        if (dueStart.diff(today, 'day') <= anticipationDays) return { status: 'due_soon' };
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
