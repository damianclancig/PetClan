'use client';

import { TextInput, NumberInput, Select, Button, Group, Title, Container, Paper } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePets } from '@/hooks/usePets';
import { useRouter } from '@/i18n/routing'; // Use translated router
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

// Type definition stays outside
type PetFormValues = {
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed: string;
    birthDate: string;
    sex: 'male' | 'female';
    weight: number;
    chipId?: string;
};

export default function NewPetPage() {
    const { createPet, isCreating } = usePets();
    const router = useRouter();
    const t = useTranslations('NewPet');
    const tCommon = useTranslations('Common');
    const tValidation = useTranslations('Validation');

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
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PetFormValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            species: 'dog',
            sex: 'male',
        },
    });

    const onSubmit = async (data: PetFormValues) => {
        try {
            await createPet(data);
            router.push('/dashboard/pets');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container size="sm">
            <Title order={2} mb="xl">{t('title')}</Title>
            <Paper withBorder shadow="md" p={30} radius="md">
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            defaultValue="dog"
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
                            defaultValue="male"
                            onChange={(val) => setValue('sex', val as 'male' | 'female')}
                            error={errors.sex?.message}
                        />
                    </Group>

                    <NumberInput
                        label={t('weight')}
                        placeholder="5.5"
                        min={0}
                        step={0.1}
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
                        <Button type="submit" loading={isCreating} color="cyan">{t('submit')}</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}
