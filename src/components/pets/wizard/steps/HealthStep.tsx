'use client';

import { TextInput, Stack, Text, NumberInput, Group, Textarea, Paper, ActionIcon } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconScale, IconId, IconMinus, IconPlus } from '@tabler/icons-react';

export default function HealthStep() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">Datos de Salud de {name}</Text>

            <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="center" gap="xs">
                        <IconScale size={20} />
                        <Text fw={600}>Peso Actual (kg)</Text>
                    </Group>

                    <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                            <Group justify="center" gap="md">
                                <ActionIcon
                                    size={42}
                                    variant="light"
                                    color="cyan"
                                    radius="xl"
                                    onClick={() => {
                                        const current = Number(field.value) || 0;
                                        const next = Math.max(0.1, Number((current - 0.1).toFixed(1)));
                                        field.onChange(next);
                                    }}
                                    disabled={!field.value || Number(field.value) <= 0.1}
                                >
                                    <IconMinus size={24} />
                                </ActionIcon>

                                <NumberInput
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    min={0.1}
                                    max={100}
                                    step={0.1}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    decimalScale={1}
                                    fixedDecimalScale
                                    w={120}
                                    size="lg"
                                    radius="md"
                                    styles={{ input: { textAlign: 'center', fontSize: 24, fontWeight: 'bold' } }}
                                    rightSection={<Text size="xs" c="dimmed" mr={10}>kg</Text>}
                                    rightSectionWidth={40}
                                    error={errors.weight?.message as string}
                                />

                                <ActionIcon
                                    size={42}
                                    variant="filled"
                                    color="cyan"
                                    radius="xl"
                                    onClick={() => {
                                        const current = Number(field.value) || 0;
                                        const next = Math.min(100, Number((current + 0.1).toFixed(1)));
                                        field.onChange(next);
                                    }}
                                >
                                    <IconPlus size={24} />
                                </ActionIcon>
                            </Group>
                        )}
                    />
                </Stack>
            </Paper>

            <TextInput
                label="Identificación (Chip)"
                placeholder="Opcional"
                leftSection={<IconId size={18} />}
                size="md"
                radius="md"
                {...register('chipId')}
            />

            <Textarea
                label="Características / Señas Particulares"
                placeholder="Mancha en la oreja, cola corta..."
                minRows={3}
                radius="md"
                {...register('characteristics')}
            />
        </Stack>
    );
}


