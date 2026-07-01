/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { SimpleGrid, Paper, Stack, Text, Group, Avatar, Badge, ThemeIcon, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDog, IconCat, IconHelp, IconScale, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import type { DashboardPet, DashboardAlert } from '@/types/dashboard';
import { EmptyPetsState } from '@/components/pets/EmptyPetsState';
import { useTranslations } from 'next-intl';

interface PetSnapshotGridProps {
    pets: DashboardPet[];
    alerts: DashboardAlert[];
}

export function PetSnapshotGrid({ pets, alerts }: PetSnapshotGridProps) {
    const isDesktop = useMediaQuery('(min-width: 992px)'); // md breakpoint
    const t = useTranslations('DashboardView.Pets');

    if (!pets || pets.length === 0) {
        return (
            <EmptyPetsState />
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
                let statusLabel = t('healthOk');

                if (pet.status === 'lost') {
                    statusColor = 'red';
                    StatusIcon = IconAlertTriangle;
                    statusLabel = t('lostHelp');
                } else if (hasCritical) {
                    statusColor = 'red';
                    StatusIcon = IconAlertTriangle;
                    statusLabel = t('attention');
                } else if (hasWarning) {
                    statusColor = 'orange';
                    StatusIcon = IconAlertTriangle;
                    statusLabel = t('pending');
                }

                return (
                    <Paper
                        key={pet._id}
                        component={Link}
                        href={`/dashboard/pets/${pet._id}`}
                        withBorder
                        p={8}
                        radius="md"
                        className={`hover:shadow-md hover:-translate-y-1 ${pet.status === 'lost' ? 'border-red-500' : ''}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            borderColor: pet.status === 'lost' ? 'var(--mantine-color-red-5)' : undefined
                        }}
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
                                        flex: 1,
                                        minWidth: 0,
                                        textAlign: isDesktop ? 'center' : 'left'
                                    }}
                                >
                                    <Text
                                        fw={600}
                                        size="sm"
                                        lineClamp={2}
                                        title={pet.name}
                                        style={{ lineHeight: 1.2, wordBreak: 'break-word' }}
                                    >
                                        {pet.name}
                                    </Text>
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
                                variant={pet.status === 'lost' ? 'filled' : 'light'}
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
