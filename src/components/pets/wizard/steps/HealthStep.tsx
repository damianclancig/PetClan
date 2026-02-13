'use client';

import { TextInput, Stack, Text, Slider, NumberInput, Group, Textarea, Paper } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconScale, IconId, IconClipboardText } from '@tabler/icons-react';

export default function HealthStep() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">Datos de Salud de {name}</Text>

            <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Group gap="xs">
                            <IconScale size={20} />
                            <Text fw={600}>Peso Actual (kg)</Text>
                        </Group>
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    min={0.1}
                                    max={100}
                                    step={0.1}
                                    w={100}
                                    size="sm"
                                    suffix=" kg"
                                    error={errors.weight?.message as string}
                                />
                            )}
                        />
                    </Group>

                    <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                            <Slider
                                value={typeof field.value === 'number' ? field.value : 0}
                                onChange={field.onChange}
                                min={0.5}
                                max={60}
                                step={0.5}
                                marks={[
                                    { value: 5, label: '5kg' },
                                    { value: 20, label: '20kg' },
                                    { value: 40, label: '40kg' },
                                ]}
                                color="cyan"
                                label={(val) => `${val} kg`}
                            />
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


