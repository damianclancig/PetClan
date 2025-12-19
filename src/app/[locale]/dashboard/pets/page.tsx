'use client';

import { Title, Text, Button, Group, Container, SimpleGrid, Card, Badge, Loader, Avatar, Stack, ThemeIcon, Paper, Tabs } from '@mantine/core';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { IconDog, IconCat, IconPaw } from '@tabler/icons-react';
import { useState } from 'react';

export default function PetsPage() {
    const [activeTab, setActiveTab] = useState<string | null>('active');
    // Si tab es 'active', enviamos undefined para traer (active+lost). Si es 'history', enviamos 'history' (deceased+archived).
    const { pets, isLoading, isError } = usePets(activeTab === 'active' ? undefined : 'history');
    const t = useTranslations('Pets');
    const tCommon = useTranslations('Common');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError) return <Container><Text c="red">Error al cargar las mascotas.</Text></Container>;

    const getSpeciesIcon = (species: string) => {
        if (species === 'dog') return <IconDog size={24} />;
        if (species === 'cat') return <IconCat size={24} />;
        return <IconPaw size={24} />;
    };

    const getSpeciesColor = (species: string) => {
        if (species === 'dog') return 'blue';
        if (species === 'cat') return 'orange';
        return 'gray';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'lost':
                return <Badge color="red" variant="filled">🚨 PERDIDO</Badge>;
            case 'deceased':
                return <Badge color="gray" variant="light">🕊️ FALLECIDO</Badge>;
            case 'archived':
                return <Badge color="gray" variant="outline">ARCHIVADO</Badge>;
            default:
                return null;
        }
    };

    return (
        <Container size="lg">
            <Group justify="space-between" mb="xs">
                <Title order={2}>{t('title')}</Title>
                <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan">
                    {t('addPet')}
                </Button>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
                <Tabs.List>
                    <Tabs.Tab value="active">Mis Mascotas</Tabs.Tab>
                    <Tabs.Tab value="history">Historial</Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {pets && pets.length === 0 ? (
                <Text c="dimmed" fs="italic" ta="center" py="xl">
                    {activeTab === 'active' ? t('noPets') : 'No tienes mascotas en el historial.'}
                </Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {pets?.map((pet: any) => (
                        <Card
                            key={pet._id}
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                                borderColor: pet.status === 'lost' ? 'red' : undefined,
                                borderWidth: pet.status === 'lost' ? 2 : 1,
                                opacity: pet.status === 'deceased' || pet.status === 'archived' ? 0.7 : 1
                            }}
                        >
                            <Group wrap="nowrap" mb="md" align="flex-start">
                                <Avatar size={60} radius="xl" color="cyan" src={pet.photoUrl || null} alt={pet.name}>
                                    {pet.name.charAt(0)}
                                </Avatar>

                                <div style={{ flex: 1 }}>
                                    <Title order={3} fw={700} style={{ lineHeight: 1.2 }}>{pet.name}</Title>
                                    {(pet.birthDate) && (
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {dayjs().diff(pet.birthDate, 'year')} años
                                        </Text>
                                    )}
                                    <div style={{ marginTop: 4 }}>
                                        {getStatusBadge(pet.status)}
                                    </div>
                                </div>

                                <Paper
                                    bg={`${getSpeciesColor(pet.species)}.1`}
                                    c={`${getSpeciesColor(pet.species)}.8`}
                                    p={6}
                                    radius="md"
                                >
                                    <Stack gap={0} align="center" style={{ minWidth: 50 }}>
                                        {getSpeciesIcon(pet.species)}
                                        <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>
                                            {/* Strip emoji for cleaner look or just show text */}
                                            {tCommon(`species.${pet.species}`).split(' ')[0]}
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Group>

                            <Stack gap="xs" mb="md">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('breed')}</Text>
                                    <Text size="sm" fw={500}>{pet.breed}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('weight')}</Text>
                                    <Text size="sm" fw={500}>{pet.weight} kg</Text>
                                </Group>
                            </Stack>

                            <Button component={Link} href={`/dashboard/pets/${pet._id}`} fullWidth variant="light" color="cyan" radius="md">
                                {t('viewHealthRecord')}
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
