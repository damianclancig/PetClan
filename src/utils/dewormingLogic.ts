import { IPet } from '../models/Pet';
import { IHealthRecord } from '../models/HealthRecord';
import dayjs from 'dayjs';

export type DewormingStatus = 'up_to_date' | 'upcoming' | 'due_now' | 'overdue' | 'blocked';
export type ActionType = 'buy_medication' | 'update_weight' | 'visit_vet' | 'none';
export type DewormingType = 'internal' | 'external';

export interface NextAction {
    type: ActionType;
    recommendedDate: Date;
    reason: string;
}

export interface DewormingResult {
    status: DewormingStatus;
    nextAction: NextAction;
    confidenceLevel: 'high' | 'medium' | 'low';
    lastApplied?: Date;
}

// Helper: Calcular edad en meses y días
const getAge = (birthDate: Date) => {
    const now = dayjs();
    const birth = dayjs(birthDate);
    const months = now.diff(birth, 'months');
    const days = now.diff(birth, 'days');
    return { months, days };
};

// Reglas de Peso
const isWeightValid = (pet: IPet): boolean => {
    if (!pet.weight || !pet.lastWeightUpdate) return false;

    const { months, days } = getAge(pet.birthDate);
    const lastUpdateDays = dayjs().diff(dayjs(pet.lastWeightUpdate), 'days');

    // Cachorros muy jóvenes (< 2 meses) -> Crecen muy rápido, peso válido solo 7 días
    if (days < 60) {
        return lastUpdateDays <= 7;
    }
    // Cachorros (2 - 6 meses) -> peso válido 15 días
    if (months < 6) {
        return lastUpdateDays <= 15;
    }
    // Adultos -> peso válido 30 días
    return lastUpdateDays <= 30;
};

// Lógica de Desparasitación Interna
export const calculateInternalDewormingStatus = (pet: IPet, records: IHealthRecord[]): DewormingResult => {
    const { months, days } = getAge(pet.birthDate);

    // Regla: No recomendar antes de 15 días de vida
    if (days < 15) {
        return {
            status: 'blocked',
            nextAction: {
                type: 'visit_vet',
                recommendedDate: dayjs().add(15 - days, 'days').toDate(),
                reason: 'Mascota muy joven para desparasitación automática.'
            },
            confidenceLevel: 'high'
        };
    }

    // Filtrar records de este tipo
    // Robustez: Si dewormingType no está definido, inferir Internal salvo que diga 'pipeta' o 'externa'.
    const internalRecords = records
        .filter(r => r.type === 'deworming' && (
            r.dewormingType === 'internal' ||
            (!r.dewormingType && !r.title?.toLowerCase().includes('pipeta') && !r.title?.toLowerCase().includes('externa'))
        ))
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    const lastRecord = internalRecords[0];
    let intervalDays = 90; // Default +6 meses

    // Definir intervalo según edad
    // Si tiene menos de ~50-55 días, seguimos con quincenal hasta llegar a los 60.
    // Si ya tiene ~60 días, pasamos a mensual.
    if (days <= 55) {
        intervalDays = 15;
    } else if (months < 6) {
        intervalDays = 30;
    } else { // + 6 meses
        intervalDays = 90;
    }

    let nextDueDate: dayjs.Dayjs;

    if (lastRecord) {
        nextDueDate = dayjs(lastRecord.appliedAt).add(intervalDays, 'days');
    } else {
        // Nunca desparasitado -> Urgente si ya tiene edad
        nextDueDate = dayjs();
    }

    // Validar Peso antes de recomendar 'buy_medication'
    // Excepción: Si ya pasó mucho tiempo (overdue), igual marcamos como atrasado, 
    // pero la acción será pesar primero si el peso es viejo.

    const daysUntilDue = nextDueDate.diff(dayjs(), 'days');
    let status: DewormingStatus = 'up_to_date';

    if (daysUntilDue < -3) status = 'overdue';
    else if (daysUntilDue <= 0) status = 'due_now';
    else if (daysUntilDue <= 7) status = 'upcoming';

    // Si ya está al día, acción es 'none'
    if (status === 'up_to_date' && daysUntilDue > 7) {
        return {
            status,
            nextAction: {
                type: 'none',
                recommendedDate: nextDueDate.toDate(),
                reason: 'Al día'
            },
            confidenceLevel: 'high',
            lastApplied: lastRecord?.appliedAt
        };
    }

    // Si toca pronto o está atrasado, verificamos requisitos para la acción
    const weightOk = isWeightValid(pet);

    if (!weightOk) {
        return {
            status: status === 'up_to_date' ? 'upcoming' : status, // Si era up_to_date pero falta mucho no entra aca, si falta poco es upcoming
            nextAction: {
                type: 'update_weight',
                recommendedDate: dayjs().toDate(),
                reason: 'El peso debe estar actualizado para calcular la dosis.'
            },
            confidenceLevel: 'high',
            lastApplied: lastRecord?.appliedAt
        };
    }

    // Si todo OK
    return {
        status,
        nextAction: {
            type: 'buy_medication',
            recommendedDate: nextDueDate.toDate(),
            reason: status === 'overdue' ? 'Desparasitación vencida' : (status === 'due_now' ? 'Aplicar dosis ahora' : 'Próxima desparasitación')
        },
        confidenceLevel: 'high',
        lastApplied: lastRecord?.appliedAt
    };
};

