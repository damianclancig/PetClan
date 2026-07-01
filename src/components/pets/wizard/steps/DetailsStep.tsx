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

'use client';

import { TextInput, Stack, Text } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { SexSelector } from '../../form/SexSelector';
import { BirthDatePicker } from '../../form/BirthDatePicker';
import { useTranslations } from 'next-intl';

export default function DetailsStep() {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const t = useTranslations('NewPet');
    const birthDate = watch('birthDate');
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">{t('aboutPet', { name: name || '' })}</Text>

            <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                    <SexSelector
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                    />
                )}
            />

            <TextInput
                label={t('breed')}
                placeholder={t('placeholders.breed')}
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
                    <BirthDatePicker
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        error={errors.birthDate?.message as string}
                    />
                )}
            />
        </Stack>
    );
}
