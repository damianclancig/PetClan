'use client';

import { useEffect } from 'react';
import { Button, Container, Title, Text, Stack, Group } from '@mantine/core';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Providers } from '@/components/providers/Providers';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import esMessages from '../../../messages/es.json';

function ErrorContent({ reset }: { reset: () => void }) {
    const t = useTranslations('Errors.ServerError');
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <AnimatedBackground />
            <Container className="relative h-full flex items-center justify-center" size="lg">
                <Stack align="center" gap="xl">
                    <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                        <Image
                            src="/assets/images/error-500.webp"
                            alt="500 - Server Error"
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

                    <Group>
                        <Button onClick={reset} size="lg" variant="filled" color="teal">
                            {t('button')}
                        </Button>
                        <Button component={Link} href="/dashboard" size="lg" variant="light" color="gray">
                            Volver al Inicio
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </div>
    );
}

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Providers messages={esMessages} locale="es">
            <ErrorContent reset={reset} />
        </Providers>
    );
}
