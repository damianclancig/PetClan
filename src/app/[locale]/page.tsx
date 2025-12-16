'use client';

import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <Container size="md" style={{ marginTop: 100 }}>
            <Title order={1} style={{ textAlign: 'center' }}>
                {t('title')}
            </Title>
            <Text c="dimmed" size="lg" ta="center" mt="md">
                {t('subtitle')}
            </Text>
            <Group justify="center" mt="xl">
                <Button component={Link} href="/dashboard" size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                    {t('start')}
                </Button>
            </Group>
        </Container>
    );
}
