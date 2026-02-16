'use client';

import { TextInput, Stack, Text, Group, Textarea, Paper } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconScale, IconId } from '@tabler/icons-react';
import { WeightInput } from '../../form/WeightInput';

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
                            <WeightInput
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                error={errors.weight?.message as string}
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


