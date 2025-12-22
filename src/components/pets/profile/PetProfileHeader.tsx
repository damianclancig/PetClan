'use client';

import { Box, Container, Avatar, Title, Text, Group, Badge, Paper, Tabs, rem, ActionIcon, Menu, Button } from '@mantine/core';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { IconPencil, IconShare, IconDotsVertical, IconCheck, IconArrowBackUp } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';

interface PetProfileHeaderProps {
    pet: any;
    activeTab: string;
    onTabChange: (value: string | null) => void;
    onShare: () => void;
}

export function PetProfileHeader({ pet, activeTab, onTabChange, onShare }: PetProfileHeaderProps) {
    const t = useTranslations('PetDetail');
    const tCommon = useTranslations('Common');
    const identityColor = getPetIdentityColor(pet._id);

    return (
        <Paper radius="lg" withBorder mb="lg" style={{ overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
            {/* Organic Header Background */}
            <Box
                h={200}
                style={{
                    background: `linear-gradient(135deg, var(--mantine-color-${identityColor}-5), var(--mantine-color-${identityColor}-3))`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative Blob */}
                <svg
                    viewBox="0 0 1440 320"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 'auto',
                        opacity: 0.2
                    }}
                >
                    <path
                        fill="#fff"
                        fillOpacity="1"
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>

                {/* Back Button Top Left */}
                <Button
                    component={Link}
                    href="/dashboard/pets"
                    variant="white"
                    color={identityColor}
                    radius="xl"
                    leftSection={<IconArrowBackUp size={18} />}
                    style={{ position: 'absolute', top: 16, left: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    Volver
                </Button>

                {/* Actions Top Right */}
                <Group style={{ position: 'absolute', top: 16, right: 16 }} gap="xs">
                    <ActionIcon
                        variant="white"
                        color={identityColor}
                        size="lg"
                        radius="xl"
                        onClick={onShare}
                        aria-label="Compartir"
                    >
                        <IconShare size={18} />
                    </ActionIcon>
                    <ActionIcon
                        component={Link}
                        href={`/dashboard/pets/${pet._id}/edit`}
                        variant="white"
                        color={identityColor}
                        size="lg"
                        radius="xl"
                        aria-label="Editar"
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Group>
            </Box>

            <Container size="lg" style={{ marginTop: -60, paddingBottom: 16, position: 'relative' }}>
                <Group align="flex-end" wrap="wrap">
                    <Avatar
                        src={pet.photoUrl}
                        size={120}
                        radius={120}
                        color={identityColor}
                        style={{
                            border: '4px solid var(--bg-surface)',
                            boxShadow: 'var(--mantine-shadow-md)'
                        }}
                    >
                        {pet.name.charAt(0)}
                    </Avatar>

                    <Box style={{ flex: 1, paddingBottom: 10 }}>
                        <Title order={1} fw={800}>{pet.name}</Title>
                        <Group gap="xs" mt={4}>
                            <Badge color={identityColor} variant="light" size="lg">
                                {tCommon(`species.${pet.species}`)}
                            </Badge>
                            <Text c="dimmed">
                                {pet.breed} • {dayjs().diff(pet.birthDate, 'year')} años
                            </Text>
                        </Group>
                    </Box>
                </Group>

                <Tabs
                    value={activeTab}
                    onChange={onTabChange}
                    variant="outline"
                    radius="md"
                    mt="xl"
                    color={identityColor}
                >
                    <Tabs.List>
                        <Tabs.Tab value="summary">Resumen</Tabs.Tab>
                        <Tabs.Tab value="timeline">Línea de tiempo</Tabs.Tab>
                        <Tabs.Tab value="health">Salud</Tabs.Tab>
                        {/* <Tabs.Tab value="docs">Documentos</Tabs.Tab> */}
                    </Tabs.List>
                </Tabs>
            </Container>
        </Paper>
    );
}
