'use client';

import { Paper, Title, Grid, Card, Text, Group, ThemeIcon, Badge, Tooltip, Alert, Container, Button } from '@mantine/core';
import { IconCheck, IconAlertTriangle, IconClock, IconVaccine, IconCalendarEvent, IconInfoCircle, IconPill, IconPlus } from '@tabler/icons-react';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { IHealthRecord } from '@/models/HealthRecord';
import { getVaccinationSchedule, getVaccineStatus, VaccineSlot, VaccineStatus } from '@/utils/vaccinationUtils';
import { useTranslations } from 'next-intl';

interface VaccinationCalendarProps {
    petId: string;
    birthDate: Date;
    species: string;
    onAddRecord?: () => void;
}

export function VaccinationCalendar({ petId, birthDate, species, onAddRecord }: VaccinationCalendarProps) {
    const { records, isLoading } = useHealthRecords(petId);
    const t = useTranslations('PuppyCalendar');

    if (isLoading) return <Text>Cargando calendario...</Text>;

    const schedule = getVaccinationSchedule(species);

    // Fallback for unsupported species
    if (!schedule || schedule.length === 0) {
        return (
            <Paper p="md" radius="lg" withBorder bg="var(--mantine-color-body)">
                <Group mb="md">
                    <IconVaccine size={24} />
                    <Title order={3}>Calendario de Vacunación</Title>
                </Group>
                <Alert variant="light" color="blue" title="Calendario no disponible" icon={<IconInfoCircle />}>
                    Por el momento, no tenemos un calendario automático para <strong>{species || 'esta especie'}</strong>.
                    <br />
                    Te recomendamos consultar con tu veterinario para armar el plan de salud ideal.
                    <br /><br />
                    <em>Próximamente agregaremos soporte para más especies (tortugas, aves, conejos, etc.).</em>
                </Alert>
            </Paper>
        );
    }

    const healthRecords = records as IHealthRecord[] || [];

    // --- Logic to hide future pending vaccinations ---
    // We group slots by "family" to determine sequential dependency.
    // Heuristic: Group by partial ID similarity or ID prefix.
    const getSlotFamily = (id: string) => {
        if (id.includes('external') || id.includes('pulgas')) return 'external';
        if (id.includes('deworm')) return 'deworm';
        if (id.includes('poly') || id.includes('triple') || id.includes('sextuple')) return 'poly';
        if (id.includes('rabies')) return 'rabies';
        return 'other';
    };

    // Calculate status for ALL slots first
    const slotsWithStatus = schedule.map(slot => ({
        slot,
        ...getVaccineStatus(slot, birthDate, healthRecords)
    }));

    // Identify which slots should be visible
    const visibleSlotIds = new Set<string>();

    const families = ['deworm', 'external', 'poly', 'rabies', 'other'];

    families.forEach(family => {
        const familySlots = slotsWithStatus.filter(s => getSlotFamily(s.slot.id) === family);

        // Find last completed
        // FIX: Don't show 'missed_replaced' as completed history. 
        // We want to hide them entirely so only relevant future/pending slots are shown for adults.
        const completedSlots = familySlots.filter(s => s.status === 'completed');
        const lastCompleted = completedSlots[completedSlots.length - 1];

        // Find first future/pending
        // Also exclude 'missed_replaced' here just in case, ensuring we find the first REAL pending slot.
        const pendingSlots = familySlots.filter(s => s.status !== 'completed' && s.status !== 'missed_replaced');
        const firstPending = pendingSlots[0];

        if (lastCompleted) {
            visibleSlotIds.add(lastCompleted.slot.id);
        }

        if (firstPending) {
            visibleSlotIds.add(firstPending.slot.id);
        }

        // Special case: If NO completed history, user should see at least the first one (already covered by firstPending)
        // Special case: If everything is completed, user sees just the last one (covered by lastCompleted)
    });

    // Update ageLabels to only include those that have at least one visible slot
    const visibleSlots = slotsWithStatus.filter(s => visibleSlotIds.has(s.slot.id));
    const visibleAgeLabels = Array.from(new Set(visibleSlots.map(s => s.slot.ageLabel)));

    // Re-function for render to use the pre-calculated object
    const renderSlotItem = (item: typeof slotsWithStatus[0]) => {
        const { slot, status, matchRecord } = item;

        let color = 'gray';
        let icon = <IconClock size={16} />;
        let statusText = 'Pendiente';
        let subText = '';

        switch (status) {
            case 'completed':
                color = 'green';
                icon = <IconCheck size={16} />;
                statusText = 'Completada';
                subText = matchRecord
                    ? `${matchRecord.title} - ${new Date(matchRecord.appliedAt).toLocaleDateString()}`
                    : '';
                break;
            case 'overdue':
                color = 'red';
                icon = <IconAlertTriangle size={16} />;
                statusText = 'Vencida';
                subText = 'Consultar Vet';
                break;
            case 'due_soon':
                color = 'yellow';
                icon = <IconCalendarEvent size={16} />;
                statusText = 'Próxima';
                subText = 'Agendar turno';
                break;
            case 'missed_replaced':
                color = 'blue';
                icon = <IconCheck size={16} />;
                statusText = 'Reemplazada';
                subText = 'Cubierta por dosis posterior';
                break;
            case 'current_due':
                color = 'orange';
                icon = <IconClock size={16} />;
                statusText = 'Es hora de vacunar';
                subText = 'Visita a tu veterinario';
                break;
        }

        // Override for Deworming
        if (slot.vaccineType.includes('desparasitacion')) {
            if (status === 'completed') {
                icon = <IconCheck size={16} />;
            } else {
                icon = <IconPill size={16} />;
            }
            if (status === 'current_due') {
                statusText = 'Desparasitación';
                subText = 'Administrar ahora';
            }
        }

        const getStatusStyles = () => {
            switch (status) {
                case 'completed':
                    return {
                        bg: 'var(--mantine-color-green-light)',
                        borderColor: 'var(--mantine-color-green-light-color)'
                    };
                case 'overdue':
                    return {
                        bg: 'var(--mantine-color-red-light)',
                        borderColor: 'var(--mantine-color-red-light-color)'
                    };
                case 'due_soon':
                    return {
                        bg: 'var(--mantine-color-yellow-light)',
                        borderColor: 'var(--mantine-color-yellow-light-color)'
                    };
                case 'current_due':
                    return {
                        bg: 'var(--mantine-color-orange-light)',
                        borderColor: 'var(--mantine-color-orange-light-color)'
                    };
                case 'missed_replaced':
                    return {
                        bg: 'var(--mantine-color-gray-light)',
                        borderColor: 'var(--mantine-color-gray-light-color)'
                    };
                default:
                    return { bg: undefined, borderColor: undefined };
            }
        };

        const styles = getStatusStyles();

        // Card style for the "Paper Calendar" look
        return (
            <Card
                key={slot.id}
                shadow="sm"
                padding="xs"
                radius="md"
                withBorder
                {...(styles.bg ? { bg: styles.bg } : {})}
                style={{
                    borderColor: styles.borderColor ? styles.borderColor : undefined,
                }}
            >
                <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon color={color} variant={status === 'completed' ? 'filled' : 'light'} size="md" radius="xl">
                        {icon}
                    </ThemeIcon>
                    <div>
                        <Text size="sm" fw={600} style={{ lineHeight: 1.2 }}>{slot.label}</Text>
                        <Text size="xs" c="dimmed" fw={500}>{statusText}</Text>
                        {subText && <Text size="xs" c="dimmed">{subText}</Text>}
                    </div>
                </Group>
            </Card>
        );
    };

    return (
        <Paper p="md" radius="lg" withBorder bg="var(--mantine-color-body)">
            <Group mb="md" justify="space-between">
                <Group>
                    <IconVaccine size={24} />
                    <Title order={3}>Calendario de Vacunación</Title>
                </Group>
                {onAddRecord && (
                    <Button
                        variant="light"
                        size="xs"
                        leftSection={<IconPlus size={14} />}
                        onClick={onAddRecord}
                    >
                        Actualizar Libreta
                    </Button>
                )}
            </Group>

            <Grid gutter="md">
                {visibleAgeLabels.map((ageLabel) => {
                    // Only show slots for this age label that are marked as visible
                    const itemsInRow = visibleSlots.filter(s => s.slot.ageLabel === ageLabel);

                    if (itemsInRow.length === 0) return null;

                    return (
                        <Grid.Col span={12} key={ageLabel}>
                            <Card
                                withBorder
                                padding="sm"
                                radius="md"
                                bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
                            >
                                <Grid align="center">
                                    <Grid.Col span={{ base: 12, sm: 3 }}>
                                        <Badge size="lg" variant="light" color="gray" fullWidth>
                                            {ageLabel}
                                        </Badge>
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 9 }}>
                                        <Grid>
                                            {itemsInRow.map(item => (
                                                <Grid.Col span={{ base: 12, md: 6 }} key={item.slot.id}>
                                                    {renderSlotItem(item)}
                                                </Grid.Col>
                                            ))}
                                        </Grid>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Paper>
    );
}
