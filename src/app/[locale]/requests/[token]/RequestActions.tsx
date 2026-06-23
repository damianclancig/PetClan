'use client';

import { useState } from 'react';
import { Button, Flex } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function RequestActions({ token }: { token: string }) {
    const router = useRouter();
    const t = useTranslations('Requests');
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

    const handleAction = async (action: 'accept' | 'reject') => {
        setLoading(action);
        try {
            const res = await fetch(`/api/requests/${token}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || t('error'));

            if (action === 'accept') {
                notifications.show({
                    title: t('accept_success'),
                    message: '',
                    color: 'green',
                    icon: <IconCheck size={18} />
                });
            } else {
                notifications.show({
                    title: t('reject_success'),
                    message: '',
                    color: 'blue',
                    icon: <IconX size={18} />
                });
            }

            router.push('/dashboard');
            router.refresh();

        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
            });
            setLoading(null);
        }
    };

    return (
        <Flex direction={{ base: 'column-reverse', sm: 'row' }} gap="sm" mt="md">
            <Button
                style={{ flex: 1 }}
                color="gray"
                variant="subtle"
                size="md"
                leftSection={<IconX size={20} />}
                loading={loading === 'reject'}
                disabled={loading === 'accept'}
                onClick={() => handleAction('reject')}
            >
                {t('reject')}
            </Button>
            <Button
                style={{ flex: 1 }}
                color="red"
                size="md"
                leftSection={<IconCheck size={20} />}
                loading={loading === 'accept'}
                disabled={loading === 'reject'}
                onClick={() => handleAction('accept')}
            >
                {t('accept')}
            </Button>
        </Flex>
    );
}
