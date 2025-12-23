'use client';

import { Title, Container, Paper } from '@mantine/core';
import { usePets } from '@/hooks/usePets';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { PetForm, PetFormValues } from '@/components/pets/PetForm';

export default function NewPetPage() {
    const { createPet, isCreating } = usePets();
    const router = useRouter();
    const t = useTranslations('NewPet');

    const onSubmit = async (data: PetFormValues) => {
        try {
            await createPet(data);
            notifications.show({
                title: 'Mascota creada',
                message: `Se ha creado el perfil de ${data.name} correctamente`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });
            router.push('/dashboard/pets');
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo crear la mascota',
                color: 'red',
            });
        }
    };

    return (
        <Container size="sm" px={{ base: 5, xs: 'md' }}>
            <Title order={2} mb="xl">{t('title')}</Title>
            <Paper withBorder shadow="md" p={{ base: 10, xs: 30 }} radius="md">
                <PetForm onSubmit={onSubmit} isLoading={isCreating} />
            </Paper>
        </Container>
    );
}
