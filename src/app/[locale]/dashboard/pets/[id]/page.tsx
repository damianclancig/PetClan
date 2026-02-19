'use client';

import { Grid, Paper, Title, Text, Group, Badge, ActionIcon, Stack, Button } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { PetProfileSkeleton } from '@/components/ui/Skeletons';
import { useDisclosure } from '@mantine/hooks';
import { ActionIconMotion } from '@/components/ui/MotionWrappers';
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
                        <Title order={4} mb="md">Recuerdos y Eventos</Title>
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

            {/* ... other tabs ... */}

            {/* Note: I'm skipping the middle content for brevity in replacement, focusing on the end where Wizard was */}
            {/* Wait, replace_file_content needs contiguous block. I should target the end block specifically. */}
            {/* But I added onAddRecord={openWizard} in step 1199. I need to change it to openQuickAddModal. */}

            {/* And I need to remove HealthEventWizard rendering at the end. */}
            {/* I will do Header first. */}
            {/* ... (keep existing grid content if not changing it, but since I can't skip ranges easily in one replace block if context is far, I assume user might want me to replace just the header and then the modal block separately. The header is near top of return) */}
            {/* But wait, I need to insert Wizard near the other modals at the end. */}

            {/* ... */}

            {/* I will use MULTIPLE replace calls or separate steps. This step handles just the Header for now. */}

            {activeTab === 'summary' && (
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack>
                            <Paper withBorder p="md" radius="md">
                                <Title order={4} mb="md">Estado de Salud</Title>
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
                                            ⚠️ Atención: Vacunas vencidas ({overdueCount})
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
                                            ✅ Es el momento ideal ({dueNowCount})
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
                                            ⏳ Próximas vacunas ({upcomingCount})
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
                                            ✨ Vacunas al día
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
                                            💉 Antirábica Vigente
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
                                    <Title order={4}>{tPets('weight')}</Title>
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
                                    Ver gráfico e historial
                                </Button>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack>
                            <PetExtraInfoCard pet={pet as any} />
                            <Paper withBorder p="md" radius="md">
                                <Title order={4} mb="md">Últimos Eventos</Title>
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
        </PageContainer>
    );
}
