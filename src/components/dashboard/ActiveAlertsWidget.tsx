'use client';

import { Box, Paper, Title, Text, Group, Stack, ThemeIcon, Button, Badge } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconCalendarEvent, IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import type { DashboardAlert } from '@/types/dashboard';

interface ActiveAlertsWidgetProps {
    alerts: DashboardAlert[];
}

export function ActiveAlertsWidget({ alerts }: ActiveAlertsWidgetProps) {
    // Show top 3 alerts
    const displayAlerts = alerts.slice(0, 3);
    const hasMore = alerts.length > 3;

    if (alerts.length === 0) {
        return (
            <Paper withBorder p="md" radius="md">
                <Group>
                    <ThemeIcon color="green" variant="light" size="lg" radius="xl">
                        <IconCheck size={20} />
                    </ThemeIcon>
                    <Box>
                        <Text fw={500}>Todo en orden</Text>
                        <Text size="sm" c="dimmed">No tienes alertas pendientes para tus mascotas.</Text>
                    </Box>
                </Group>
            </Paper>
        );
    }

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="md">
                <Title order={4}>Alertas Activas</Title>
                <Badge color="red" variant="light">{alerts.length}</Badge>
            </Group>

            <Stack gap="md">
                {displayAlerts.map((alert) => (
                    <Paper key={alert.id} withBorder p="sm" radius="md" bg="var(--mantine-color-body)">
                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon
                                color={alert.severity === 'critical' ? 'red' : alert.severity === 'success' ? 'green' : 'orange'}
                                variant="light"
                                size="lg"
                                radius="md"
                            >
                                {alert.severity === 'success' ? <IconCalendarEvent size={20} /> : <IconAlertTriangle size={20} />}
                            </ThemeIcon>

                            <Box style={{ flex: 1 }}>
                                <Text size="sm" fw={600} lineClamp={1}>
                                    {alert.title}
                                </Text>
                                <Text size="xs" c="dimmed" lineClamp={2} mb={4}>
                                    {alert.message}
                                </Text>
                                <Button
                                    component={Link}
                                    href={alert.link}
                                    variant="subtle"
                                    size="xs"
                                    px="xs"
                                    rightSection={<IconArrowRight size={12} />}
                                >
                                    Ver detalles
                                </Button>
                            </Box>
                        </Group>
                    </Paper>
                ))}

                {hasMore && (
                    <Button variant="subtle" size="xs" color="gray" fullWidth>
                        Ver {alerts.length - 3} alertas más
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}


