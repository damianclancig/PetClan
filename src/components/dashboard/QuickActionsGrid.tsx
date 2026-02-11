'use client';

import { Paper, Title, SimpleGrid, UnstyledButton, Text, Group, ThemeIcon } from '@mantine/core';
import { IconScale, IconVaccine, IconStethoscope, IconPaw } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';

const actions = [
    { label: 'Registrar Peso', icon: IconScale, color: 'blue', link: '/dashboard/pets' }, // For now links to pets list
    { label: 'Nueva Vacuna', icon: IconVaccine, color: 'teal', link: '/dashboard/pets' },
    { label: 'Consulta Vet', icon: IconStethoscope, color: 'violet', link: '/dashboard/pets' },
    { label: 'Nueva Mascota', icon: IconPaw, color: 'grape', link: '/dashboard/pets/new' },
];

export function QuickActionsGrid() {
    return (
        <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">Acciones Rápidas</Title>
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
                {actions.map((action) => (
                    <UnstyledButton
                        key={action.label}
                        component={Link}
                        href={action.link}
                        style={(theme) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: theme.spacing.md,
                            borderRadius: theme.radius.md,
                            backgroundColor: 'var(--mantine-color-default)',
                            border: '1px solid var(--mantine-color-default-border)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'var(--mantine-color-default-hover)',
                                transform: 'translateY(-2px)'
                            }
                        })}
                    >
                        <ThemeIcon color={action.color} size={48} radius="xl" variant="light" mb="xs">
                            <action.icon size={28} stroke={1.5} />
                        </ThemeIcon>
                        <Text size="sm" fw={500} ta="center">
                            {action.label}
                        </Text>
                    </UnstyledButton>
                ))}
            </SimpleGrid>
        </Paper>
    );
}
