'use client';

import { SimpleGrid, Paper, Stack, Text, Group, Avatar, Badge, ThemeIcon, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDog, IconCat, IconHelp, IconScale, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import type { DashboardPet, DashboardAlert } from '@/types/dashboard';

interface PetSnapshotGridProps {
    pets: DashboardPet[];
    alerts: DashboardAlert[];
}

export function PetSnapshotGrid({ pets, alerts }: PetSnapshotGridProps) {
    const isDesktop = useMediaQuery('(min-width: 992px)'); // md breakpoint

    if (!pets || pets.length === 0) {
        return (
            <Paper withBorder p="xl" radius="md" ta="center">
                <Text c="dimmed">No tienes mascotas registradas aún.</Text>
            </Paper>
        );
    }

    return (
        <SimpleGrid cols={{ base: 2, xs: 3, md: 4 }} spacing={4}>
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
                        p={8}
                        radius="md"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        className="hover:shadow-md hover:-translate-y-1"
                    >
                        <Stack gap={8}>
                            <Group
                                align="center"
                                wrap="nowrap"
                                justify={isDesktop ? "space-evenly" : "flex-start"}
                                gap={isDesktop ? 10 : 12}
                                style={{ width: '100%' }}
                            >
                                <Box style={{ position: 'relative', flexShrink: 0 }}>
                                    <Avatar
                                        src={pet.photoUrl}
                                        size={isDesktop ? 'xl' : 'lg'} // Increased to LG on mobile
                                        radius="xl"
                                        color={pet.identityColor}
                                    >
                                        {pet.name.charAt(0)}
                                    </Avatar>
                                    <ThemeIcon
                                        size={16} // Slightly larger for visibility
                                        radius="xl"
                                        color="white"
                                        style={{
                                            position: 'absolute',
                                            bottom: -2,
                                            right: -2,
                                            border: '1px solid var(--mantine-color-body)',
                                            color: 'black' // Force black color for contrast on white
                                        }}
                                    >
                                        {pet.species === 'dog' ? <IconDog size={10} /> : pet.species === 'cat' ? <IconCat size={10} /> : <IconHelp size={10} />}
                                    </ThemeIcon>
                                </Box>

                                <Stack
                                    gap={1}
                                    style={{
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        flex: isDesktop ? 'none' : 1, // On mobile, take all available space
                                        textAlign: isDesktop ? 'center' : 'left' // Align text left on mobile for better reading flow
                                    }}
                                >
                                    <Text fw={600} size="sm" lineClamp={1} style={{ lineHeight: 1.1 }}>{pet.name}</Text>
                                    <Text size="xs" c="dimmed" style={{ lineHeight: 1.1 }}>
                                        {pet.ageLabel}
                                    </Text>
                                    {pet.weight > 0 && (
                                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.1 }}>{pet.weight} kg</Text>
                                    )}
                                </Stack>
                            </Group>

                            <Badge
                                color={statusColor}
                                variant="light"
                                size="sm"
                                fullWidth
                                leftSection={<StatusIcon size={10} />}
                                styles={{ root: { paddingLeft: 4, paddingRight: 4, height: 20 } }}
                            >
                                {statusLabel}
                            </Badge>
                        </Stack>
                    </Paper>
                );
            })}
        </SimpleGrid>
    );
}
