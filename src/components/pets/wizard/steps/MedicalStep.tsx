'use client';

import { Stack, Text, Textarea } from '@mantine/core';
import { useFormContext } from 'react-hook-form';

export default function MedicalStep() {
    const { register, watch, formState: { errors } } = useFormContext();
    const name = watch('name');

    return (
        <Stack gap="sm">
            <Text size="md" fw={700} ta="center">Antecedentes Médicos de {name}</Text>
            <Text size="sm" c="dimmed" ta="center" mb="sm">
                Esta información es opcional, pero ayuda a mantener un mejor historial.
            </Text>

            <Textarea
                label="Enfermedades Preexistentes"
                placeholder="Ej. Alergia al pollo, Displasia de cadera..."
                minRows={3}
                radius="md"
                {...register('diseases')}
            />

            <Textarea
                label="Tratamientos en Curso"
                placeholder="Ej. Medicación diaria, Fisioterapia..."
                minRows={3}
                radius="md"
                {...register('treatments')}
            />

            <Textarea
                label="Notas Adicionales"
                placeholder="Cualquier otro detalle importante..."
                minRows={3}
                radius="md"
                {...register('notes')}
            />
        </Stack>
    );
}
