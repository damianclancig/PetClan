'use client';

import { Title, Container, Paper, Loader, Text, Select, Stack, Alert, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePet } from '@/hooks/usePets';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PetForm, PetFormValues } from '@/components/pets/PetForm';
import React, { useState, useEffect } from 'react';
import { formatDateForInput } from '@/lib/dateUtils';
import { IconAlertTriangle, IconArchive, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { IHealthRecord } from '@/models/HealthRecord';

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError, updatePet, deletePet, isUpdating, isDeleting } = usePet(id);
    const { records } = useHealthRecords(id); // Fetch records for validation
    const router = useRouter();
    const t = useTranslations('NewPet');
    const tCommon = useTranslations('Common');
    const tNotifications = useTranslations('Notifications');
    const tPetEdit = useTranslations('PetEdit');

    // Calculate last record date for validation
    const lastRecordDate = React.useMemo(() => {
        if (!records || records.length === 0) return undefined;
        // Find the most recent date from all records
        const sorted = [...(records as IHealthRecord[])].sort((a, b) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        return sorted[0]?.appliedAt ? new Date(sorted[0].appliedAt) : undefined;
    }, [records]);

    // Delete/Archive modal
    const [deleteOpened, { open: openDeleteData, close: closeDeleteData }] = useDisclosure(false);

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>Error loading pet</Text></Container>;

    const initialValues: Partial<PetFormValues> = React.useMemo(() => ({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: formatDateForInput(pet.birthDate),
        sex: pet.sex,
        weight: pet.weight,
        chipId: pet.chipId,
        photoUrl: pet.photoUrl,
        characteristics: pet.characteristics,
        diseases: pet.diseases,
        treatments: pet.treatments,
        notes: pet.notes,
        status: pet.status,
        deathDate: pet.deathDate ? formatDateForInput(pet.deathDate) : undefined,
    }), [pet]);

    const onSubmit = async (data: PetFormValues) => {
        try {
            // Status and DeathDate are now part of 'data'
            await updatePet({ id, data: { ...data } });

            // Detect weight change and record history
            if (pet.weight !== data.weight) {
                await fetch('/api/records', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        petId: id,
                        type: 'weight',
                        title: 'Control de Peso',
                        description: 'Actualización dada al editar perfil',
                        appliedAt: new Date(),
                        weightValue: Number(data.weight),
                    }),
                });
            }

            notifications.show({
                title: tNotifications('success'),
                message: tNotifications('petUpdated'),
                color: 'green',
            });
            router.push(`/dashboard/pets/${id}`);
        } catch (error) {
            console.error(error);
            notifications.show({
                title: tNotifications('error'),
                message: tNotifications('petUpdateFailed'),
                color: 'red',
            });
        }
    };

    const handleArchiveOrDelete = async () => {
        try {
            const result = await deletePet(); // createPet hook delete function

            if (result.isArchived) {
                notifications.show({
                    title: tNotifications('success'),
                    message: tNotifications('petArchived'),
                    color: 'blue',
                    icon: <IconArchive size={16} />,
                });
            } else {
                notifications.show({
                    title: tNotifications('success'),
                    message: tNotifications('petDeleted'),
                    color: 'red',
                    icon: <IconTrash size={16} />,
                });
            }
            router.push('/dashboard/pets');
        } catch (error) {
            console.error(error);
            notifications.show({
                title: tNotifications('error'),
                message: tNotifications('petArchiveOrDeleteFailed'),
                color: 'red',
            });
        }
    };

    const isArchived = pet.status === 'archived';

    return (
        <Container size="sm" px={{ base: 5, xs: 'md' }}>
            <Title order={2} mb="xl">{tCommon('edit')} {pet.name}</Title>

            <Paper withBorder shadow="md" p={{ base: 10, xs: 30 }} radius="md" mb="xl">
                <PetForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isLoading={isUpdating}
                    submitLabel={tCommon('save')}
                    lastRecordDate={lastRecordDate}
                    isEditMode={true}
                    petId={id}
                />
            </Paper>

            <Paper p="md" withBorder style={{ borderColor: 'red', backgroundColor: 'var(--mantine-color-red-light)' }}>
                <Title order={5} c="red" mb="sm">{tPetEdit('dangerZoneTitle')}</Title>
                <Text size="sm" mb="md">
                    {isArchived
                        ? tPetEdit('dangerZoneArchivedContent')
                        : tPetEdit('dangerZoneActiveContent')}
                </Text>
                <Button
                    color="red"
                    variant="outline"
                    onClick={openDeleteData}
                    leftSection={isArchived ? <IconTrash size={16} /> : <IconArchive size={16} />}
                >
                    {isArchived ? tPetEdit('permanentlyDelete') : tPetEdit('archivePet')}
                </Button>
            </Paper>

            <Modal opened={deleteOpened} onClose={closeDeleteData} title={isArchived ? tPetEdit('confirmDeleteTitle') : tPetEdit('confirmArchiveTitle')}>
                <Text size="sm">
                    {isArchived ? tPetEdit('confirmDeleteMessage') : tPetEdit('confirmArchiveMessage')} <strong>{pet.name}</strong>?
                </Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeDeleteData}>{tCommon('cancel')}</Button>
                    <Button color="red" onClick={handleArchiveOrDelete} loading={isDeleting}>
                        {isArchived ? tPetEdit('buttonYesDelete') : tPetEdit('buttonYesArchive')}
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
