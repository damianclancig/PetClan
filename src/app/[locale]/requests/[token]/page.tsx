'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Title, Text, Button, Group, Avatar, Stack, Loader, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';

export default function RequestPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await fetch(`/api/requests/${token}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Error fetching request');
                }
                const data = await res.json();
                setRequest(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [token]);

    const handleAction = async (action: 'accept' | 'reject') => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/requests/${token}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error processing request');
            }

            notifications.show({
                title: action === 'accept' ? 'Solicitud aceptada' : 'Solicitud rechazada',
                message: action === 'accept' ? 'Has dejado de compartir la mascota.' : 'Sigues siendo dueño de la mascota.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Center h="100vh"><Loader /></Center>;

    if (error) {
        return (
            <Container size="sm" mt={100}>
                <Paper p="xl" radius="md" withBorder>
                    <Stack align="center">
                        <IconAlertCircle size={48} color="red" />
                        <Title order={3}>Error</Title>
                        <Text c="dimmed">{error}</Text>
                        <Button onClick={() => router.push('/dashboard')}>Ir al Dashboard</Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xs" mt={60}>
            <Paper radius="md" p="xl" withBorder shadow="sm">
                <Stack align="center" gap="lg">
                    <Title order={3} ta="center">Solicitud de Baja</Title>

                    <Avatar
                        src={request.requesterImage}
                        size="lg"
                        radius="xl"
                        color="cyan"
                    >
                        {request.requesterName?.charAt(0)}
                    </Avatar>

                    <Text ta="center" size="lg">
                        <strong>{request.requesterName}</strong> te ha solicitado que dejes de ser dueño de:
                    </Text>

                    <Avatar
                        src={request.petPhoto}
                        size={120}
                        radius="md"
                        color="blue"
                    >
                        {request.petName?.charAt(0)}
                    </Avatar>

                    <Title order={2}>{request.petName}</Title>

                    <Text c="dimmed" ta="center" size="sm">
                        Si aceptas, ya no tendrás acceso a esta mascota ni a su historial médico.
                    </Text>

                    <Group w="100%" grow>
                        <Button
                            color="red"
                            variant="outline"
                            onClick={() => handleAction('accept')}
                            loading={processing}
                            leftSection={<IconCheck size={18} />}
                        >
                            Aceptar y Salir
                        </Button>
                        <Button
                            color="gray"
                            variant="subtle"
                            onClick={() => handleAction('reject')}
                            loading={processing}
                            leftSection={<IconX size={18} />}
                        >
                            Rechazar
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Container>
    );
}
