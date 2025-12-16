'use client';

import { Title, Text, Button, Group, Container, SimpleGrid, Card, Badge, Loader } from '@mantine/core';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

export default function PetsPage() {
    const { pets, isLoading, isError } = usePets();
    const t = useTranslations('Pets');
    const tCommon = useTranslations('Common');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError) return <Container><Text c="red">Error al cargar las mascotas.</Text></Container>;

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
                            <Group justify="space-between" mt="md" mb="xs">
                                <Text fw={500}>{pet.name}</Text>
                                <Badge color={pet.species === 'dog' ? 'blue' : pet.species === 'cat' ? 'orange' : 'gray'}>
                                    {tCommon(`species.${pet.species}`)}
                                </Badge>
                            </Group>

                            <Text size="sm" c="dimmed">
                                {t('breed')}: {pet.breed}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {t('weight')}: {pet.weight} kg
                            </Text>

                            <Button component={Link} href={`/dashboard/pets/${pet._id}`} fullWidth mt="md" radius="md">
                                {t('viewHealthRecord')}
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
