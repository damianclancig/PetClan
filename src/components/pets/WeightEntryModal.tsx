'use client';

import { Modal, NumberInput, Button, Group, Stack, Textarea } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query'; // Or equivalent hook
import { useState } from 'react';

interface WeightEntryModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    currentWeight?: number;
}

export function WeightEntryModal({ opened, onClose, petId, currentWeight }: WeightEntryModalProps) {
    const [loading, setLoading] = useState(false);
    const [weight, setWeight] = useState<number | string>(currentWeight || '');
    const [notes, setNotes] = useState('');
    // const queryClient = useQueryClient(); // If using react-query context

    const handleSubmit = async () => {
        if (!weight) return;

        setLoading(true);
        try {
            const res = await fetch('/api/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    petId,
                    type: 'weight',
                    title: 'Control de Peso',
                    description: notes,
                    appliedAt: new Date(),
                    weightValue: Number(weight),
                }),
            });

            if (!res.ok) throw new Error('Failed to save weight');

            notifications.show({
                title: 'Peso registrado',
                message: 'El peso se ha actualizado correctamente.',
                color: 'green',
            });

            // Invalidate queries or refresh page
            // queryClient.invalidateQueries({ queryKey: ['pet', petId] });
            // For now simple reload or callback could work, but using window.location.reload is eager.
            // Better to rely on parent to refresh data.
            window.location.reload(); // Temporary simple fix until query invalidation is passed

            onClose();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo guardar el peso.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Registrar Peso ⚖️" centered>
            <Stack>
                <NumberInput
                    label="Peso Actual (kg)"
                    placeholder="Ej: 12.5"
                    value={weight}
                    onChange={setWeight}
                    min={0}
                    step={0.1}
                    decimalScale={2}
                    data-autofocus
                />

                <Textarea
                    label="Notas (Opcional)"
                    placeholder="Ej: Después de comer..."
                    value={notes}
                    onChange={(e) => setNotes(e.currentTarget.value)}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} loading={loading} disabled={!weight}>Guardar</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
