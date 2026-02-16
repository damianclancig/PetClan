'use client';

import { TextInput, Stack, Text } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { SexSelector } from '../../form/SexSelector';
import { BirthDatePicker } from '../../form/BirthDatePicker';

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
                    <SexSelector
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                    />
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
