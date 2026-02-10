'use client';

import { Center, Loader, Stack, Text } from '@mantine/core';

export default function DashboardLoading() {
    return (
        <Center style={{ width: '100%', height: '100%', minHeight: '60vh' }}>
            <Stack align="center" gap="md">
                <Loader size="xl" type="dots" color="var(--color-primary)" />
                <Text size="sm" c="dimmed" fw={500}>
                    Cargando...
                </Text>
            </Stack>
        </Center>
    );
}
