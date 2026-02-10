import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { differenceInCalendarDays } from 'date-fns';
import { VeterinaryRules, VET_RULES } from '@/utils/veterinaryRules';
import { getPetAge } from '@/lib/dateUtils';
import { VeterinaryStatusService, CategoryStatus } from './VeterinaryStatusService';

export interface HealthAlert {
    id: string; // Unique virtual ID for this alert
    type: 'health';
    title: string;
    message: string;
    link: string;
    severity: 'warning' | 'critical' | 'success'; // warning (upcoming), critical (overdue), success (due now)
    date: Date; // Effective date (dueDate or today)
}

export class HealthAnalysisService {

    /**
     * Analyzes a pet's health history and returns a list of active alerts.
     */
    static analyzePetHealth(pet: IPet, records: IHealthRecord[]): HealthAlert[] {
        const alerts: HealthAlert[] = [];

        // 1. Analyze Weight
        const weightAlert = this.checkWeightStatus(pet);
        if (weightAlert) alerts.push(weightAlert);

        // 2. Analyze Vaccines & Deworming via Status Service
        const medicalAlerts = this.checkMedicalStatuses(pet, records);
        alerts.push(...medicalAlerts);

        // 3. Sort Alerts by Priority
        // Red (Critical) > Green (Success/Due Now) > Yellow (Warning/Upcoming)
        const priorityMap: Record<string, number> = {
            'critical': 0,
            'success': 1,
            'warning': 2
        };

        return alerts.sort((a, b) => {
            const priorityA = priorityMap[a.severity] ?? 99;
            const priorityB = priorityMap[b.severity] ?? 99;
            return priorityA - priorityB;
        });
    }

    /**
     * Checks if weight update is overdue based on age.
     */
    private static checkWeightStatus(pet: IPet): HealthAlert | null {
        // If never weighed (or no date), alert immediately
        if (!pet.lastWeightUpdate) {
            return {
                id: `weight-${pet._id}-missing`,
                type: 'health',
                title: `Actualización de Peso: ${pet.name}`,
                message: `No tenemos registrado cuándo fue el último control de peso de ${pet.name}. Mantenlo actualizado.`,
                link: `/dashboard/pets/${pet._id}?tab=health`,
                severity: 'warning',
                date: new Date()
            };
        }

        const today = new Date();
        const lastUpdate = new Date(pet.lastWeightUpdate);

        // Ensure accurate puppy detection
        const birthDate = new Date(pet.birthDate);
        const { months: ageInMonths } = getPetAge(pet.birthDate);
        const isPuppy = VeterinaryRules.isPuppy(birthDate);

        let daysThreshold = VET_RULES.WEIGHT.ADULT_DAYS;
        if (isPuppy) {
            daysThreshold = ageInMonths < 2
                ? VET_RULES.WEIGHT.VERY_YOUNG_PUPPY_DAYS
                : VET_RULES.WEIGHT.PUPPY_DAYS;
        }

        const daysSinceLastUpdate = differenceInCalendarDays(today, lastUpdate);
        const daysRemaining = daysThreshold - daysSinceLastUpdate;

        // 1. Overdue (Due today or past due)
        if (daysSinceLastUpdate >= daysThreshold) {
            return {
                id: `weight-${pet._id}-overdue`,
                type: 'health',
                title: `¡Es hora de pesar a ${pet.name}!`,
                message: `Hace ${daysSinceLastUpdate} días fue su último control. ` +
                    `Como es ${isPuppy ? 'cachorro' : 'adulto'}, recomendamos pesarlo cada ${daysThreshold} días.`,
                link: `/dashboard/pets/${pet._id}?tab=health`,
                severity: 'warning', // Could be critical if very late, but warning is fine
                date: today
            };
        }

        // 2. Upcoming (3 days before)
        if (daysRemaining <= 3 && daysRemaining > 0) {
            return {
                id: `weight-${pet._id}-upcoming`,
                type: 'health',
                title: `Próximo Control de Peso`,
                message: `En ${daysRemaining} días le toca control de peso a ${pet.name}.`,
                link: `/dashboard/pets/${pet._id}?tab=health`,
                severity: 'warning',
                date: today
            };
        }

        return null;
    }

    /**
     * Delegates checks to VeterinaryStatusService.
     */
    private static checkMedicalStatuses(pet: IPet, records: IHealthRecord[]): HealthAlert[] {
        const alerts: HealthAlert[] = [];
        const categories: CategoryStatus['category'][] = [
            'deworming_internal',
            'deworming_external',
            'vaccine_poly',
            'vaccine_rabies'
        ];

        for (const cat of categories) {
            const status = VeterinaryStatusService.getCategoryStatus(cat, pet, records);

            if (status.status !== 'ok' && status.details) {
                // Map UnifiedStatus to HealthAlert

                let title = '';
                let message = status.message; // Start with the default message from status

                // Map status to severity
                let severity: HealthAlert['severity'] = 'warning';
                if (status.status === 'critical') severity = 'critical';
                if (status.status === 'due_now') severity = 'success'; // Green for "Due Now"
                if (status.status === 'upcoming') severity = 'warning';

                if (status.action === 'update_weight') {
                    title = `Acción Requerida: Pesar a ${pet.name}`;
                    if (status.details.reason === 'Peso desactualizado') {
                        message = `Toca ${status.details.slot.label}, pero necesitamos peso actualizado.`;
                    }
                } else {
                    // Standard title logic
                    if (severity === 'critical') {
                        title = `¡Atención! ${status.details.slot.label} Vencida`;
                    } else if (severity === 'success') {
                        title = `¡Es hoy! ${status.details.slot.label}`;
                    } else {
                        title = `Próximamente: ${status.details.slot.label}`;
                    }
                }

                alerts.push({
                    id: `health-alert-${cat}-${pet._id}`,
                    type: 'health',
                    title: title,
                    message: message,
                    link: `/dashboard/pets/${pet._id}?tab=health`,
                    severity: severity,
                    date: status.details.dueDate
                });
            }
        }

        return alerts;
    }
}
