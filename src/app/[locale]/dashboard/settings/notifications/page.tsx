'use client';

import { useState, useEffect } from 'react';
import { Paper, Checkbox, Button, Stack, Text, LoadingOverlay, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';

export default function NotificationSettingsPage() {
    const [preferences, setPreferences] = useState({ email: true, inApp: true });
    const [initialPreferences, setInitialPreferences] = useState({ email: true, inApp: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await fetch('/api/user/preferences');
                if (res.ok) {
                    const data = await res.json();
                    setPreferences(data);
                    setInitialPreferences(data);
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
                notifications.show({
                    title: 'Error',
                    message: 'No se pudieron cargar las preferencias.',
                    color: 'red',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPreferences();
    }, []);

    const handleChange = (key: 'email' | 'inApp', checked: boolean) => {
        setPreferences((prev) => ({ ...prev, [key]: checked }));
    };

    const hasChanges =
        preferences.email !== initialPreferences.email ||
        preferences.inApp !== initialPreferences.inApp;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            if (!res.ok) throw new Error('Failed to save');

            const data = await res.json();
            setInitialPreferences(data);

            notifications.show({
                title: 'Cambios guardados',
                message: 'Tus preferencias de notificaciones han sido actualizadas.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            router.refresh(); // Refresh server components if needed
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudieron guardar los cambios.',
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageContainer size="sm" title="Configuración de Notificaciones 🔔">
            <Paper radius="md" p="xl" withBorder pos="relative">
                <LoadingOverlay visible={loading} overlayProps={{ radius: 'md', blur: 2 }} />

                <Text c="dimmed" mb="xl">
                    Elige cómo quieres recibir las alertas sobre tus mascotas y la comunidad.
                </Text>

                <Stack gap="lg">
                    <Checkbox
                        label="Notificaciones por Correo Electrónico"
                        description="Recibe alertas importantes, recordatorios y solicitudes en tu email."
                        checked={preferences.email}
                        onChange={(e) => handleChange('email', e.currentTarget.checked)}
                        size="md"
                    />

                    <Checkbox
                        label="Notificaciones en la Aplicación"
                        description="Recibe alertas visuales (campana) y mensajes emergentes mientras usas PetClan."
                        checked={preferences.inApp}
                        onChange={(e) => handleChange('inApp', e.currentTarget.checked)}
                        size="md"
                    />

                    <Group justify="flex-end" mt="xl">
                        <Button
                            leftSection={<IconDeviceFloppy size={18} />}
                            onClick={handleSave}
                            disabled={!hasChanges}
                            loading={saving}
                        >
                            Guardar Cambios
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </PageContainer>
    );
}
