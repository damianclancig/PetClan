'use client';

import { Title, Container, Paper, Loader, Text } from '@mantine/core';
import { usePet } from '@/hooks/usePets';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PetForm, PetFormValues } from '@/components/pets/PetForm';
import React from 'react';
import dayjs from 'dayjs';

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { pet, isLoading, isError, updatePet, isUpdating } = usePet(id);
    const router = useRouter();
    const t = useTranslations('NewPet'); // Reusing NewPet translations for "Edit" context where applicable
    const tCommon = useTranslations('Common');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError || !pet) return <Container><Text>Error loading pet</Text></Container>;

    const initialValues: Partial<PetFormValues> = {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: dayjs(pet.birthDate).format('YYYY-MM-DD'),
        sex: pet.sex,
        weight: pet.weight,
        chipId: pet.chipId,
    };

    const onSubmit = async (data: PetFormValues) => {
        try {
            await updatePet({ id, data });
            router.push(`/dashboard/pets/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container size="sm">
            <Title order={2} mb="xl">{tCommon('edit')} {pet.name}</Title>
            <Paper withBorder shadow="md" p={30} radius="md">
                <PetForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isLoading={isUpdating}
                    submitLabel={tCommon('save')}
                />
            </Paper>
        </Container>
    );
}
