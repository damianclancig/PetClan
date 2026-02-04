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

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError, updatePet, deletePet, isUpdating, isDeleting } = usePet(id);
    const router = useRouter();
    const t = useTranslations('NewPet');
    const tCommon = useTranslations('Common');

    // Status state
    const [status, setStatus] = useState<string>('active');

    // Delete/Archive modal
    const [deleteOpened, { open: openDeleteData, close: closeDeleteData }] = useDisclosure(false);

    useEffect(() => {
        if (pet) {
            setStatus(pet.status || 'active');
        }
    }, [pet]);

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
    }), [pet]);

    const onSubmit = async (data: PetFormValues) => {
        try {
            await updatePet({ id, data: { ...data, status } });
            notifications.show({
                title: 'Mascota actualizada',
                message: 'Los datos se han guardado correctamente',
                color: 'green',
            });
            router.push(`/dashboard/pets/${id}`);
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar la mascota',
                color: 'red',
            });
        }
    };

    const handleArchiveOrDelete = async () => {
        try {
            const result = await deletePet(); // createPet hook delete function

            if (result.isArchived) {
                notifications.show({
                    title: 'Mascota Archivada',
                    message: 'La mascota se ha movido al historial.',
                    color: 'blue',
                    icon: <IconArchive size={16} />,
                });
            } else {
                notifications.show({
                    title: 'Mascota Eliminada',
                    message: 'La mascota ha sido eliminada permanentemente.',
                    color: 'red',
                    icon: <IconTrash size={16} />,
                });
            }
            router.push('/dashboard/pets');
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar/archivar la mascota',
                color: 'red',
            });
        }
    };

    const isArchived = pet.status === 'archived';

    return (
        <Container size="sm" px={{ base: 5, xs: 'md' }}>
            <Title order={2} mb="xl">{tCommon('edit')} {pet.name}</Title>

            <Paper withBorder shadow="md" p={{ base: 10, xs: 30 }} radius="md" mb="xl">
                <Stack mb="lg">
                    <Title order={4}>Estado de la Mascota</Title>
                    <Select
                        label="Estado actual"
                        data={[
                            { value: 'active', label: 'Activo (En Casa)' },
                            { value: 'lost', label: '🚔 Perdido (Alerta)' },
                            { value: 'deceased', label: '🕊️ Fallecido' },
                            { value: 'archived', label: 'Archivado' }
                        ]}
                        value={status}
                        onChange={(val) => setStatus(val || 'active')}
                    />

                    {status === 'lost' && (
                        <Alert variant="light" color="red" title="Alerta de Mascota Perdida" icon={<IconAlertTriangle />}>
                            Al marcar como perdido, la mascota se destacará en rojo en tu panel para facilitar su identificación.
                        </Alert>
                    )}

                    {status === 'deceased' && (
                        <Alert variant="light" color="gray" title="En Memoria">
                            La mascota se moverá al historial, conservando sus registros médicos como recuerdo.
                        </Alert>
                    )}
                </Stack>

                <PetForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isLoading={isUpdating}
                    submitLabel={tCommon('save')}
                />
            </Paper>

            <Paper p="md" withBorder style={{ borderColor: 'red', backgroundColor: 'var(--mantine-color-red-light)' }}>
                <Title order={5} c="red" mb="sm">Zona de Peligro</Title>
                <Text size="sm" mb="md">
                    {isArchived
                        ? "Esta acción eliminará permanentemente todos los datos de la mascota, incluyendo historial médico. No se puede deshacer."
                        : "Archivar la mascota la ocultará de tu lista principal, pero conservará sus datos en el historial."}
                </Text>
                <Button
                    color="red"
                    variant="outline"
                    onClick={openDeleteData}
                    leftSection={isArchived ? <IconTrash size={16} /> : <IconArchive size={16} />}
                >
                    {isArchived ? 'Eliminar Permanentemente' : 'Archivar Mascota'}
                </Button>
            </Paper>

            <Modal opened={deleteOpened} onClose={closeDeleteData} title={isArchived ? "Confirmar Eliminación" : "Confirmar Archivo"}>
                <Text size="sm">
                    ¿Estás seguro que deseas {isArchived ? 'eliminar permanentemente' : 'archivar'} a <strong>{pet.name}</strong>?
                </Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeDeleteData}>Cancelar</Button>
                    <Button color="red" onClick={handleArchiveOrDelete} loading={isDeleting}>
                        {isArchived ? 'Sí, eliminar' : 'Sí, archivar'}
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
