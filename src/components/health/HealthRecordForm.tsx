'use client';

import { Group, Button, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { VACCINES } from '@/lib/vaccinationRules';
import { formatDateForInput, now } from '@/lib/dateUtils';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

type RecordFormValues = {
    type: 'vaccine' | 'deworming' | 'consultation';
    vaccineType?: string;
    title: string;
    description?: string;
    appliedAt: string;
    nextDueAt?: string;
    vetName?: string;
    clinicName?: string;
};

interface HealthRecordFormProps {
    petId: string;
    onSubmitSuccess: () => void;
    createRecord: (data: any) => Promise<any>;
    isCreating: boolean;
}

export function HealthRecordForm({ petId, onSubmitSuccess, createRecord, isCreating }: HealthRecordFormProps) {
    const t = useTranslations('Health');
    const tValidation = useTranslations('Validation');
    const tCommon = useTranslations('Common');

    const recordSchema = z.object({
        type: z.enum(['vaccine', 'deworming', 'consultation']),
        vaccineType: z.string().optional(),
        title: z.string().min(2, tValidation('titleRequired')),
        description: z.string().optional(),
        appliedAt: z.string(),
        nextDueAt: z.string().optional(),
        vetName: z.string().optional(),
        clinicName: z.string().optional(),
    });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RecordFormValues>({
        resolver: zodResolver(recordSchema),
        defaultValues: {
            type: 'consultation',
            appliedAt: formatDateForInput(now().toDate()),
        },
    });

    const onSubmit = async (data: RecordFormValues) => {
        try {
            await createRecord({ ...data, petId });

            const typeLabel = t(`types.${data.type}`);
            notifications.show({
                title: 'Registro agregado',
                message: `Se ha registrado ${typeLabel} exitosamente`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            onSubmitSuccess();
            reset();
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo guardar el registro',
                color: 'red',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Select
                label={t('form.type')}
                data={[
                    { value: 'vaccine', label: t('types.vaccine') },
                    { value: 'deworming', label: t('types.deworming') },
                    { value: 'consultation', label: t('types.consultation') },
                ]}
                defaultValue="consultation"
                onChange={(val) => {
                    const type = val as 'vaccine' | 'deworming' | 'consultation';
                    setValue('type', type);
                    if (type !== 'vaccine') {
                        setValue('vaccineType', undefined);
                        setValue('title', '');
                    }
                }}
                mb="sm"
            />

            {watch('type') === 'vaccine' && (
                <Select
                    label="Tipo de Vacuna"
                    placeholder="Seleccionar vacuna"
                    data={[
                        ...Object.values(VACCINES).map(v => ({ value: v.id, label: v.name })),
                        { value: 'other', label: 'Otra' }
                    ]}
                    onChange={(val) => {
                        setValue('vaccineType', val || undefined);
                        if (val && val !== 'other') {
                            const vaccine = VACCINES[val];
                            if (vaccine) {
                                setValue('title', `Vacuna ${vaccine.name}`);
                            }
                        } else if (val === 'other') {
                            setValue('title', '');
                        }
                    }}
                    mb="sm"
                />
            )}

            {(watch('type') !== 'vaccine' || watch('vaccineType') === 'other') && (
                <TextInput
                    label={t('form.title')}
                    placeholder={t('form.placeholders.title')}
                    {...register('title')}
                    error={errors.title?.message}
                    mb="sm"
                />
            )}

            {watch('type') === 'vaccine' && watch('vaccineType') && watch('vaccineType') !== 'other' && (
                <TextInput
                    label={t('form.title')}
                    {...register('title')}
                    readOnly
                    variant="filled"
                    mb="sm"
                />
            )}

            <Textarea label={t('form.description')} placeholder={t('form.placeholders.description')} {...register('description')} error={errors.description?.message} mb="sm" />

            <Group grow mb="sm">
                <TextInput type="date" label={t('form.appliedAt')} {...register('appliedAt')} error={errors.appliedAt?.message} />
                <TextInput type="date" label={t('form.nextDueAt')} {...register('nextDueAt')} />
            </Group>

            <Group grow mb="lg">
                <TextInput label={t('form.vetName')} {...register('vetName')} />
                <TextInput label={t('form.clinicName')} {...register('clinicName')} />
            </Group>

            <Button type="submit" fullWidth loading={isCreating}>{tCommon('save')}</Button>
        </form>
    );
}
