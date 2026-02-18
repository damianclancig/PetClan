import { TextInput, Modal, Center } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar } from '@tabler/icons-react';
import { parseDate, formatDate, dayjs } from '@/lib/dateUtils';

interface ModalDatePickerProps {
    label: string;
    placeholder?: string;
    value: string; // Expects YYYY-MM-DD string
    onChange: (value: string) => void;
    error?: string;
    minDate?: Date;
    maxDate?: Date;
    rightSection?: React.ReactNode;
    defaultLevel?: 'month' | 'year' | 'decade';
    withAsterisk?: boolean;
    description?: React.ReactNode;
}

export function ModalDatePicker({
    label,
    placeholder,
    value,
    onChange,
    error,
    minDate,
    maxDate,
    rightSection,
    defaultLevel = 'year',
    withAsterisk,
    description
}: ModalDatePickerProps) {
    const [opened, { open, close }] = useDisclosure(false);

    // Parse value for DatePicker
    const dateObj = parseDate(value);
    const dateValue = dateObj ? dateObj.toDate() : null;

    return (
        <>
            <TextInput
                label={label}
                placeholder={placeholder || "Selecciona una fecha"}
                size="md"
                radius="md"
                withAsterisk={withAsterisk}
                value={formatDate(value)} // Display DD/MM/YYYY
                onClick={open}
                readOnly
                rightSection={rightSection || <IconCalendar size={18} />}
                style={{ cursor: 'pointer' }}
                styles={{ input: { cursor: 'pointer' } }}
                error={error}
                description={description}
            />

            <Modal
                opened={opened}
                onClose={close}
                title={`Seleccionar ${label}`}
                centered
                size="auto"
            >
                <Center>
                    <DatePicker
                        value={dateValue}
                        onChange={(date) => {
                            if (date) {
                                // Format locally as YYYY-MM-DD (no time/timezone shift)
                                onChange(dayjs(date).format('YYYY-MM-DD'));
                                close();
                            }
                        }}
                        defaultLevel={defaultLevel}
                        defaultDate={dateValue || new Date()}
                        locale="es"
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                </Center>
            </Modal>
        </>
    );
}
