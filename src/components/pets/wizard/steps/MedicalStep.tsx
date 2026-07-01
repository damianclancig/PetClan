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

import { Stack, Text, Textarea } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

export default function MedicalStep() {
    const { register, watch, formState: { errors } } = useFormContext();
    const t = useTranslations('NewPet');
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">{t('medicalHistory', { name: name || '' })}</Text>
            <Text size="sm" c="dimmed" ta="center" mb="sm">
                {t('medicalHistoryDesc')}
            </Text>

            <Textarea
                label={t('diseases')}
                placeholder={t('placeholders.diseases')}
                minRows={3}
                radius="md"
                {...register('diseases')}
            />

            <Textarea
                label={t('treatments')}
                placeholder={t('placeholders.treatments')}
                minRows={3}
                radius="md"
                {...register('treatments')}
            />

            <Textarea
                label={t('notes')}
                placeholder={t('placeholders.notes')}
                minRows={3}
                radius="md"
                {...register('notes')}
            />
        </Stack>
    );
}
