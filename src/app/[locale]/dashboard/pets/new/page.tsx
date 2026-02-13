'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { notifications } from '@mantine/notifications';
import { PetWizard } from '@/components/pets/wizard/PetWizard';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewPetPage() {
    const t = useTranslations('NewPet');
    const router = useRouter();
    const queryClient = useQueryClient();

    const createPet = useMutation({
        mutationFn: async (values: any) => {
            const res = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error('Failed to create pet');
            return res.json();
        },
        onSuccess: () => {
            notifications.show({
                title: '¡Mascota Creada! 🎉',
                message: 'Tu mascota ha sido registrada exitosamente.',
                color: 'green',
            });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            // router.push('/dashboard/pets'); // Redirection handled by Wizard Success Step
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo crear la mascota.',
                color: 'red',
            });
        }
    });

    return (
        <PageContainer size="md" title={t('title')}>
            <PetWizard
                onSubmit={(values) => createPet.mutate(values)}
                isLoading={createPet.isPending}
            />
        </PageContainer>
    );
}
