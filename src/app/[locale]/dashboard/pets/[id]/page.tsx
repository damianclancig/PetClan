'use client';

import { Grid, Paper, Title, Text, Group, Badge, ActionIcon, Stack, Button } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { PetProfileSkeleton } from '@/components/ui/Skeletons';
import { useDisclosure } from '@mantine/hooks';
import { ActionIconMotion } from '@/components/ui/MotionWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { HealthTimeline } from '@/components/health/HealthTimeline';
import { PetProfileHeader } from '@/components/pets/profile/PetProfileHeader';
import { SharePetModal } from '@/components/pets/SharePetModal';
import { PetExtraInfoCard } from '@/components/pets/profile/PetExtraInfoCard';
import { useTranslations } from 'next-intl';
import { IconPlus } from '@tabler/icons-react';
import { use, useState, useMemo } from 'react';
import { WeightControl } from '@/components/pets/WeightControl';
import { WeightEntryModal } from '@/components/pets/WeightEntryModal';
import { SmartHealthRecordModal } from '@/components/health/SmartHealthRecordModal';
import { VaccinationCalendar } from '@/components/pets/VaccinationCalendar';
import { getPetHealthSummary } from '@/utils/vaccinationUtils';
import { IHealthRecord } from '@/models/HealthRecord';
import DewormingCard from '@/components/health/DewormingCard';
import { PetPhotoGallery } from '@/components/pets/PetPhotoGallery';

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { pet, isLoading, isError } = usePet(id);
    const { records, createRecord, isCreating } = useHealthRecords(id);
    const [opened, { open, close }] = useDisclosure(false);
    const [weightModalOpened, { open: openWeightModal, close: closeWeightModal }] = useDisclosure(false);
    const [quickAddModalOpened, { open: openQuickAddModal, close: closeQuickAddModal }] = useDisclosure(false);
    const [activeTab, setActiveTab] = useState<string | null>('summary');

    // Filter weight records
    const weightRecords = records?.filter((r: any) => r.type === 'weight') || [];

    const t = useTranslations('PetDetail');
    const tPets = useTranslations('Pets');

    // Calculate status from client side records using unified logic
    const healthRecords = records as IHealthRecord[] || [];

    const { overdueCount, dueNowCount, upcomingCount, isUpToDate, hasRabies } = useMemo(() => {
        if (!pet) return { overdueCount: 0, dueNowCount: 0, upcomingCount: 0, isUpToDate: false, hasRabies: false };
        return getPetHealthSummary(pet, healthRecords);
    }, [pet, healthRecords]);

    if (isLoading) return <PageContainer><PetProfileSkeleton /></PageContainer>;
    if (isError || !pet) return <PageContainer><Text>{t('notFound')}</Text></PageContainer>;




    // --- Deceased View (In Memoriam) ---
    if (pet.status === 'deceased') {
        return (
            <PageContainer>
                <PetProfileHeader
                    pet={pet}
                    activeTab="timeline"
                    onTabChange={() => { }}
                    onShare={() => { }}
                    onAddRecord={undefined}
                />

                <Stack gap="xl">
                    <Paper withBorder p="md" radius="md">
                        <Title order={4} mb="md">{t('Deceased.memories')}</Title>
                        <HealthTimeline
                            petId={pet._id as unknown as string}
                            petSpecies={pet.species}
                            petBirthDate={pet.birthDate}
                            petDeathDate={pet.deathDate}
                            readOnly={true}
                        />
                    </Paper>

                    <PetExtraInfoCard pet={pet as any} />
                </Stack>
            </PageContainer>
        );
    }
    return (
        <PageContainer>
            <PetProfileHeader
                pet={pet}
                activeTab={activeTab || 'summary'}
                onTabChange={setActiveTab}
                onShare={open}
                onAddRecord={openQuickAddModal}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ marginTop: '20px' }}
                >
                    {activeTab === 'summary' && (
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack>
                                    <Paper withBorder p="md" radius="md">
                                        <Title order={4} mb="md">{t('Summary.healthStatus')}</Title>
                                        <Stack gap="xs">
                                            {overdueCount > 0 && (
                                                <Badge
                                                    color="red"
                                                    size="lg"
                                                    variant="filled"
                                                    fullWidth
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setActiveTab('health')}
                                                >
                                                    {t('badges.overdue', { count: overdueCount })}
                                                </Badge>
                                            )}
                                            {dueNowCount > 0 && (
                                                <Badge
                                                    color="green"
                                                    size="lg"
                                                    variant="filled"
                                                    fullWidth
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setActiveTab('health')}
                                                >
                                                    {t('badges.dueNow', { count: dueNowCount })}
                                                </Badge>
                                            )}
                                            {upcomingCount > 0 && (
                                                <Badge
                                                    color="yellow"
                                                    size="lg"
                                                    variant="light"
                                                    fullWidth
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setActiveTab('health')}
                                                >
                                                    {t('badges.upcoming', { count: upcomingCount })}
                                                </Badge>
                                            )}
                                            {isUpToDate && (
                                                <Badge
                                                    color="blue"
                                                    size="lg"
                                                    variant="light"
                                                    fullWidth
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setActiveTab('health')}
                                                >
                                                    {t('badges.upToDate')}
                                                </Badge>
                                            )}
                                            {hasRabies && (
                                                <Badge
                                                    color="blue"
                                                    size="lg"
                                                    variant="light"
                                                    fullWidth
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setActiveTab('health')}
                                                >
                                                    {t('badges.rabies')}
                                                </Badge>
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
                                            <Title order={4}>{t('Summary.weightTitle')}</Title>
                                            <ActionIconMotion onClick={openWeightModal}>
                                                <ActionIcon variant="subtle" color="blue">
                                                    <IconPlus size={16} />
                                                </ActionIcon>
                                            </ActionIconMotion>
                                        </Group>
                                        <Text size="xl" fw={700} ta="center" mb="xs">{pet.weight} kg</Text>
                                        <Button
                                            variant="light"
                                            size="xs"
                                            fullWidth
                                            onClick={() => setActiveTab('health')}
                                        >
                                            {t('Summary.viewChart')}
                                        </Button>
                                    </Paper>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Stack>
                                    <PetExtraInfoCard pet={pet as any} />
                                    <Paper withBorder p="md" radius="md">
                                        <Title order={4} mb="md">{t('Summary.latestEvents')}</Title>
                                        <HealthTimeline
                                            petId={pet._id as unknown as string}
                                            petSpecies={pet.species}
                                            petBirthDate={pet.birthDate}
                                            limit={10}
                                            onViewAll={() => setActiveTab('timeline')}
                                            onAddRecord={openQuickAddModal}
                                        />
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    )}

                    {activeTab === 'timeline' && (
                        <Paper withBorder p="md" radius="md">
                            <HealthTimeline
                                petId={pet._id as unknown as string}
                                petSpecies={pet.species}
                                petBirthDate={pet.birthDate}
                                onAddRecord={openQuickAddModal}
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

                    {activeTab === 'gallery' && (
                        <PetPhotoGallery photos={pet.photos || []} />
                    )}
                </motion.div>
            </AnimatePresence>


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
                onSwitchToWeight={() => {
                    closeQuickAddModal();
                    openWeightModal();
                }}
            />
        </PageContainer >
    );
}
