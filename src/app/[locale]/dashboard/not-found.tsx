'use client';

import { Button, Container, Title, Text, Stack } from '@mantine/core';
import Image from 'next/image';

export default function NotFound() {
    return (
        <Container className="h-full flex items-center justify-center" size="lg" style={{ minHeight: 'calc(100vh - 80px)' }}> {/* Adjusted height for dashboard */}
            <Stack align="center" gap="xl">
                <div style={{ position: 'relative', width: '100%', maxWidth: 400, aspectRatio: '4/3' }}>
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
                </Text>

                <Button component="a" href="/dashboard" size="lg" variant="light" color="teal">
                    Volver al Dashboard
                </Button>
            </Stack>
        </Container>
    );
}
