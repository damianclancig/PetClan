'use client';

import { Container, Grid, Paper, Title, Text, Group, Badge, Avatar, Loader, Button } from '@mantine/core';
import { usePet } from '@/hooks/usePets';
import { HealthTimeline } from '@/components/health/HealthTimeline';
import dayjs from 'dayjs';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
// import { IconArrowLeft, IconWeight, IconCalendar } from '@tabler/icons-react';

import React from 'react';

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError } = usePet(id);
    const t = useTranslations('PetDetail');
    const tCommon = useTranslations('Common');
    const tPets = useTranslations('Pets');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>{t('notFound')}</Text></Container>;

    return (
        <Container size="lg">
            <Button component={Link} href="/dashboard/pets" variant="subtle" size="xs" mb="md">
                ← {tCommon('back')}
            </Button>

            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper withBorder p="xl" radius="md">
                        <Group justify="center" mb="md">
                            <Avatar size={120} radius={120} color="cyan">
                                {pet.name.charAt(0)}
                            </Avatar>
                        </Group>
                        <Title order={2} ta="center" mb="xs">{pet.name}</Title>
                        <Group justify="center" mb="md">
                            <Badge variant="light">{tCommon(`species.${pet.species}`)}</Badge>
                            <Badge variant="light" color="gray">{tCommon(`sex.${pet.sex}`)}</Badge>
                        </Group>

                        <Group justify="space-between" mt="md">
                            <Text size="sm" c="dimmed">{tPets('breed')}</Text>
                            <Text size="sm" fw={500}>{pet.breed}</Text>
                        </Group>
                        <Group justify="space-between" mt="xs">
                            <Text size="sm" c="dimmed">{tPets('weight')}</Text>
                            <Text size="sm" fw={500}>{pet.weight} kg</Text>
                        </Group>
                        <Group justify="space-between" mt="xs">
                            <Text size="sm" c="dimmed">{t('birthDate')}</Text>
                            <Text size="sm" fw={500}>{dayjs(pet.birthDate).format('DD/MM/YYYY')}</Text>
                        </Group>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper withBorder p="md" radius="md">
                        <HealthTimeline petId={pet._id as unknown as string} />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
