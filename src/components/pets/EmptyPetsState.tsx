'use client';

import { Paper, Title, Text, Button, Stack, ThemeIcon, List, Group } from '@mantine/core';
import { IconPaw, IconVaccine, IconScale, IconCheck, IconPlus } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';

export function EmptyPetsState() {
    return (
        <Paper withBorder p="xl" radius="md" mt="md">
            <Stack align="center" gap="lg" py="lg">
                <ThemeIcon
                    size={80}
                    radius="50%"
                    variant="light"
                    color="cyan"
                >
                    <IconPaw size={48} />
                </ThemeIcon>

                <Stack align="center" gap="xs">
                    <Title order={3} ta="center">¡Bienvenido a PetClan!</Title>
                    <Text ta="center" c="dimmed" maw={500}>
                        Aún no tienes mascotas registradas. Agrega a tus compañeros peludos para comenzar a disfrutar de todos los beneficios.
                    </Text>
                </Stack>

                <Paper withBorder p="md" radius="md" w="100%" maw={500}>
                    <Text size="sm" fw={600} mb="sm">Con PetClan podrás:</Text>
                    <List
                        spacing="xs"
                        size="sm"
                        center
                        icon={
                            <ThemeIcon color="teal" size={20} radius="xl">
                                <IconCheck size={12} />
                            </ThemeIcon>
                        }
                    >
                        <List.Item>Llevar el historial de vacunas y eventos de salud</List.Item>
                        <List.Item>Registrar y monitorear el peso</List.Item>
                        <List.Item>Recibir recordatorios importantes</List.Item>
                        <List.Item>Tener todos los datos de tu mascota organizados</List.Item>
                    </List>
                </Paper>

                <Button
                    component={Link}
                    href="/dashboard/pets/new"
                    size="md"
                    color="cyan"
                    leftSection={<IconPlus size={20} />}
                    mt="md"
                >
                    Registrar mi primera mascota
                </Button>
            </Stack>
        </Paper>
    );
}
