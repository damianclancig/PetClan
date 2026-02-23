'use client';

import { Container, Title, Text, Paper, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { TermsOfService } from '@/components/legal/TermsOfService';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('TermsPage');

    return (
        <Container size="md" py="xl">
            <Button component={Link} href="/dashboard" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="md">
                {t('backDefault')}
            </Button>

            <Title order={1} mb="xl" ta="center">{t('title')}</Title>

            <Paper withBorder p="xl" radius="md" mb="xl" bg="var(--mantine-color-body)">
                <Text size="sm" c="dimmed" mb="lg">
                    {t('lastUpdated')}
                </Text>

                <TermsOfService />
            </Paper>

            <Text ta="center" c="dimmed" size="sm">
                {t('questions')}
            </Text>
        </Container>
    );
}


