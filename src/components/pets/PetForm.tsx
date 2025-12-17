'use client';

import { TextInput, NumberInput, Select, Button, Group, FileButton, Avatar, Text, Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';

export type PetFormValues = {
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed: string;
    birthDate: string;
    sex: 'male' | 'female';
    weight: number;
    chipId?: string;
    photoUrl?: string;
};

interface PetFormProps {
    initialValues?: Partial<PetFormValues>;
    onSubmit: (values: PetFormValues) => void;
    isLoading: boolean;
    submitLabel?: string;
}

export function PetForm({ initialValues, onSubmit, isLoading, submitLabel }: PetFormProps) {
    const t = useTranslations('NewPet');
    const tCommon = useTranslations('Common');
    const tValidation = useTranslations('Validation');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialValues?.photoUrl || null);
    const resetRef = useRef<() => void>(null);

    const petSchema = z.object({
        name: z.string().min(2, tValidation('nameLength')),
        species: z.enum(['dog', 'cat', 'other']),
        breed: z.string().min(2, tValidation('breedRequired')),
        birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
            message: tValidation('invalidDate'),
        }),
        sex: z.enum(['male', 'female']),
        weight: z.number().min(0.1, tValidation('weightPositive')),
        chipId: z.string().optional(),
        photoUrl: z.string().optional(),
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PetFormValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            species: 'dog',
            sex: 'male',
            ...initialValues,
        },
    });

    const processImage = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const size = 200; // Target size 200x200

                canvas.width = size;
                canvas.height = size;

                if (ctx) {
                    // Center Crop Logic
                    const minDim = Math.min(img.width, img.height);
                    const sx = (img.width - minDim) / 2;
                    const sy = (img.height - minDim) / 2;

                    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

                    // Export as JPEG with 0.8 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setPreview(dataUrl);
                    setValue('photoUrl', dataUrl);
                }
            };
        };
    };

    const handleFileChange = (payload: File | null) => {
        setFile(payload);
        if (payload) {
            processImage(payload);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack align="center" mb="xl">
                <Avatar src={preview} size={120} radius={120} color="cyan">
                    {/* Fallback to Initials if no preview */}
                    {!preview && (initialValues?.name?.charAt(0) || '?')}
                </Avatar>
                <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
                    {(props) => <Button {...props} size="xs" variant="light">
                        {preview ? 'Cambiar Foto' : 'Subir Foto'}
                    </Button>}
                </FileButton>
                {preview && (
                    <Button
                        color="red"
                        variant="subtle"
                        size="xs"
                        onClick={() => {
                            setFile(null);
                            setPreview(null);
                            setValue('photoUrl', '');
                            resetRef.current?.();
                        }}
                    >
                        Eliminar Foto
                    </Button>
                )}
            </Stack>

            <TextInput
                label={t('name')}
                placeholder={t('placeholders.name')}
                {...register('name')}
                error={errors.name?.message}
                mb="md"
            />

            <Group grow mb="md">
                <Select
                    label={t('species')}
                    data={[
                        { value: 'dog', label: tCommon('species.dog') },
                        { value: 'cat', label: tCommon('species.cat') },
                        { value: 'other', label: tCommon('species.other') },
                    ]}
                    defaultValue={initialValues?.species || 'dog'}
                    onChange={(val) => setValue('species', val as 'dog' | 'cat' | 'other')}
                    error={errors.species?.message}
                />
                <TextInput
                    label={t('breed')}
                    placeholder={t('placeholders.breed')}
                    {...register('breed')}
                    error={errors.breed?.message}
                />
            </Group>

            <Group grow mb="md">
                <TextInput
                    type="date"
                    label={t('birthDate')}
                    {...register('birthDate')}
                    error={errors.birthDate?.message}
                />
                <Select
                    label={t('sex')}
                    data={[
                        { value: 'male', label: tCommon('sex.male') },
                        { value: 'female', label: tCommon('sex.female') },
                    ]}
                    defaultValue={initialValues?.sex || 'male'}
                    onChange={(val) => setValue('sex', val as 'male' | 'female')}
                    error={errors.sex?.message}
                />
            </Group>

            <NumberInput
                label={t('weight')}
                placeholder="5.5"
                min={0}
                step={0.1}
                defaultValue={initialValues?.weight}
                onChange={(val) => setValue('weight', Number(val))}
                error={errors.weight?.message}
                mb="md"
            />

            <TextInput
                label={t('chipId')}
                placeholder={t('placeholders.chipId')}
                {...register('chipId')}
                error={errors.chipId?.message}
                mb="xl"
            />

            <Group justify="flex-end">
                <Button variant="default" component={Link} href="/dashboard/pets">{tCommon('cancel')}</Button>
                <Button type="submit" loading={isLoading} color="cyan">
                    {submitLabel || t('submit')}
                </Button>
            </Group>
        </form>
    );
}
