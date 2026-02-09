import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { VeterinaryRules, VaccineSlot, VaccineStatus } from '@/utils/veterinaryRules';

export interface UnifiedStatus {
    status: 'critical' | 'warning' | 'ok' | 'due_now' | 'upcoming'; // Enhanced UI status
    label: string; // "Vencida", "Es Ahora", "Próxima"
    message: string;
    action: 'update_weight' | 'visit_vet' | 'buy_medication' | 'none';
    details?: {
        slot: VaccineSlot;
        dueDate: Date;
        reason?: string;
    };
}

export interface CategoryStatus {
    category: 'deworming_internal' | 'deworming_external' | 'vaccine_poly' | 'vaccine_rabies';
    status: UnifiedStatus;
}

export class VeterinaryStatusService {

    /**
     * Evaluates the status of a specific health category (e.g. Internal Deworming).
     * Enforces Priority: Overdue > Due Now > Upcoming > Completed.
     */
    static getCategoryStatus(
        category: CategoryStatus['category'],
        pet: IPet,
        records: IHealthRecord[]
    ): UnifiedStatus {
        const schedule = VeterinaryRules.getSchedule(pet.species);

        // 1. Filter Slots by Category
        const relevantSlots = schedule.filter(slot => this.isSlotInCategory(slot, category));

        if (relevantSlots.length === 0) {
            return {
                status: 'ok',
                label: 'No aplica',
                message: 'No hay reglas definidas para esta categoría.',
                action: 'none'
            };
        }

        // 2. Calculate Status for EACH slot
        const findings = relevantSlots.map(slot => {
            const result = VeterinaryRules.getSlotStatus(slot, new Date(pet.birthDate), records);
            return { slot, ...result };
        });

        // 3. APPLY PRIORITY RULES (The "Judge" Logic)

        // A. Critical: Any Overdue?
        // Sort by Age (Descending) to find the LATEST overdue requirement (most strictly binding).
        findings.sort((a, b) => b.slot.minAgeWeeks - a.slot.minAgeWeeks);

        const overdue = findings.filter(f => f.status === 'overdue');
        if (overdue.length > 0) {
            const primary = overdue[0]; // Most recent overdue slot
            const weightOk = VeterinaryRules.isWeightValid(pet.birthDate, pet.lastWeightUpdate);

            return {
                status: 'critical',
                label: 'Vencida',
                message: `${pet.name} tiene ${primary.slot.label} vencida.`,
                action: weightOk ? 'visit_vet' : 'update_weight',
                details: {
                    slot: primary.slot,
                    dueDate: primary.dueDate || new Date(),
                    reason: weightOk ? undefined : 'Peso desactualizado'
                }
            };
        }

        // B. Unified Warning/Action: Any Due Soon or Current Due?
        const upcoming = findings.filter(f => f.status === 'due_soon' || f.status === 'current_due');
        if (upcoming.length > 0) {
            const primary = upcoming[0];
            const weightOk = VeterinaryRules.isWeightValid(pet.birthDate, pet.lastWeightUpdate);
            const isCurrentDue = primary.status === 'current_due';

            return {
                status: isCurrentDue ? 'due_now' : 'upcoming', // Green vs Yellow
                label: isCurrentDue ? 'Es Ahora' : 'Próxima',
                message: isCurrentDue
                    ? `Es el momento ideal para ${primary.slot.label}.`
                    : `Se acerca la fecha para ${primary.slot.label}.`,
                action: weightOk ? (category.includes('deworming') ? 'buy_medication' : 'visit_vet') : 'update_weight',
                details: {
                    slot: primary.slot,
                    dueDate: primary.dueDate || new Date(),
                    reason: weightOk ? undefined : 'Peso desactualizado'
                }
            };
        }

        // C. Success: All Covered?
        return {
            status: 'ok',
            label: 'Al día',
            message: `${pet.name} tiene su plan al día.`,
            action: 'none'
        };
    }

    private static isSlotInCategory(slot: VaccineSlot, category: CategoryStatus['category']): boolean {
        const isExt = slot.vaccineType.some(t => t.includes('external') || t.includes('pulgas') || t.includes('pipeta'));

        switch (category) {
            case 'deworming_external':
                return isExt;
            case 'deworming_internal':
                return slot.vaccineType.some(t => t.includes('desparasitacion') || t.includes('deworming')) && !isExt;
            case 'vaccine_rabies':
                return slot.vaccineType.includes('rabies') || slot.vaccineType.includes('rabia');
            case 'vaccine_poly':
                return slot.vaccineType.some(t => t.includes('polivalente') || t.includes('sextuple') || t.includes('quintuple') || t.includes('triple'));
            default:
                return false;
        }
    }
}
