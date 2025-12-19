'use client';

import { Container, Grid, Paper, Title, Text, Group, Badge, Avatar, Loader, Button, ActionIcon, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { HealthTimeline } from '@/components/health/HealthTimeline';
import { SharePetModal } from '@/components/pets/SharePetModal';
import dayjs from 'dayjs';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { IconPencil, IconShare } from '@tabler/icons-react';
import React from 'react';
import { calculateVaccineStatus } from '@/lib/healthUtils';

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError } = usePet(id);
    const { records } = useHealthRecords(id);
    const [opened, { open, close }] = useDisclosure(false);

    const t = useTranslations('PetDetail');
    const tCommon = useTranslations('Common');
    const tPets = useTranslations('Pets');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>{t('notFound')}</Text></Container>;

    // Calculate status from client side records
    const { isUpToDate, hasRabies, overdueCount } = calculateVaccineStatus(records || [] as any[]);

    return (
        <Container size="lg">
            <Group justify="space-between" mb="md">
                <Button component={Link} href="/dashboard/pets" variant="subtle" size="xs">
                    ← {tCommon('back')}
                </Button>
                <Group gap="xs">
                    <Button
                        variant="light"
                        color="grape"
                        leftSection={<IconShare size={18} />}
                        onClick={open}
                    >
                        {tCommon('share') || 'Compartir'}
                    </Button>
                    <Button
                        component={Link}
                        href={`/dashboard/pets/${id}/edit`}
                        variant="light"
                        color="cyan"
                        leftSection={<IconPencil size={18} />}
                    >
                        {tCommon('edit')}
                    </Button>
                </Group>
            </Group>

            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper withBorder p="xl" radius="md">
                        <Group justify="center" mb="md">
                            <Avatar size={120} radius={120} color="cyan" src={pet.photoUrl || null} alt={pet.name}>
                                {pet.name.charAt(0)}
                            </Avatar>
                        </Group>
                        <Title order={2} ta="center" mb="xs">{pet.name}</Title>
                        <Group justify="center" mb="md">
                            <Badge variant="light">{tCommon(`species.${pet.species}`)}</Badge>
                            <Badge variant="light" color="gray">{tCommon(`sex.${pet.sex}`)}</Badge>
                        </Group>

                        <Stack align="center" gap="xs" mb="lg">
                            {records && records.length > 0 && (
                                <>
                                    {isUpToDate ? (
                                        <Badge color="green" size="md" variant="light">✅ Vacunas al día</Badge>
                                    ) : (
                                        <Badge color="orange" size="md" variant="light">⚠️ Vacunas vencidas ({overdueCount})</Badge>
                                    )}
                                    {hasRabies && (
                                        <Badge color="blue" size="md" variant="light">💉 Antirábica Vigente</Badge>
                                    )}
                                </>
                            )}
                        </Stack>

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
                            <Text size="sm" fw={500}>
                                {dayjs(pet.birthDate).format('DD/MM/YYYY')} ({dayjs().diff(pet.birthDate, 'year')} años)
                            </Text>
                        </Group>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper withBorder p="md" radius="md">
                        <HealthTimeline petId={pet._id as unknown as string} />
                    </Paper>
                </Grid.Col>
            </Grid>


            <SharePetModal
                opened={opened}
                onClose={close}
                petId={pet._id as unknown as string}
                petName={pet.name}
                owners={pet.owners as any[]}
            />
        </Container >
    );
}
