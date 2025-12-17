'use client';

import { Title, Container, Paper } from '@mantine/core';
import { usePets } from '@/hooks/usePets';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PetForm, PetFormValues } from '@/components/pets/PetForm';

export default function NewPetPage() {
    const { createPet, isCreating } = usePets();
    const router = useRouter();
    const t = useTranslations('NewPet');

    const onSubmit = async (data: PetFormValues) => {
        try {
            await createPet(data);
            router.push('/dashboard/pets');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container size="sm">
            <Title order={2} mb="xl">{t('title')}</Title>
            <Paper withBorder shadow="md" p={30} radius="md">
                <PetForm onSubmit={onSubmit} isLoading={isCreating} />
            </Paper>
        </Container>
    );
}
