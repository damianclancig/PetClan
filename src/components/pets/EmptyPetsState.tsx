'use client';

import { Paper, Title, Text, Button, Stack, ThemeIcon, List, Group } from '@mantine/core';
import { IconPaw, IconVaccine, IconScale, IconCheck, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function EmptyPetsState() {
    const tEmpty = useTranslations('EmptyStates');
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
                    <Title order={3} ta="center">¡PetClan!</Title>
                    <Text ta="center" c="dimmed" maw={500}>
                        {tEmpty('emptyPetsTitle')}
                    </Text>
                </Stack>

                <Paper withBorder p="md" radius="md" w="100%" maw={500}>
                    <Text size="sm" fw={600} mb="sm">PetClan:</Text>
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
                        <List.Item>{tEmpty('emptyPetsDetail')}</List.Item>
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
                    {tEmpty('emptyPetsBtn')}
                </Button>
            </Stack>
        </Paper>
    );
}
