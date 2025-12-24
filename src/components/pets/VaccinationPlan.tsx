'use client';

import { Card, Text, Badge, Timeline, ThemeIcon, Group, Button, LoadingOverlay } from '@mantine/core';
import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { getVaccinationStatus } from '@/utils/vaccinationLogic';
import { IconCheck, IconClock, IconAlertCircle, IconVaccine } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

interface VaccinationPlanProps {
    pet: IPet;
    records: IHealthRecord[];
    isLoading?: boolean;
}

export function VaccinationPlan({ pet, records, isLoading }: VaccinationPlanProps) {
    const t = useTranslations('Health'); // Assuming keys exist or will fallback
    const schedule = getVaccinationStatus(pet, records);

    if (isLoading) return <LoadingOverlay visible />;

    return (
        <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="lg">
                <Text fw={700} size="lg">Plan de Vacunación (Sugerido)</Text>
                <Badge variant="light" color="blue">{schedule.filter(s => s.status === 'upcoming').length} Próximas</Badge>
            </Group>

            <Timeline active={schedule.findIndex(s => s.status === 'pending') - 1} bulletSize={24} lineWidth={2}>
                {schedule.map((item, index) => {
                    const isOverdue = item.status === 'overdue';
                    const isApplied = item.status === 'applied';
                    const isUpcoming = item.status === 'upcoming';

                    let color = 'gray';
                    let icon = <IconClock size={12} />;

                    if (isApplied) { color = 'teal'; icon = <IconCheck size={12} />; }
                    if (isOverdue) { color = 'red'; icon = <IconAlertCircle size={12} />; }
                    if (isUpcoming) { color = 'yellow'; icon = <IconVaccine size={12} />; }

                    return (
                        <Timeline.Item
                            key={index}
                            bullet={icon}
                            color={color}
                            title={
                                <Group gap="xs">
                                    <Text fw={500}>{item.vaccineName}</Text>
                                    <Badge size="xs">{item.doseNumber}ª Dosis</Badge>
                                </Group>
                            }
                        >
                            <Text c="dimmed" size="sm">
                                {dayjs(item.dueDate).format('DD/MM/YYYY')} - {isApplied ? 'Aplicada' : (isOverdue ? 'Vencida' : (isUpcoming ? 'Próxima' : 'Pendiente'))}
                            </Text>
                            {item.description && <Text size="xs" mt={4}>{item.description}</Text>}
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </Card>
    );
}
