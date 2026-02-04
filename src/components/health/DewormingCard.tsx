
"use client";

import { Text, Button, Badge, Group, Stack, ThemeIcon, Paper, Divider, Box, Tooltip } from '@mantine/core';
import { IPet } from '@/models/Pet';
import { IHealthRecord } from '@/models/HealthRecord';
import { IconScale, IconStethoscope, IconBug, IconBugOff, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { VeterinaryStatusService, UnifiedStatus } from '@/services/VeterinaryStatusService';

interface DewormingCardProps {
    pet: IPet;
    records: IHealthRecord[];
    onUpdateWeight: () => void;
}

const DewormingCard = ({ pet, records, onUpdateWeight }: DewormingCardProps) => {
    const [internalStatus, setInternalStatus] = useState<UnifiedStatus | null>(null);
    const [externalStatus, setExternalStatus] = useState<UnifiedStatus | null>(null);

    useEffect(() => {
        if (!pet) return;
        setInternalStatus(VeterinaryStatusService.getCategoryStatus('deworming_internal', pet, records));
        setExternalStatus(VeterinaryStatusService.getCategoryStatus('deworming_external', pet, records));
    }, [pet, records]);

    if (!internalStatus || !externalStatus) return null;

    const renderAction = (result: UnifiedStatus) => {
        const { action } = result;

        if (action === 'none') return null;

        if (action === 'buy_medication') {
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

        if (action === 'update_weight') {
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

        if (action === 'visit_vet') {
            return (
                <Box mt="sm">
                    <AlertIconMessage
                        icon={<IconStethoscope size={16} />}
                        title="Atención"
                        message="Consulta a tu veterinario para indicaciones específicas."
                        color="red"
                    />
                </Box>
            );
        }

        return null;
    };

    const getStatusColor = (status: UnifiedStatus['status']) => {
        switch (status) {
            case 'critical': return 'red';
            case 'warning': return 'orange';
            default: return 'green';
        }
    };

    const DewormingSection = ({ title, icon, result, isLast = false }: { title: string, icon: React.ReactNode, result: UnifiedStatus, isLast?: boolean }) => {
        const color = getStatusColor(result.status);

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
                        {result.label}
                    </Badge>
                </Group>

                <Group gap={6} align="center" mt={4}>
                    <Text size="xs" c="dimmed">
                        {result.message}
                    </Text>
                </Group>

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
                {/* <Text size="xs" fw={700} c={`var(--mantine - color - ${ color } -light - color)`}>{title}</Text> */}
                <Text size="xs" c={`var(--mantine-color-${color}-light-color)`} lh={1.4}>
                    {message}
                </Text>
            </Box>
        </Group>
    </Paper>
);

export default DewormingCard;
