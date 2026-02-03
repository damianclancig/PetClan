'use client';

import { Container, Title, Text, Paper, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { TermsOfService } from '@/components/legal/TermsOfService';

export default function TermsPage() {
    return (
        <Container size="md" py="xl">
            <Button component={Link} href="/dashboard" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="md">
                Volver al Dashboard
            </Button>

            <Title order={1} mb="xl" ta="center">Términos y Condiciones de Uso</Title>

            <Paper withBorder p="xl" radius="md" mb="xl" bg="var(--mantine-color-body)">
                <Text size="sm" c="dimmed" mb="lg">
                    Última actualización: Enero 2026
                </Text>

                <TermsOfService />
            </Paper>

            <Text ta="center" c="dimmed" size="sm">
                Si tiene alguna pregunta sobre estos términos, por favor contáctenos a través de los canales de soporte.
            </Text>
        </Container>
    );
}


