'use client';

import { useState } from 'react';
import { Button, Flex } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function InvitationActions({ token }: { token: string }) {
    const router = useRouter();
    const t = useTranslations('Invitations');
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

    const handleAction = async (action: 'accept' | 'reject') => {
        setLoading(action);
        try {
            const res = await fetch(`/api/invitations/${token}/actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || t('error'));

            if (action === 'accept') {
                notifications.show({
                    title: '¡Bienvenido!',
                    message: t('accept_success', { name: data.pet?.name || '' }),
                    color: 'green',
                    icon: <IconCheck size={18} />
                });
                router.push('/dashboard');
            } else {
                notifications.show({
                    title: t('reject_success'),
                    message: '',
                    color: 'blue',
                    icon: <IconX size={18} />
                });
                router.push('/dashboard');
            }

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
        <Flex 
            direction={{ base: 'column-reverse', sm: 'row' }} 
            gap="md" 
            mt="md"
            justify="center"
            align={{ base: 'stretch', sm: 'center' }}
            w="100%"
        >
            <Button
                color="red"
                variant="light"
                size="md"
                w={{ base: '100%', sm: 'auto' }}
                miw={{ sm: 160 }}
                leftSection={<IconX size={20} />}
                loading={loading === 'reject'}
                disabled={loading === 'accept'}
                onClick={() => handleAction('reject')}
            >
                {t('reject')}
            </Button>
            <Button
                color="green"
                size="md"
                w={{ base: '100%', sm: 'auto' }}
                miw={{ sm: 160 }}
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
