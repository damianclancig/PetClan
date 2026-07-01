/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { notifications } from '@mantine/notifications';
import { PetWizard } from '@/components/pets/wizard/PetWizard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

export default function NewPetPage() {
    const t = useTranslations('NewPet');
    const tNotifications = useTranslations('Notifications');
    const router = useRouter();
    const queryClient = useQueryClient();

    const createPet = useMutation({
        mutationFn: async (values: any) => {
            const res = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    clientDate: dayjs().format('YYYY-MM-DD'),
                }),
            });
            if (!res.ok) throw new Error('Failed to create pet');
            return res.json();
        },
        onSuccess: () => {
            notifications.show({
                title: '🎉',
                message: tNotifications('petCreated'),
                color: 'green',
            });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            // router.push('/dashboard/pets'); // Redirection handled by Wizard Success Step
        },
        onError: () => {
            notifications.show({
                title: tNotifications('error'),
                message: tNotifications('petCreationFailed'),
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
