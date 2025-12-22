'use client';

import { Card, Image, Text, Group, Badge, Stack, ActionIcon, Box, Tooltip, rem, Overlay, Center } from '@mantine/core';
import { IconDog, IconCat, IconPaw, IconVaccine, IconStethoscope, IconGenderMale, IconGenderFemale } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { getPetIdentityColor } from '@/utils/pet-identity';

interface PetCardProps {
    pet: any;
}

export function PetCard({ pet }: PetCardProps) {
    const t = useTranslations('Pets');
    const tCommon = useTranslations('Common');
    const identityColor = getPetIdentityColor(pet._id);

    const getSpeciesIcon = (species: string) => {
        if (species === 'dog') return <IconDog size={20} />;
        if (species === 'cat') return <IconCat size={20} />;
        return <IconPaw size={20} />;
    };

    const getGenderIcon = (gender: string) => {
        if (gender === 'male') return <IconGenderMale size={14} />;
        if (gender === 'female') return <IconGenderFemale size={14} />;
        return null;
    };

    // Placeholder for vaccine status logic - utilizing tags mentioned in spec
    // Spec: 🟢 Vacunas al día, 🟡 Próxima, 🔴 Atrasada
    // Since we don't have the full logic here, we simulate or check if pet has vaccine status field
    // Assuming for now generic status or logic based on 'vaccineStatus' prop if available
    const vaccineStatus = pet.vaccineStatus || 'unknown';

    return (
        <Card
            padding="0"
            radius="lg"
            withBorder
            component={Link}
            href={`/dashboard/pets/${pet._id}`}
            style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                borderColor: pet.status === 'lost' ? 'var(--mantine-color-red-5)' : undefined,
                overflow: 'hidden',
                backgroundColor: 'var(--bg-surface)'
            }}
            mod={{ 'data-hover': true }}
            className="pet-card"
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <Card.Section style={{ position: 'relative' }}>
                {pet.photoUrl ? (
                    <Image
                        src={pet.photoUrl}
                        height={200}
                        alt={pet.name}
                        fit="cover"
                    />
                ) : (
                    <Box
                        h={200}
                        bg={`var(--mantine-color-${identityColor}-1)`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <IconPaw size={64} style={{ opacity: 0.2, color: `var(--mantine-color-${identityColor}-6)` }} />
                    </Box>
                )}

                {/* Overlay with Name */}
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '16px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    }}
                >
                    <Group justify="space-between" align="flex-end">
                        <Box>
                            <Text size="lg" fw={700} c="white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                {pet.name}
                            </Text>
                            <Group gap={6}>
                                <Badge
                                    size="sm"
                                    color={identityColor}
                                    variant="light"
                                    bg="rgba(255,255,255,0.2)"
                                    c="white"
                                    style={{ backdropFilter: 'blur(4px)' }}
                                >
                                    {tCommon(`species.${pet.species}`).split(' ')[0]}
                                </Badge>
                                {pet.birthDate && (
                                    <Text size="xs" c="white" style={{ opacity: 0.9 }}>
                                        {dayjs().diff(pet.birthDate, 'year')} años
                                    </Text>
                                )}
                            </Group>
                        </Box>
                        {getGenderIcon(pet.gender) && (
                            <Box c="white" style={{ opacity: 0.8 }}>
                                {getGenderIcon(pet.gender)}
                            </Box>
                        )}
                    </Group>
                </Box>

                {/* Status Badges - Absolute Top Right */}
                <Stack
                    gap={4}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                    }}
                >
                    {pet.status === 'lost' && (
                        <Badge color="red" variant="filled">🚨 PERDIDO</Badge>
                    )}
                    {/* Simulated Vaccine Status */}
                    {/* <Badge circle size="sm" color="green" title="Vacunas al día">✓</Badge> */}
                </Stack>
            </Card.Section>

            <Card.Section p="md">
                <Group justify="space-between" wrap="nowrap">
                    <Box>
                        <Text size="xs" c="dimmed" fw={500}>{t('breed')}</Text>
                        <Text size="sm" fw={600} lineClamp={1} title={pet.breed}>{pet.breed}</Text>
                    </Box>
                    <Box style={{ textAlign: 'right' }}>
                        <Text size="xs" c="dimmed" fw={500}>{t('weight')}</Text>
                        <Text size="sm" fw={600}>{pet.weight ? `${pet.weight} kg` : '-'}</Text>
                    </Box>
                </Group>
            </Card.Section>
        </Card>
    );
}
