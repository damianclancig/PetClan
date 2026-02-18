import { ActionIcon, Badge, Box, Card, Group, Image, Stack, Text } from '@mantine/core';
import { IconCat, IconDog, IconGenderFemale, IconGenderMale, IconPaw, IconGhost, IconArchive } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { MagicTap } from '@/components/ui/MagicWrappers';
import { formatAge } from '@/lib/dateUtils';
import { PetSpeciesBadge } from './PetSpeciesBadge';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface PetCardProps {
    pet: any;
    onClick?: () => void;
    layoutId?: string;
}

export function PetCard({ pet, onClick, layoutId }: PetCardProps) {
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

    const vaccineStatus = pet.vaccineStatus || 'unknown';

    return (
        <motion.div
            layout={layoutId ? true : undefined}
            layoutId={layoutId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <MagicTap
                style={{ borderRadius: 'var(--mantine-radius-lg)' }}
            >
                <Card
                    padding="0"
                    radius="lg"
                    withBorder
                    component={onClick ? 'div' : (Link as any)}
                    href={onClick ? undefined : `/dashboard/pets/${pet._id}`}
                    onClick={onClick}
                    style={{
                        cursor: 'pointer',
                        borderColor: pet.status === 'lost' ? 'var(--mantine-color-red-5)' : undefined,
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-surface)'
                    }}
                    className="pet-card"
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
                                        <PetSpeciesBadge
                                            species={pet.species}
                                            sex={pet.sex}
                                            size="sm"
                                            color={identityColor}
                                            bg="rgba(255,255,255,0.2)"
                                            c="white"
                                            style={{ backdropFilter: 'blur(4px)' }}
                                        />
                                        <Text size="xs" c="white" style={{ opacity: 0.9 }}>
                                            {formatAge(pet.birthDate)}
                                        </Text>
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
                            {pet.status === 'deceased' && (
                                <Badge color="violet" variant="light" leftSection={<IconGhost size={12} />}>En Memoria</Badge>
                            )}
                            {pet.status === 'archived' && (
                                <Badge color="gray" variant="filled" leftSection={<IconArchive size={12} />}>Archivado</Badge>
                            )}
                            {/* Simulated Vaccine Status */}
                            {/* <Badge circle size="sm" color="green" title="Vacunas al día">✓</Badge> */}
                        </Stack>

                        {/* Deceased Date Overlay */}
                        {pet.status === 'deceased' && (
                            <Box
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                    width: 'auto',
                                    padding: '4px 12px',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(2px)'
                                }}
                            >
                                <Text size="sm" c="white" fw={500} fs="italic">
                                    🕊️ {dayjs(pet.birthDate).format('YYYY')} - {pet.deathDate ? dayjs(pet.deathDate).format('YYYY') : '...'}
                                </Text>
                            </Box>
                        )}
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
            </MagicTap>
        </motion.div>
    );
}
