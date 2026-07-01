/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Stack, TextInput, Modal, Center, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconCake } from '@tabler/icons-react';
import { parseDate, formatDate, getPetAge, formatAgeTranslated, dayjs } from '@/lib/dateUtils';
import { useTranslations } from 'next-intl';

interface BirthDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function BirthDatePicker({ value, onChange, error }: BirthDatePickerProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('NewPet');
    const tDashboardPets = useTranslations('DashboardView.Pets');
    // Use global util to parse date string to dayjs, then convert to JS Date for picker
    const dateObj = parseDate(value);
    const dateValue = dateObj ? dateObj.toDate() : null;

    return (
        <Stack gap={5}>
            <TextInput
                label={t('birthDate')}
                placeholder={t('selectDate')}
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
                title={t('selectDateTitle')}
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
                    {t('ageTitle')} <Text span fw={700} c="cyan">
                        {formatAgeTranslated(value, tDashboardPets)}
                    </Text>
                </Text>
            )}
        </Stack>
    );
}
