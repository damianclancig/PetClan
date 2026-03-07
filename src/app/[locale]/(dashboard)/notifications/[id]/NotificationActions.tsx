'use client';

import { Button, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { IconTrash, IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationActionsProps {
    notificationId: string;
}

export default function NotificationActions({ notificationId }: NotificationActionsProps) {
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

    return (
        <Group justify="center" mt="xl" gap="md">
            <Button
                variant="default"
                size="md"
                radius="xl"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => router.push('/dashboard')}
            >
                {t('back')}
            </Button>
            <Button
                variant="filled"
                color="red"
                size="md"
                radius="xl"
                leftSection={<IconTrash size={18} />}
                loading={isPending}
                onClick={handleDelete}
            >
                {t('delete')}
            </Button>
        </Group>
    );
}