// Lógica de Desparasitación Externa
export const calculateExternalDewormingStatus = (pet: IPet, records: IHealthRecord[]): DewormingResult => {
    // TODO: Implementar lógica externa similar, considerando environment y riskLevel
    const externalRecords = records
        .filter(r => r.type === 'deworming' && r.dewormingType === 'external')
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    const lastRecord = externalRecords[0];

    // Intervalo base 30 días (asumiendo pipeta estándar por defecto si no hay info de producto)
    // Podríamos leer el producto si estuviera en description o un campo future 'productType'
    let intervalDays = 30;

    let nextDueDate: dayjs.Dayjs;
    if (lastRecord) {
        nextDueDate = dayjs(lastRecord.appliedAt).add(intervalDays, 'days');
    } else {
        nextDueDate = dayjs();
    }

    const daysUntilDue = nextDueDate.diff(dayjs(), 'days');
    let status: DewormingStatus = 'up_to_date';

    // Ajuste por RiskLevel: Si es High, overdue es más estricto (ej. 1 día vs 3 días de margen)
    const overdueMargin = pet.riskLevel === 'high' ? 0 : 3;

    if (daysUntilDue < -overdueMargin) status = 'overdue';
    else if (daysUntilDue <= 0) status = 'due_now';
    else if (daysUntilDue <= 7) status = 'upcoming';

    if (status === 'up_to_date' && daysUntilDue > 7) {
        return {
            status,
            nextAction: {
                type: 'none',
                recommendedDate: nextDueDate.toDate(),
                reason: 'Al día'
            },
            confidenceLevel: 'medium', // Medium porque no sabemos el producto exacto (pipeta vs pastilla)
            lastApplied: lastRecord?.appliedAt
        };
    }

    // Para externa, el peso también es importante para comprar la pipeta/pastilla correcta
    const weightOk = isWeightValid(pet);
    if (!weightOk) {
        return {
            status: status === 'up_to_date' ? 'upcoming' : status,
            nextAction: {
                type: 'update_weight',
                recommendedDate: dayjs().toDate(),
                reason: 'Actualizar peso para adquirir pipeta/comprimido correcto.'
            },
            confidenceLevel: 'high',
            lastApplied: lastRecord?.appliedAt
        };
    }

    // Regla Indoor: Si es indoor, mensaje menos alarmista? (No cambia la lógica de fecha, pero la razón)
    let reason = 'Refuerzo de protección externa';
    if (pet.environment === 'indoor' && status !== 'overdue') {
        reason = 'Mantenimiento preventivo (Indoor)';
    }

    return {
        status,
        nextAction: {
            type: 'buy_medication',
            recommendedDate: nextDueDate.toDate(),
            reason
        },
        confidenceLevel: 'medium',
        lastApplied: lastRecord?.appliedAt
    };
};
