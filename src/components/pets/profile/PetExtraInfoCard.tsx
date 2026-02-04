import { Paper, Title, Text, Group, Stack, ThemeIcon, Badge, Divider, Grid } from '@mantine/core';
import { IconNotes, IconFirstAidKit, IconStethoscope, IconPaw } from '@tabler/icons-react';
import { IPet } from '@/models/Pet';

interface PetExtraInfoCardProps {
    pet: IPet;
}

export function PetExtraInfoCard({ pet }: PetExtraInfoCardProps) {
    // Check if any extra info exists
    const hasInfo = pet.characteristics || pet.diseases || pet.treatments || pet.notes;

    if (!hasInfo) return null;

    return (
        <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">Información Adicional</Title>
            <Stack gap="lg">
                {pet.characteristics && (
                    <Grid gutter="xs">
                        <Grid.Col span={1}>
                            <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                                <IconPaw size={20} />
                            </ThemeIcon>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <Text fw={600} size="sm">Características</Text>
                            <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-line' }}>{pet.characteristics}</Text>
                        </Grid.Col>
                    </Grid>
                )}

                {pet.diseases && (
                    <Grid gutter="xs">
                        <Grid.Col span={1}>
                            <ThemeIcon variant="light" color="red" size="lg" radius="md">
                                <IconStethoscope size={20} />
                            </ThemeIcon>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <Text fw={600} size="sm">Enfermedades / Condiciones</Text>
                            <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-line' }}>{pet.diseases}</Text>
                        </Grid.Col>
                    </Grid>
                )}

                {pet.treatments && (
                    <Grid gutter="xs">
                        <Grid.Col span={1}>
                            <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                                <IconFirstAidKit size={20} />
                            </ThemeIcon>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <Text fw={600} size="sm">Tratamientos</Text>
                            <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-line' }}>{pet.treatments}</Text>
                        </Grid.Col>
                    </Grid>
                )}

                {pet.notes && (
                    <Grid gutter="xs">
                        <Grid.Col span={1}>
                            <ThemeIcon variant="light" color="gray" size="lg" radius="md">
                                <IconNotes size={20} />
                            </ThemeIcon>
                        </Grid.Col>
                        <Grid.Col span={11}>
                            <Text fw={600} size="sm">Notas Adicionales</Text>
                            <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-line' }}>{pet.notes}</Text>
                        </Grid.Col>
                    </Grid>
                )}
            </Stack>
        </Paper>
    );
}
