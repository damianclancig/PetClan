'use client';

import { TextInput, Button, Group, FileButton, Avatar, Text, Stack, Box, ActionIcon, Textarea, SimpleGrid, Select, Alert } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { SpeciesSelector } from './form/SpeciesSelector';
import { SexSelector } from './form/SexSelector';
import { BirthDatePicker } from './form/BirthDatePicker';
import { WeightInput } from './form/WeightInput';
import { ModalDatePicker } from '../ui/ModalDatePicker';
import 'dayjs/locale/es';

export type PetFormValues = {
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed: string;
    birthDate: string;
    sex: 'male' | 'female';
    weight: number;
    chipId?: string;
    photoUrl?: string;
    characteristics?: string;
    diseases?: string;
    treatments?: string;
    notes?: string;
    status: 'active' | 'lost' | 'deceased' | 'archived';
    deathDate?: string;
};

interface PetFormProps {
    initialValues?: Partial<PetFormValues>;
    onSubmit: (data: PetFormValues) => void;
    isLoading?: boolean;
    submitLabel?: string;
    lastRecordDate?: Date; // New prop for validation
    isEditMode?: boolean;
}

export function PetForm({ initialValues, onSubmit, isLoading, submitLabel, lastRecordDate, isEditMode }: PetFormProps) {
    const t = useTranslations('NewPet'); // Use NewPet translations for labels
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
        characteristics: z.string().optional(),
        diseases: z.string().optional(),
        treatments: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(['active', 'lost', 'deceased', 'archived']),
        deathDate: z.string().optional(),
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, control, reset } = useForm<PetFormValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            species: 'dog',
            sex: 'male',
            status: 'active',
            ...initialValues,
        },
    });

    // Validar que se actualicen los valores si initialValues cambia (ej: carga asíncrona)
    useEffect(() => {
        if (initialValues) {
            reset({
                species: 'dog',
                sex: 'male',
                ...initialValues,
            });
        }
    }, [initialValues, reset]);

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
                <Group gap="xs">
                    <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
                        {(props) => <Button {...props} size="xs" variant="light">
                            {preview ? 'Cambiar Foto' : 'Subir Foto'}
                        </Button>}
                    </FileButton>
                    {preview && (
                        <ActionIcon
                            color="red"
                            variant="light"
                            size="md" // matches xs button height roughly
                            onClick={() => {
                                setFile(null);
                                setPreview(null);
                                setValue('photoUrl', '');
                                resetRef.current?.();
                            }}
                            title="Eliminar Foto"
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    )}
                </Group>
            </Stack>

            <TextInput
                label={t('name')}
                placeholder={t('placeholders.name')}
                {...register('name')}
                error={errors.name?.message}
                mb={{ base: 'md', md: 'lg' }}
                withAsterisk
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={{ base: 'md', md: 'lg' }}>
                <Stack gap={4}>
                    <Text size="sm" fw={500}>{t('species')} <Text span c="red">*</Text></Text>
                    <Controller
                        name="species"
                        control={control}
                        render={({ field }) => (
                            <SpeciesSelector
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                            />
                        )}
                    />
                </Stack>

                <Stack gap={4}>
                    <Text size="sm" fw={500}>{t('sex')} <Text span c="red">*</Text></Text>
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
                </Stack>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={{ base: 'md', md: 'lg' }}>
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <BirthDatePicker
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.birthDate?.message}
                        />
                    )}
                />

                <Stack gap={4}>
                    <Text size="sm" fw={500}>{t('weight')} <Text span c="red">*</Text></Text>
                    <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                            <WeightInput
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                error={errors.weight?.message}
                            />
                        )}
                    />
                </Stack>
            </SimpleGrid>

            <TextInput
                label={t('chipId')}
                placeholder={t('placeholders.chipId')}
                {...register('chipId')}
                error={errors.chipId?.message}
                mb={{ base: 'xs', md: 'md' }}
            />

            <Textarea
                label={t('characteristics')}
                {...register('characteristics')}
                minRows={2}
                mb={{ base: 'xs', md: 'md' }}
            />

            <Textarea
                label={t('diseases')}
                {...register('diseases')}
                minRows={2}
                mb={{ base: 'xs', md: 'md' }}
            />

            <Textarea
                label={t('treatments')}
                {...register('treatments')}
                minRows={2}
                mb={{ base: 'xs', md: 'md' }}
            />

            <Textarea
                label={t('notes')}
                {...register('notes')}
                minRows={2}
                mb={{ base: 'xs', md: 'md' }}
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={{ base: 'md', md: 'lg' }}>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Estado"
                            data={[
                                { value: 'active', label: 'Activo' },
                                { value: 'lost', label: 'Perdido' },
                                { value: 'deceased', label: 'Fallecido' },
                                { value: 'archived', label: 'Archivado' },
                            ]}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                        />
                    )}
                />

                {watch('status') === 'deceased' && (
                    <Controller
                        name="deathDate"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <ModalDatePicker
                                    label="Fecha de Fallecimiento"
                                    placeholder="DD/MM/AAAA"
                                    value={field.value || ''}
                                    onChange={(val) => field.onChange(val)}
                                    maxDate={new Date()}
                                    minDate={lastRecordDate}
                                />
                                {lastRecordDate && (
                                    <Text size="xs" c="dimmed" mt={4} style={{ lineHeight: 1.2 }}>
                                        Debe ser posterior al último registro ({lastRecordDate.toLocaleDateString()})
                                    </Text>
                                )}
                            </div>
                        )}
                    />
                )}
            </SimpleGrid>

            {watch('status') === 'lost' && (
                <Stack mb="lg">
                    <Alert variant="light" color="red" title="⚠️ Alerta de Mascota Perdida">
                        Al marcar como perdido, la mascota se destacará en rojo en tu panel para facilitar su identificación.
                    </Alert>
                </Stack>
            )}

            {watch('status') === 'deceased' && (
                <Stack mb="lg">
                    <Alert variant="light" color="gray" title="🕊️ En Memoria">
                        La mascota se moverá al historial, conservando sus registros médicos como recuerdo.
                    </Alert>
                </Stack>
            )}

            {/* Mobile Buttons: Full width, side by side */}
            <Box hiddenFrom="xs" mt="xl">
                <Group grow>
                    <Button variant="default" component={Link} href="/dashboard/pets" size="md">{tCommon('cancel')}</Button>
                    <Button type="submit" loading={isLoading} color="cyan" size="md">
                        {submitLabel || t('submit')}
                    </Button>
                </Group>
            </Box>

            {/* Desktop Buttons: Right aligned */}
            <Group visibleFrom="xs" justify="flex-end" mt="xl">
                <Button variant="default" component={Link} href="/dashboard/pets">{tCommon('cancel')}</Button>
                <Button type="submit" loading={isLoading} color="cyan">
                    {submitLabel || t('submit')}
                </Button>
            </Group>
        </form>
    );
}
