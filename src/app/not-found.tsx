'use client';

import { Button, Container, Title, Text, Stack } from '@mantine/core';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Providers } from '@/components/providers/Providers';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import esMessages from '../../messages/es.json';

function NotFoundContent() {
    const t = useTranslations('Errors.NotFound');
    return (
        <Container className="h-screen flex items-center justify-center" size="lg">
            <Stack align="center" gap="xl">
                <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                    <Image
                        src="/assets/images/error-404.webp"
                        alt="404 - Not Found"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                <Title order={1} size="h2" ta="center">
                    {t('title')}
                </Title>

                <Text c="dimmed" size="lg" ta="center" maw={500}>
                    {t('description')}
                </Text>

                <Button component="a" href="/dashboard" size="lg" variant="light" color="teal">
                    {t('button')}
                </Button>
            </Stack>
        </Container>
    );
}

export default function NotFound() {
    return (
        <Providers messages={esMessages} locale="es">
            <NotFoundContent />
        </Providers>
    );
}
