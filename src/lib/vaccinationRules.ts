export type VaccineType = 'core' | 'mandatory' | 'optional';

export interface Vaccine {
    id: string;
    name: string;
    type: VaccineType;
    description?: string;
    intervalDays?: number; // Days until next dose (e.g. 365 for annual)
}

export interface ScheduleEvent {
    ageDays: number; // Age in days when it should be applied
    vaccineId: string;
    doseNumber: number;
    mandatory: boolean;
    notes?: string;
}

export const VACCINES: Record<string, Vaccine> = {
    // Dog Vaccines
    sextuple_canina: { id: 'sextuple_canina', name: 'Séxtuple / Óctuple', type: 'core', description: 'Parvovirus, Moquillo, Hepatitis, Adenovirus, Parainfluenza, Leptospirosis', intervalDays: 365 },
    antirrabica: { id: 'antirrabica', name: 'Antirrábica', type: 'mandatory', description: 'Obligatoria por ley', intervalDays: 365 },
    bordetella: { id: 'bordetella', name: 'Bordetella', type: 'optional', description: 'Tos de las perreras', intervalDays: 365 },

    // Cat Vaccines
    triple_felina: { id: 'triple_felina', name: 'Triple Felina', type: 'core', description: 'Rinotraqueítis, Calicivirus, Panleucopenia', intervalDays: 365 },
    leucemia_felina: { id: 'leucemia_felina', name: 'Leucemia Felina (FeLV)', type: 'optional', description: 'Recomendada para gatos con acceso al exterior', intervalDays: 365 },
};

export const VACCINATION_SCHEDULE = {
    dog: {
        puppy: [
            { ageDays: 45, vaccineId: 'sextuple_canina', doseNumber: 1, mandatory: true },
            { ageDays: 60, vaccineId: 'sextuple_canina', doseNumber: 2, mandatory: true },
            { ageDays: 75, vaccineId: 'sextuple_canina', doseNumber: 3, mandatory: true },
            { ageDays: 90, vaccineId: 'sextuple_canina', doseNumber: 4, mandatory: true },
            { ageDays: 120, vaccineId: 'antirrabica', doseNumber: 1, mandatory: true },
        ] as ScheduleEvent[],
        adult: [
            // Annual boosters logic handled separately or as recurring events starting at 365 days
            { ageDays: 365, vaccineId: 'sextuple_canina', doseNumber: 1, mandatory: true, notes: 'Refuerzo Anual' },
            { ageDays: 365, vaccineId: 'antirrabica', doseNumber: 1, mandatory: true, notes: 'Refuerzo Anual' },
        ] as ScheduleEvent[]
    },
    cat: {
        kitten: [
            { ageDays: 60, vaccineId: 'triple_felina', doseNumber: 1, mandatory: true },
            { ageDays: 75, vaccineId: 'triple_felina', doseNumber: 2, mandatory: true },
            { ageDays: 90, vaccineId: 'triple_felina', doseNumber: 3, mandatory: true },
            { ageDays: 120, vaccineId: 'antirrabica', doseNumber: 1, mandatory: true },
        ] as ScheduleEvent[],
        adult: [
            { ageDays: 365, vaccineId: 'triple_felina', doseNumber: 1, mandatory: true, notes: 'Refuerzo Anual' },
            { ageDays: 365, vaccineId: 'antirrabica', doseNumber: 1, mandatory: true, notes: 'Refuerzo Anual' },
        ] as ScheduleEvent[]
    }
};
