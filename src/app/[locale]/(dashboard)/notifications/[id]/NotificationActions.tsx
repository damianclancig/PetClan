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

import { Button, Flex } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { IconTrash, IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationActionsProps {
    notificationId: string;
    actionType?: 'invitation' | 'remove_request' | null;
    actionToken?: string | null;
}

export default function NotificationActions({ notificationId, actionType, actionToken }: NotificationActionsProps) {
    const t = useTranslations('NotificationDetails');
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/notifications/${notificationId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    // Toast success first
                    notifications.show({
                        title: t('deleted_success'),
                        message: '',
                        color: 'green',
                    });

                    // Invalidate queries - we want this to be part of the transition
                    await queryClient.invalidateQueries({ queryKey: ['notifications'] });

                    // Navigate
                    router.push('/dashboard');
                } else {
                    throw new Error('Failed to delete notification');
                }
            } catch (error) {
                console.error('Error deleting notification', error);
                notifications.show({
                    title: t('deleted_error'),
                    message: '',
                    color: 'red',
                });
            }
        });
    };

    const handleAction = (action: 'accept' | 'reject') => {
        if (!actionToken || !actionType) return;

        startTransition(async () => {
            try {
                const endpoint = actionType === 'invitation'
                    ? `/api/invitations/${actionToken}/actions`
                    : `/api/requests/${actionToken}/action`;

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action }),
                });

                if (res.ok) {
                    // Invalidate queries to refresh data
                    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    await queryClient.invalidateQueries({ queryKey: ['pets'] });

                    // Redirect to dashboard
                    router.push('/dashboard');
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to ${action} ${actionType}`);
                }
            } catch (error: any) {
                console.error(`Error processing ${action} for ${actionType}`, error);
                notifications.show({
                    title: 'Error',
                    message: error.message || t('error'),
                    color: 'red',
                });
            }
        });
    };

    return (
        <Flex 
            direction={{ base: 'column-reverse', sm: 'row' }} 
            gap="md" 
            mt="xl" 
            justify="center"
            align={{ base: 'stretch', sm: 'center' }}
            w="100%"
        >
            <Button
                variant="default"
                size="md"
                radius="xl"
                w={{ base: '100%', sm: 'auto' }}
                miw={{ sm: 160 }}
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => router.push('/dashboard')}
                disabled={isPending}
            >
                {t('back')}
            </Button>

            {actionType && actionToken ? (
                <>
                    <Button
                        variant="light"
                        color="red"
                        size="md"
                        radius="xl"
                        w={{ base: '100%', sm: 'auto' }}
                        miw={{ sm: 160 }}
                        leftSection={<IconX size={18} />}
                        loading={isPending}
                        onClick={() => handleAction('reject')}
                    >
                        {t('reject')}
                    </Button>
                    <Button
                        variant="filled"
                        color="green"
                        size="md"
                        radius="xl"
                        w={{ base: '100%', sm: 'auto' }}
                        miw={{ sm: 160 }}
                        leftSection={<IconCheck size={18} />}
                        loading={isPending}
                        onClick={() => handleAction('accept')}
                    >
                        {t('accept')}
                    </Button>
                </>
            ) : (
                <Button
                    variant="filled"
                    color="red"
                    size="md"
                    radius="xl"
                    w={{ base: '100%', sm: 'auto' }}
                    miw={{ sm: 160 }}
                    leftSection={<IconTrash size={18} />}
                    loading={isPending}
                    onClick={handleDelete}
                >
                    {t('delete')}
                </Button>
            )}
        </Flex>
    );
}

