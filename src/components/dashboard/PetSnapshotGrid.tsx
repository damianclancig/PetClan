'use client';

import { SimpleGrid, Paper, Stack, Text, Group, Avatar, Badge, ThemeIcon, Box } from '@mantine/core';
import { IconDog, IconCat, IconHelp, IconScale, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import type { DashboardPet, DashboardAlert } from '@/types/dashboard';

interface PetSnapshotGridProps {
    pets: DashboardPet[];
    alerts: DashboardAlert[];
}

export function PetSnapshotGrid({ pets, alerts }: PetSnapshotGridProps) {
    if (!pets || pets.length === 0) {
        return (
            <Paper withBorder p="xl" radius="md" ta="center">
                <Text c="dimmed">No tienes mascotas registradas aún.</Text>
            </Paper>
        );
    }

    return (
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 3 }} spacing="md">
            {pets.map((pet) => {
                const petAlerts = alerts.filter(a => a.link.includes(pet._id));
                const hasCritical = petAlerts.some(a => a.severity === 'critical');
                const hasWarning = petAlerts.some(a => a.severity === 'warning');

                let statusColor = 'green';
                let StatusIcon = IconCheck;
                let statusLabel = 'Salud Ok';

                if (hasCritical) {
                    statusColor = 'red';
                    StatusIcon = IconAlertTriangle;
                    statusLabel = 'Atención';
                } else if (hasWarning) {
                    statusColor = 'orange';
                    StatusIcon = IconAlertTriangle;
                    statusLabel = 'Pendientes';
                }

                return (
                    <Paper
                        key={pet._id}
                        component={Link}
                        href={`/dashboard/pets/${pet._id}`}
                        withBorder
                        p="md"
                        radius="md"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        className="hover:shadow-md hover:-translate-y-1"
                    >
                        <Group align="center" wrap="nowrap" gap="md">
                            <Stack align="center" gap="xs">
                                <Box style={{ position: 'relative' }}>
                                    <Avatar
                                        src={pet.photoUrl}
                                        size="lg"
                                        radius="xl"
                                        color={pet.identityColor}
                                    >
                                        {pet.name.charAt(0)}
                                    </Avatar>
                                    <ThemeIcon
                                        size={20}
                                        radius="xl"
                                        color="white"
                                        style={{
                                            position: 'absolute',
                                            bottom: -4,
                                            right: -4,
                                            border: '2px solid var(--mantine-color-body)',
                                            color: 'var(--mantine-color-text)'
                                        }}
                                    >
                                        {pet.species === 'dog' ? <IconDog size={12} /> : pet.species === 'cat' ? <IconCat size={12} /> : <IconHelp size={12} />}
                                    </ThemeIcon>
                                </Box>
                                <Badge color={statusColor} variant="light" size="xs" leftSection={<StatusIcon size={10} />}>
                                    {statusLabel}
                                </Badge>
                            </Stack>

                            <Stack gap={2} style={{ flex: 1 }}>
                                <Text fw={600} size="lg" lineClamp={1}>{pet.name}</Text>

                                <Text size="sm" c="dimmed">
                                    {pet.ageLabel}
                                </Text>

                                {pet.weight > 0 && (
                                    <Group gap={4} mt={2}>
                                        <IconScale size={14} style={{ opacity: 0.5 }} />
                                        <Text size="sm" c="dimmed">{pet.weight} kg</Text>
                                    </Group>
                                )}
                            </Stack>
                        </Group>
                    </Paper>
                );
            })}
        </SimpleGrid>
    );
}
