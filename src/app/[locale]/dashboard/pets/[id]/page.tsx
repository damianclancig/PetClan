'use client';

import { Container, Grid, Paper, Title, Text, Group, Badge, Avatar, Loader, Button, ActionIcon, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionIconMotion } from '@/components/ui/MotionWrappers';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { HealthTimeline } from '@/components/health/HealthTimeline';
import { PetProfileHeader } from '@/components/pets/profile/PetProfileHeader';
import { SharePetModal } from '@/components/pets/SharePetModal';
import { formatDate, calculateAge } from '@/lib/dateUtils';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { IconPencil, IconShare, IconPlus } from '@tabler/icons-react';
import React from 'react';
import { getVaccinationStatus } from '@/utils/vaccinationLogic';
import { WeightControl } from '@/components/pets/WeightControl';
import { WeightEntryModal } from '@/components/pets/WeightEntryModal';
import { VaccinationPlan } from '@/components/pets/VaccinationPlan';

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError } = usePet(id);
    const { records } = useHealthRecords(id);
    const [opened, { open, close }] = useDisclosure(false);
    const [weightModalOpened, { open: openWeightModal, close: closeWeightModal }] = useDisclosure(false);
    const [activeTab, setActiveTab] = React.useState<string | null>('summary');

    // Filter weight records
    const weightRecords = records?.filter((r: any) => r.type === 'weight') || [];

    const t = useTranslations('PetDetail');
    const tCommon = useTranslations('Common');
    const tPets = useTranslations('Pets');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>{t('notFound')}</Text></Container>;

    // Calculate status from client side records using unified logic
    const schedule = getVaccinationStatus(pet as any, records || [] as any[]);
    const overdueCount = schedule.filter(s => s.status === 'overdue').length;
    const isUpToDate = overdueCount === 0;

    // Rabies logic: "Vigente" implies we have a record and it is not overdue (or we just took it)
    // Simply: Is the Rabies requirement overdue? If so, false. 
    // If not overdue, do we have a record of it?
    const rabiesRecordExists = records?.some((r: any) => r.vaccineType === 'antirrabica' || r.title.toLowerCase().includes('antirrábica') || r.title.toLowerCase().includes('antirrabica'));
    const rabiesItem = schedule.find(s => s.vaccineId === 'antirrabica');
    const hasRabies = rabiesRecordExists && rabiesItem?.status !== 'overdue';

    return (
        <Container size="lg" px={{ base: 5, xs: 'md' }}>
            <PetProfileHeader
                pet={pet}
                activeTab={activeTab || 'summary'}
                onTabChange={setActiveTab}
                onShare={open}
            />

            {activeTab === 'summary' && (
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack>
                            <Paper withBorder p="md" radius="md">
                                <Title order={4} mb="md">Estado de Salud</Title>
                                <Stack gap="xs">
                                    {isUpToDate ? (
                                        <Badge color="green" size="lg" variant="light" fullWidth>✅ Vacunas al día</Badge>
                                    ) : (
                                        <Badge color="orange" size="lg" variant="light" fullWidth>⚠️ Vacunas vencidas ({overdueCount})</Badge>
                                    )}
                                    {hasRabies && (
                                        <Badge color="blue" size="lg" variant="light" fullWidth>💉 Antirábica Vigente</Badge>
                                    )}
                                </Stack>
                            </Paper>

                            <Paper withBorder p="md" radius="md">
                                <Group justify="space-between" mb="xs">
                                    <Title order={4}>{tPets('weight')}</Title>
                                    <ActionIconMotion onClick={openWeightModal}>
                                        <ActionIcon variant="subtle" color="blue">
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </ActionIconMotion>
                                </Group>
                                <Text size="xl" fw={700} ta="center">{pet.weight} kg</Text>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Paper withBorder p="md" radius="md">
                            <Title order={4} mb="md">Últimos Eventos</Title>
                            {/* We could show a condensed timeline here or just reusable HealthTimeline */}
                            <HealthTimeline petId={pet._id as unknown as string} />
                        </Paper>
                    </Grid.Col>
                </Grid>
            )}

            {activeTab === 'timeline' && (
                <Paper withBorder p="md" radius="md">
                    <HealthTimeline petId={pet._id as unknown as string} />
                </Paper>
            )}

            {activeTab === 'health' && (
                <Grid>
                    <Grid.Col span={12}>
                        <WeightControl
                            petId={pet._id as unknown as string}
                            currentWeight={pet.weight}
                            history={weightRecords}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <VaccinationPlan pet={pet as any} records={records || []} />
                    </Grid.Col>
                </Grid>
            )}

            <SharePetModal
                opened={opened}
                onClose={close}
                petId={pet._id as unknown as string}
                petName={pet.name}
                owners={pet.owners as any[]}
            />
            <WeightEntryModal
                opened={weightModalOpened}
                onClose={closeWeightModal}
                petId={pet._id as unknown as string}
                currentWeight={pet.weight}
            />
        </Container >
    );
}
