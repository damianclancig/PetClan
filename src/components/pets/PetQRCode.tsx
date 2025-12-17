'use client';

import QRCode from 'react-qr-code';
import { Paper, Text, Stack } from '@mantine/core';

interface PetQRCodeProps {
    petId: string;
    petName: string;
}

export function PetQRCode({ petId, petName }: PetQRCodeProps) {
    // Determine the base URL. In client-side, window.location.origin is useful, 
    // but for SSR safety/consistency we might want an env var or just relative path if we render client only.
    // For now, let's assume we construct the full URL client-side to ensure correct domain.

    // Safety check for window
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const publicUrl = `${origin}/public/pets/${petId}`;

    return (
        <Paper p="md" withBorder radius="md" style={{ display: 'inline-block' }}>
            <Stack align="center" gap="xs">
                <QRCode value={publicUrl} size={150} />
                <Text size="xs" c="dimmed" mt="sm">
                    Escanear para ver a {petName}
                </Text>
            </Stack>
        </Paper>
    );
}
