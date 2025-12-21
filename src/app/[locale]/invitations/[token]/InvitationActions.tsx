'use client';

import { useState } from 'react';
import { Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation'; // Correct router for app directory
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function InvitationActions({ token }: { token: string }) {
    const router = useRouter();
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

            if (!res.ok) throw new Error(data.error || 'Error procesando la invitación');

            if (action === 'accept') {
                notifications.show({
                    title: '¡Bienvenido!',
                    message: 'Ahora eres dueño de la mascota.',
                    color: 'green',
                });
                router.push('/dashboard'); // Go to dashboard with new pet
            } else {
                notifications.show({
                    title: 'Invitación rechazada',
                    message: 'Has rechazado la invitación.',
                    color: 'blue',
                });
                router.push('/dashboard');
            }

            router.refresh(); // Refresh server components to update data

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
        <Group mt="md">
            <Button
                color="red"
                variant="light"
                leftSection={<IconX size={16} />}
                loading={loading === 'reject'}
                disabled={loading === 'accept'}
                onClick={() => handleAction('reject')}
            >
                Rechazar
            </Button>
            <Button
                color="green"
                leftSection={<IconCheck size={16} />}
                loading={loading === 'accept'}
                disabled={loading === 'reject'}
                onClick={() => handleAction('accept')}
            >
                Aceptar Invitación
            </Button>
        </Group>
    );
}
