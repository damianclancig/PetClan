import { Stack, TextInput, Modal, Center, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconCake } from '@tabler/icons-react';
import { parseDate, formatDate, formatAge, dayjs } from '@/lib/dateUtils';

interface BirthDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function BirthDatePicker({ value, onChange, error }: BirthDatePickerProps) {
    const [opened, { open, close }] = useDisclosure(false);
    // Use global util to parse date string to dayjs, then convert to JS Date for picker
    const dateObj = parseDate(value);
    const dateValue = dateObj ? dateObj.toDate() : null;

    return (
        <Stack gap={5}>
            <TextInput
                label="Fecha de Nacimiento"
                placeholder="Selecciona una fecha"
                size="md"
                radius="md"
                withAsterisk
                value={formatDate(value)}
                onClick={open}
                readOnly
                rightSection={<IconCake size={18} />}
                style={{ cursor: 'pointer' }}
                styles={{ input: { cursor: 'pointer' } }}
                error={error}
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
                                onChange(dayjs(date).format('YYYY-MM-DD'));
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

            {value && (
                <Text size="sm" c="dimmed" ta="right">
                    Edad: <Text span fw={700} c="cyan">{formatAge(value)}</Text>
                </Text>
            )}
        </Stack>
    );
}
