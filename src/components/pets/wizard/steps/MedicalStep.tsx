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
