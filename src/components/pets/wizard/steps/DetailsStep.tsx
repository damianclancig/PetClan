'use client';

import { TextInput, Group, Stack, Text, SegmentedControl, Paper, ThemeIcon, Center, Modal } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useFormContext, Controller } from 'react-hook-form';
import { IconGenderMale, IconGenderFemale, IconCake } from '@tabler/icons-react';
import { parseDate, formatDate, formatAge, dayjs } from '@/lib/dateUtils';

export default function DetailsStep() {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const birthDate = watch('birthDate');
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">Un poco sobre {name}...</Text>

            <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                    <Group justify="center" gap="lg">
                        {[
                            { value: 'male', label: 'Macho', icon: <IconGenderMale size={24} />, color: 'blue' },
                            { value: 'female', label: 'Hembra', icon: <IconGenderFemale size={24} />, color: 'pink' }
                        ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                                <Paper
                                    key={option.value}
                                    component="button"
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    p="sm"
                                    radius="md"
                                    withBorder
                                    style={{
                                        width: 120,
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? `var(--mantine-color-${option.color}-0)` : 'transparent',
                                        borderColor: isSelected ? `var(--mantine-color-${option.color}-5)` : 'var(--mantine-color-gray-3)',
                                        borderWidth: isSelected ? 2 : 1,
                                        transition: 'all 0.2s',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                >
                                    <Stack align="center" gap={4}>
                                        <ThemeIcon
                                            size={36}
                                            radius="xl"
                                            variant={isSelected ? 'filled' : 'light'}
                                            color={option.color}
                                        >
                                            {option.icon}
                                        </ThemeIcon>
                                        <Text size="sm" fw={700} c={isSelected ? `${option.color}.8` : 'dimmed'}>
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
                render={({ field }) => {
                    const [opened, { open, close }] = useDisclosure(false);
                    // Use global util to parse date string to dayjs, then convert to JS Date for picker
                    const dateObj = parseDate(field.value);
                    const dateValue = dateObj ? dateObj.toDate() : null;

                    return (
                        <Stack gap={5}>
                            <TextInput
                                label="Fecha de Nacimiento"
                                placeholder="Selecciona una fecha"
                                size="md"
                                radius="md"
                                withAsterisk
                                value={formatDate(field.value)}
                                onClick={open}
                                readOnly
                                rightSection={<IconCake size={18} />}
                                style={{ cursor: 'pointer' }}
                                styles={{ input: { cursor: 'pointer' } }}
                                error={errors.birthDate?.message as string}
                            />

                            <Modal
                                opened={opened}
                                onClose={close}
                                title="Selecciona fecha de nacimiento"
                                centered
                                size="auto"
                            >
                                <Center>
                                    <DatePicker
                                        value={dateValue}
                                        onChange={(date) => {
                                            if (date) {
                                                // Use dayjs to format locally to YYYY-MM-DD
                                                // This ensures we keep exactly the selected day
                                                field.onChange(dayjs(date).format('YYYY-MM-DD'));
                                                close();
                                            }
                                        }}
                                        defaultLevel="year"
                                        defaultDate={dateValue || new Date()}
                                        locale="es"
                                        maxDate={new Date()}
                                        minDate={new Date(1990, 0, 1)}
                                    />
                                </Center>
                            </Modal>

                            {field.value && (
                                <Text size="sm" c="dimmed" ta="right">
                                    Edad: <Text span fw={700} c="cyan">{formatAge(field.value)}</Text>
                                </Text>
                            )}
                        </Stack>
                    );
                }}
            />
        </Stack>
    );
}
