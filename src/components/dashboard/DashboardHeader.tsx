'use client';

import { Group, Stack, Text, Title, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const today = dayjs().locale('es').format('dddd, D [de] MMMM');

    return (
        <Box mb="xl">
            <Group justify="space-between" align="flex-end">
                <Stack gap={0}>
                    <Text size="sm" c="dimmed" tt="capitalize">
                        {today}
                    </Text>
                    <Title order={2} style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                        Hola, <Text span c="teal" inherit>{userName}</Text>
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Aquí tienes el resumen de tu manada hoy.
                    </Text>
                </Stack>
            </Group>
        </Box>
    );
}
