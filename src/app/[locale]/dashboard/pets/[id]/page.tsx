'use client';

import { Container, Grid, Paper, Title, Text, Group, Badge, Loader, ActionIcon, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionIconMotion } from '@/components/ui/MotionWrappers';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { HealthTimeline } from '@/components/health/HealthTimeline';
import { PetProfileHeader } from '@/components/pets/profile/PetProfileHeader';
import { SharePetModal } from '@/components/pets/SharePetModal';
import { useTranslations } from 'next-intl';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import { WeightControl } from '@/components/pets/WeightControl';
import { WeightEntryModal } from '@/components/pets/WeightEntryModal';
import { SmartHealthRecordModal } from '@/components/health/SmartHealthRecordModal';
import { VaccinationCalendar } from '@/components/pets/VaccinationCalendar';
import { DOG_VACCINATION_SCHEDULE, getVaccineStatus, getVaccinationSchedule } from '@/utils/vaccinationUtils';
import { IHealthRecord } from '@/models/HealthRecord';
import DewormingCard from '@/components/health/DewormingCard';

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError } = usePet(id);
    const { records, createRecord, isCreating } = useHealthRecords(id);
    const [opened, { open, close }] = useDisclosure(false);
    const [weightModalOpened, { open: openWeightModal, close: closeWeightModal }] = useDisclosure(false);
    const [quickAddModalOpened, { open: openQuickAddModal, close: closeQuickAddModal }] = useDisclosure(false);
    const [activeTab, setActiveTab] = React.useState<string | null>('summary');

    // Filter weight records
    const weightRecords = records?.filter((r: any) => r.type === 'weight') || [];

    const t = useTranslations('PetDetail');
    const tPets = useTranslations('Pets');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>{t('notFound')}</Text></Container>;
    // Calculate status from client side records using unified logic
    const healthRecords = records as IHealthRecord[] || [];
    const schedule = pet ? getVaccinationSchedule(pet.species) : DOG_VACCINATION_SCHEDULE;

    const scheduleStatuses = schedule.map(slot => ({
        slot,
        ...getVaccineStatus(slot, pet.birthDate, healthRecords)
    }));

    // --- Unified filtering logic (duplicated from Calendar, ideally moved to utils later) ---
    const getSlotFamily = (id: string) => {
        if (id.includes('external') || id.includes('pulgas')) return 'external';
        if (id.includes('deworm')) return 'deworm';
        if (id.includes('poly') || id.includes('triple') || id.includes('sextuple')) return 'poly';
        if (id.includes('rabies')) return 'rabies';
        return 'other';
    };

    const visibleSlotIds = new Set<string>();
    const families = ['deworm', 'external', 'poly', 'rabies', 'other'];

    families.forEach(family => {
        const familySlots = scheduleStatuses.filter(s => getSlotFamily(s.slot.id) === family);
        let foundFirstPending = false;
        familySlots.forEach(s => {
            if (s.status === 'completed' || s.status === 'missed_replaced') {
                // Counts as history, but irrelevant for "Upcoming" badge logic
            } else {
                if (!foundFirstPending) {
                    visibleSlotIds.add(s.slot.id);
                    foundFirstPending = true;
                }
            }
        });
    });

    const visibleStatuses = scheduleStatuses.filter(s => visibleSlotIds.has(s.slot.id));

    const overdueCount = visibleStatuses.filter(s => s.status === 'overdue').length;
    const dueSoonCount = visibleStatuses.filter(s => s.status === 'due_soon' || s.status === 'current_due').length;
    const isUpToDate = overdueCount === 0;

    // Rabies logic
    const hasOverdueRabies = scheduleStatuses.some((s, idx) =>
        schedule[idx].vaccineType.includes('rabies') && s.status === 'overdue'
    );
    const hasCompletedRabies = scheduleStatuses.some((s, idx) =>
        schedule[idx].vaccineType.includes('rabies') && s.status === 'completed'
    );
    const hasRabies = !hasOverdueRabies && hasCompletedRabies;



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
                                    {overdueCount > 0 && (
                                        <Badge color="red" size="lg" variant="filled" fullWidth>⚠️ Atención: Vacunas vencidas ({overdueCount})</Badge>
                                    )}
                                    {dueSoonCount > 0 && (
                                        <Badge color="yellow" size="lg" variant="light" fullWidth>⏳ Próximas vacunas ({dueSoonCount})</Badge>
                                    )}
                                    {isUpToDate && overdueCount === 0 && (
                                        <Badge color="green" size="lg" variant="light" fullWidth>✅ Vacunas al día</Badge>
                                    )}
                                    {hasRabies && (
                                        <Badge color="blue" size="lg" variant="light" fullWidth>💉 Antirábica Vigente</Badge>
                                    )}
                                </Stack>
                            </Paper>

                            <DewormingCard
                                pet={pet}
                                records={healthRecords}
                                onUpdateWeight={openWeightModal}
                            />

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
                            <HealthTimeline
                                petId={pet._id as unknown as string}
                                petSpecies={pet.species}
                                petBirthDate={pet.birthDate}
                                limit={10}
                                onViewAll={() => setActiveTab('timeline')}
                            />
                        </Paper>
                    </Grid.Col>
                </Grid>
            )}

            {activeTab === 'timeline' && (
                <Paper withBorder p="md" radius="md">
                    <HealthTimeline
                        petId={pet._id as unknown as string}
                        petSpecies={pet.species}
                        petBirthDate={pet.birthDate}
                    />
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
                        <VaccinationCalendar
                            petId={pet._id as unknown as string}
                            birthDate={pet.birthDate}
                            species={pet.species}
                            onAddRecord={openQuickAddModal}
                        />
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
            <SmartHealthRecordModal
                opened={quickAddModalOpened}
                onClose={closeQuickAddModal}
                petId={pet._id as unknown as string}
                petSpecies={pet.species}
                petBirthDate={pet.birthDate}
                existingRecords={records as IHealthRecord[] || []}
                createRecord={createRecord}
                isCreating={isCreating}
            />
        </Container >
    );
}
