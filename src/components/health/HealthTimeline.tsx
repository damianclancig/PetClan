'use client';

import { Timeline, Text, Group, Paper, Badge, Button, Modal, Select, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useHealthRecords } from '@/hooks/useHealthRecords';
// import { IconVaccine, IconStethoscope, IconBug } from '@tabler/icons-react'; // Si tuviéramos iconos
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { formatDate, formatDateForInput, now } from '@/lib/dateUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

// Types definition outside
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

export function HealthTimeline({ petId }: { petId: string }) {
    const { records, isLoading, createRecord, isCreating } = useHealthRecords(petId);
    const [opened, { open, close }] = useDisclosure(false);
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

            close();
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

    if (isLoading) return <Text>{t('loading')}</Text>;

    return (
        <>
            <Group justify="space-between" mb="lg">
                <Text size="lg" fw={500}>{t('title')}</Text>
                <Button onClick={open} size="xs" variant="light">{t('addRecord')}</Button>
            </Group>

            {(!records || records.length === 0) && <Text c="dimmed">{t('noRecords')}</Text>}

            <Timeline active={-1} bulletSize={24} lineWidth={2}>
                {records?.map((record: any) => (
                    <Timeline.Item
                        key={record._id}
                        title={record.title}
                        bullet={
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        }
                    >
                        <Text c="dimmed" size="sm">{record.description}</Text>
                        <Group gap="xs" mt={4}>
                            <Badge size="xs" color={record.type === 'vaccine' ? 'blue' : record.type === 'deworming' ? 'green' : 'gray'}>
                                {t(`types.${record.type}`)}
                            </Badge>
                            <Text size="xs" c="dimmed">{formatDate(record.appliedAt)}</Text>
                        </Group>
                    </Timeline.Item>
                ))}
            </Timeline>

            <Modal opened={opened} onClose={close} title={t('newRecordTitle')}>
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
                                { value: 'sextuple', label: 'Séxtuple' },
                                { value: 'quintuple', label: 'Quíntuple' },
                                { value: 'triple', label: 'Triple Felina/Canina' },
                                { value: 'antirabica', label: 'Antirábica' },
                                { value: 'other', label: 'Otra' }
                            ]}
                            onChange={(val) => {
                                setValue('vaccineType', val || undefined);
                                if (val && val !== 'other') {
                                    // Map value to label for title
                                    const labels: Record<string, string> = {
                                        'sextuple': 'Vacuna Séxtuple',
                                        'quintuple': 'Vacuna Quíntuple',
                                        'triple': 'Vacuna Triple',
                                        'antirabica': 'Vacuna Antirábica'
                                    };
                                    setValue('title', labels[val]);
                                } else if (val === 'other') {
                                    setValue('title', '');
                                }
                            }}
                            mb="sm"
                        />
                    )}

                    {/* Show title input if NOT vaccine, OR if vaccine type is OTHER or undefined (so user can type custom title) */}
                    {(watch('type') !== 'vaccine' || watch('vaccineType') === 'other') && (
                        <TextInput
                            label={t('form.title')}
                            placeholder={t('form.placeholders.title')}
                            {...register('title')}
                            error={errors.title?.message}
                            mb="sm"
                        />
                    )}

                    {/* If vaccine type is selected and is NOT other, we render a hidden or read-only input just to verify user sees what's being saved, 
                        or better yet, just show it as disabled input if we want clarity. 
                        Let's stick to hiding the text input and letting the Select logic handle setValue('title'). 
                    */}
                    {watch('type') === 'vaccine' && watch('vaccineType') && watch('vaccineType') !== 'other' && (
                        <TextInput
                            label={t('form.title')}
                            {...register('title')}
                            readOnly
                            variant="filled" // Visual cue it's auto-filled
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
            </Modal>
        </>
    );
}
