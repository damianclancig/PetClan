'use client';

import { Paper, Title, SimpleGrid, UnstyledButton, Text, Group, ThemeIcon, Modal, Stack, Avatar } from '@mantine/core';
import { IconScale, IconVaccine, IconStethoscope, IconPaw, IconChevronRight } from '@tabler/icons-react';
import { Link, useRouter } from '@/i18n/routing';
import { useState } from 'react';
import type { DashboardPet } from '@/types/dashboard';
import { WeightEntryModal } from '@/components/pets/WeightEntryModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface QuickActionsGridProps {
    pets?: DashboardPet[];
}

const actions = [
    { label: 'Registrar Peso', icon: IconScale, color: 'blue', action: 'weight' },
    { label: 'Nueva Vacuna', icon: IconVaccine, color: 'teal', link: '/dashboard/pets' },
    { label: 'Consulta Vet', icon: IconStethoscope, color: 'violet', link: '/dashboard/pets' },
    { label: 'Nueva Mascota', icon: IconPaw, color: 'grape', link: '/dashboard/pets/new' },
];

export function QuickActionsGrid({ pets = [] }: QuickActionsGridProps) {
    const router = useRouter();
    const [selectionOpen, setSelectionOpen] = useState(false);
    const [weightModalOpen, setWeightModalOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const handleActionClick = (action: typeof actions[0]) => {
        if (action.action === 'weight') {
            setSelectionOpen(true);
        } else if (action.link) {
            router.push(action.link);
        }
    };

    const handlePetSelect = (petId: string) => {
        setSelectedPetId(petId);
        setSelectionOpen(false);
        // Small delay to allow modal transition
        setTimeout(() => setWeightModalOpen(true), 200);
    };

    const handleWeightModalClose = () => {
        setWeightModalOpen(false);
        setSelectedPetId(null);
        // Refresh dashboard data logic is handled inside WeightEntryModal via window.location.reload() for now
        // or we can rely on router.refresh() if we change the implementation later
        router.refresh();
    };

    // Find selected pet object for weight modal if needed (e.g. for current weight)
    const selectedPet = pets.find(p => p._id === selectedPetId);

    return (
        <>
            <Paper withBorder p="md" radius="md">
                <Title order={4} mb="md">Acciones Rápidas</Title>
                <SimpleGrid cols={{ base: 2, sm: 4 }}>
                    {actions.map((action) => (
                        <UnstyledButton
                            key={action.label}
                            onClick={() => handleActionClick(action)}
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

            {/* Pet Selection Modal */}
            <Modal
                opened={selectionOpen}
                onClose={() => setSelectionOpen(false)}
                title="Selecciona una mascota 🐾"
                centered
            >
                <Stack>
                    {pets.length > 0 ? (
                        pets.map((pet) => (
                            <UnstyledButton
                                key={pet._id}
                                onClick={() => handlePetSelect(pet._id)}
                                p="md"
                                style={(theme) => ({
                                    borderRadius: theme.radius.md,
                                    border: `1px solid ${theme.colors.gray[2]}`,
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: theme.colors.gray[0],
                                    },
                                })}
                            >
                                <Group wrap="nowrap">
                                    <Avatar src={pet.photoUrl} radius="xl" size="md" color={pet.identityColor}>
                                        {pet.name.charAt(0)}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" fw={500}>{pet.name}</Text>
                                        <Text size="xs" c="dimmed">
                                            {pet.species === 'dog' ? 'Perro' : pet.species === 'cat' ? 'Gato' : 'Mascota'} • {pet.ageLabel}
                                        </Text>
                                        {pet.lastWeightDate && (
                                            <Text size="xs" c="dimmed" mt={4} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <IconScale size={14} style={{ opacity: 0.7 }} />
                                                Último: {dayjs(pet.lastWeightDate).format('DD/MM/YYYY')} • {dayjs(pet.lastWeightDate).fromNow()}
                                            </Text>
                                        )}
                                    </div>
                                    <IconChevronRight size={18} color="gray" />
                                </Group>
                            </UnstyledButton>
                        ))
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">
                            No tienes mascotas registradas. <Link href="/dashboard/pets/new">Registra una aquí</Link>.
                        </Text>
                    )}
                </Stack>
            </Modal>

            {/* Weight Entry Modal */}
            {selectedPetId && (
                <WeightEntryModal
                    opened={weightModalOpen}
                    onClose={handleWeightModalClose}
                    petId={selectedPetId}
                    currentWeight={selectedPet?.weight}
                />
            )}
        </>
    );
}
