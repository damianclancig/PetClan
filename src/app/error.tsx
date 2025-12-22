'use client';

import { useEffect } from 'react';
import { Button, Container, Title, Text, Stack, Group, ColorSchemeScript } from '@mantine/core';
import Image from 'next/image';
import { Providers } from '@/components/providers/Providers';
import { inter, poppins } from '@/styles/fonts';
import '@mantine/core/styles.css';
import '@/styles/globals.css';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Providers>
            <Container className="h-screen flex items-center justify-center" size="lg">
                <Stack align="center" gap="xl">
                    <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                        <Image
                            src="/assets/images/500.png"
                            alt="500 - Error del sistema"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    <Title order={1} size="h2" ta="center">
                        Algo salió mal
                    </Title>

                    <Text c="dimmed" size="lg" ta="center" maw={500}>
                        Tuvimos un problema inesperado en el servidor.
                        Nuestro equipo técnico (y sus mascotas asistentes) ya están investigando.
                    </Text>

                    <Group>
                        <Button onClick={reset} size="lg" variant="filled" color="teal">
                            Intentar nuevamente
                        </Button>
                        <Button component="a" href="/dashboard" size="lg" variant="light" color="gray">
                            Ir al Inicio
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </Providers>
    );
}
