'use client';

import { TextInput, Group, Stack, Text, SegmentedControl, Paper, ThemeIcon, Center } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useFormContext, Controller } from 'react-hook-form';
import { IconGenderMale, IconGenderFemale, IconCake } from '@tabler/icons-react';
import { differenceInMonths, differenceInYears } from 'date-fns';

export default function DetailsStep() {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const birthDate = watch('birthDate');
    const name = watch('name');

    // Calculate Age Display
    const getAgeDisplay = (dateStr: string | Date) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        const today = new Date();
        const years = differenceInYears(today, date);
        const months = differenceInMonths(today, date) % 12;

        if (years === 0 && months === 0) return '¡Recién nacido!';
        if (years === 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        return `${years} años${months > 0 ? ` y ${months} meses` : ''}`;
    };

    return (
        <Stack gap="xl">
            <Text size="xl" fw={800} ta="center">Un poco sobre {name}...</Text>

            <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                    <Group justify="center" gap="lg">
                        {[
                            { value: 'male', label: 'Macho', icon: <IconGenderMale size={30} />, color: 'blue' },
                            { value: 'female', label: 'Hembra', icon: <IconGenderFemale size={30} />, color: 'pink' }
                        ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                                <Paper
                                    key={option.value}
                                    component="button"
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    p="md"
                                    radius="lg"
                                    withBorder
                                    style={{
                                        width: 140,
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? `var(--mantine-color-${option.color}-0)` : 'transparent',
                                        borderColor: isSelected ? `var(--mantine-color-${option.color}-5)` : 'var(--mantine-color-gray-3)',
                                        borderWidth: isSelected ? 2 : 1,
                                        transition: 'all 0.2s',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                >
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon
                                            size={48}
                                            radius="xl"
                                            variant={isSelected ? 'filled' : 'light'}
                                            color={option.color}
                                        >
                                            {option.icon}
                                        </ThemeIcon>
                                        <Text fw={700} c={isSelected ? `${option.color}.8` : 'dimmed'}>
                                            {option.label}
                                        </Text>
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Group>
                )}
            />

            <TextInput
                label="Raza"
                placeholder="Ej. Golden Retriever, Mestizo..."
                size="md"
                radius="md"
                withAsterisk
                {...register('breed')}
                error={errors.breed?.message as string}
            />

            <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                    <Stack gap={5}>
                        <DateInput
                            label="Fecha de Nacimiento"
                            placeholder="DD/MM/AAAA"
                            size="md"
                            radius="md"
                            withAsterisk
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date: any) => {
                                if (date instanceof Date) {
                                    field.onChange(date.toISOString());
                                } else if (typeof date === 'string') {
                                    // Handle string input (e.g. from native date picker fallback or behavior quirks)
                                    const d = new Date(date);
                                    if (!isNaN(d.getTime())) {
                                        field.onChange(d.toISOString());
                                    }
                                } else if (date === null) {
                                    field.onChange('');
                                }
                            }}
                            valueFormat="DD/MM/YYYY"
                            clearable
                            locale="es"
                            maxDate={new Date()}
                            popoverProps={{ withinPortal: true, zIndex: 10000 }}
                            error={errors.birthDate?.message as string}
                            leftSection={<IconCake size={18} />}
                        />
                        {field.value && (
                            <Text size="sm" c="dimmed" ta="right">
                                Edad: <Text span fw={700} c="cyan">{getAgeDisplay(field.value)}</Text>
                            </Text>
                        )}
                    </Stack>
                )}
            />
        </Stack>
    );
}
