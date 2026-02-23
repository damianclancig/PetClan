'use client';

import { useState, useEffect } from 'react';
import { Paper, Checkbox, Button, Stack, Text, LoadingOverlay, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTranslations } from 'next-intl';

export default function NotificationSettingsPage() {
    const t = useTranslations('SettingsNotifications');
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
                    title: t('errorTitle'),
                    message: t('errorLoadMsg'),
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
                title: t('savedTitle'),
                message: t('savedMsg'),
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            router.refresh(); // Refresh server components if needed
        } catch (error) {
            notifications.show({
                title: t('errorTitle'),
                message: t('errorSaveMsg'),
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageContainer size="sm" title={t('title')}>
            <Paper radius="md" p="xl" withBorder pos="relative">
                <LoadingOverlay visible={loading} overlayProps={{ radius: 'md', blur: 2 }} />

                <Text c="dimmed" mb="xl">
                    {t('description')}
                </Text>

                <Stack gap="lg">
                    <Checkbox
                        label={t('email.label')}
                        description={t('email.description')}
                        checked={preferences.email}
                        onChange={(e) => handleChange('email', e.currentTarget.checked)}
                        size="md"
                    />

                    <Checkbox
                        label={t('inApp.label')}
                        description={t('inApp.description')}
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
                            {t('save')}
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </PageContainer>
    );
}
