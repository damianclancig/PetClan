"use client";

import { Card, Text, Button, Badge, Group, Stack, Progress, ThemeIcon, Paper, Divider, Box, Tooltip } from '@mantine/core';
import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { calculateInternalDewormingStatus, calculateExternalDewormingStatus, DewormingResult } from '@/utils/dewormingLogic';
import { IconCheck, IconAlertTriangle, IconScale, IconStethoscope, IconBug, IconBugOff, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

interface DewormingCardProps {
    pet: IPet;
    records: IHealthRecord[];
    onUpdateWeight: () => void;
}

const DewormingCard = ({ pet, records, onUpdateWeight }: DewormingCardProps) => {
    const [internalStatus, setInternalStatus] = useState<DewormingResult | null>(null);
    const [externalStatus, setExternalStatus] = useState<DewormingResult | null>(null);

    useEffect(() => {
        if (pet && records) {
            setInternalStatus(calculateInternalDewormingStatus(pet, records));
            setExternalStatus(calculateExternalDewormingStatus(pet, records));
        }
    }, [pet, records]);

    if (!internalStatus || !externalStatus) return null;

    const renderAction = (result: DewormingResult) => {
        const { nextAction } = result;

        if (nextAction.type === 'none') return null;

        if (nextAction.type === 'buy_medication') {
            return (
                <Stack gap="xs" mt="sm">
                    <AlertIconMessage
                        icon={<IconStethoscope size={16} />}
                        title="Recomendación"
                        message="Consultá con tu veterinario qué producto aplicar."
                        color="blue"
                    />
                </Stack>
            );
        }

        if (nextAction.type === 'update_weight') {
            return (
                <Button
                    leftSection={<IconScale size={16} />}
                    variant="light"
                    color="yellow"
                    size="xs"
                    onClick={onUpdateWeight}
                    fullWidth
                    mt="sm"
                >
                    Actualizar Peso
                </Button>
            );
        }

        if (nextAction.type === 'visit_vet') {
            return (
                <Box mt="sm">
                    <AlertIconMessage
                        icon={<IconStethoscope size={16} />}
                        title="Atención"
                        message="Consulta a tu veterinario para indicaciones específicas en esta etapa."
                        color="red"
                    />
                </Box>
            );
        }

        return null; // Should not reach here typically
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overdue': return 'red';
            case 'due_now': return 'orange';
            case 'upcoming': return 'yellow';
            case 'blocked': return 'gray';
            default: return 'green';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'overdue': return 'Vencido';
            case 'due_now': return 'Es Hora';
            case 'upcoming': return 'Próximo';
            case 'blocked': return 'En espera';
            default: return 'Al día';
        }
    }

    const DewormingSection = ({ title, icon, result, isLast = false }: { title: string, icon: React.ReactNode, result: DewormingResult, isLast?: boolean }) => {
        const color = getStatusColor(result.status);
        const isActionRequired = result.status === 'overdue' || result.status === 'due_now' || result.status === 'upcoming' || (result.status === 'blocked' && result.nextAction.type !== 'none');

        return (
            <Box py="sm">
                <Group justify="space-between" align="center" mb={4}>
                    <Group gap="xs">
                        <ThemeIcon color={color} variant="light" size="md" radius="md">
                            {icon}
                        </ThemeIcon>
                        <Text fw={600} size="sm">{title}</Text>
                    </Group>
                    <Badge color={color} variant="dot" size="sm">
                        {getStatusLabel(result.status)}
                    </Badge>
                </Group>

                <Group gap={6} align="center" mt={4}>
                    <Text size="xs" c="dimmed">
                        {result.nextAction.recommendedDate ? (
                            <>Fecha sugerida: <b>{dayjs(result.nextAction.recommendedDate).format('DD/MM/YYYY')}</b></>
                        ) : (
                            result.nextAction.reason
                        )}
                    </Text>
                    {/* If reason is not the date logic, show reason too if needed, but keeping it clean */}
                </Group>

                {/* Additional context if update weight needed */}
                {result.nextAction.type !== 'none' && result.nextAction.reason && !result.nextAction.recommendedDate && (
                    <Text size="xs" c={color} mt={2}>
                        {result.nextAction.reason}
                    </Text>
                )}

                {renderAction(result)}
            </Box>
        )
    }

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="xs">
                <Text fw={600} size="md">Control de Parásitos</Text>
                <Tooltip label="Calendario inteligente basado en peso y edad">
                    <IconInfoCircle size={16} style={{ opacity: 0.5 }} />
                </Tooltip>
            </Group>

            <Stack gap={0}>
                <DewormingSection
                    title="Desparasitación Interna"
                    icon={<IconBugOff size={18} />}
                    result={internalStatus}
                />
                <Divider my="xs" variant="dashed" />
                <DewormingSection
                    title="Desparasitación Externa"
                    icon={<IconBug size={18} />}
                    result={externalStatus}
                    isLast
                />
            </Stack>
        </Paper>
    );
};

const AlertIconMessage = ({ icon, title, message, color }: any) => (
    <Paper withBorder p="xs" bg={`var(--mantine-color-${color}-light)`} style={{ borderColor: `var(--mantine-color-${color}-light-color)` }}>
        <Group gap="xs" align="flex-start">
            <ThemeIcon c={`var(--mantine-color-${color}-light-color)`} bg="transparent" size="sm" mt={2}>
                {icon}
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
                {/* <Text size="xs" fw={700} c={`var(--mantine-color-${color}-light-color)`}>{title}</Text> */}
                <Text size="xs" c={`var(--mantine-color-${color}-light-color)`} lh={1.4}>
                    {message}
                </Text>
            </Box>
        </Group>
    </Paper>
);

export default DewormingCard;
