'use client';

import { TextInput, Stack, Text, Group, Textarea, Paper } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconScale, IconId } from '@tabler/icons-react';
import { WeightInput } from '../../form/WeightInput';
import { useTranslations } from 'next-intl';

export default function HealthStep() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    const t = useTranslations('NewPet');
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">{t('healthData', { name: name || '' })}</Text>

            <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="center" gap="xs">
                        <IconScale size={20} />
                        <Text fw={600}>{t('weight')}</Text>
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
                label={t('chipId')}
                placeholder={t('optional')}
                leftSection={<IconId size={18} />}
                size="md"
                radius="md"
                {...register('chipId')}
            />

            <Textarea
                label={t('characteristics')}
                placeholder={t('placeholders.characteristics')}
                minRows={3}
                radius="md"
                {...register('characteristics')}
            />
        </Stack>
    );
}


