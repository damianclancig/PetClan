'use client';

import { Button, Container, Title, Text, Stack } from '@mantine/core';
import Image from 'next/image';
import { Providers } from '@/components/providers/Providers';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function NotFound() {
    return (
        <Providers>
            <div className="relative h-screen w-full overflow-hidden">
                <AnimatedBackground />
                <Container className="relative h-full flex items-center justify-center" size="lg">
                    <Stack align="center" gap="xl">
                        <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                            <Image
                                src="/assets/images/404.png"
                                alt="404 - Página no encontrada"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>

                        <Title order={1} size="h2" ta="center">
                            ¡Ups! No encontramos lo que buscabas
                        </Title>

                        <Text c="dimmed" size="lg" ta="center" maw={500}>
                            Parece que la página que intentas visitar no existe o ha sido movida.
                            Nuestros amigos peludos están olfateando el problema.
                        </Text>

                        <Button component="a" href="/dashboard" size="lg" variant="light" color="teal">
                            Volver al Inicio
                        </Button>
                    </Stack>
                </Container>
            </div>
        </Providers>
    );
}
