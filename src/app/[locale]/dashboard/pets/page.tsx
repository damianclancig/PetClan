'use client';

import { Title, Text, Button, Group, Container, SimpleGrid, Card, Badge, Loader, Avatar, Stack, ThemeIcon, Paper } from '@mantine/core';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { IconDog, IconCat, IconPaw } from '@tabler/icons-react';

export default function PetsPage() {
    const { pets, isLoading, isError } = usePets();
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

    return (
        <Container size="lg">
            <Group justify="space-between" mb="xl">
                <Title order={2}>{t('title')}</Title>
                <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan">
                    {t('addPet')}
                </Button>
            </Group>

            {pets && pets.length === 0 ? (
                <Text c="dimmed" fs="italic">{t('noPets')}</Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {pets?.map((pet: any) => (
                        <Card key={pet._id} shadow="sm" padding="lg" radius="md" withBorder>
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
