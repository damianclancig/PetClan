'use client';

import { Container, Title, Text, Paper, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from '@/i18n/routing';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
    const t = useTranslations('PrivacyPage');
    const router = useRouter();

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <Container size="md" py="xl">
            <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                mb="md"
                onClick={handleBack}
            >
                {t('backDefault')}
            </Button>

            <Title order={1} mb="xl" ta="center">{t('title')}</Title>

            <Paper withBorder p="xl" radius="md" mb="xl" bg="var(--mantine-color-body)">
                <Text size="sm" c="dimmed" mb="lg">
                    {t('lastUpdated')}
                </Text>

                <PrivacyPolicy />
            </Paper>
        </Container>
    );
}
