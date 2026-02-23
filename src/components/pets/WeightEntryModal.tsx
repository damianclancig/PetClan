'use client';

import { Modal, Button, Group, Stack, Textarea, Text } from '@mantine/core';
import { WeightInput } from './form/WeightInput';
import { useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query'; // Or equivalent hook
import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('PetForm.weightModal');
    const tCommon = useTranslations('Common');
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
                    title: t('recordTitle'),
                    description: notes,
                    appliedAt: new Date(),
                    weightValue: Number(weight),
                }),
            });

            if (!res.ok) throw new Error('Failed to save weight');

            notifications.show({
                title: t('successTitle'),
                message: t('successMsg'),
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
                title: t('errorTitle'),
                message: t('errorMsg'),
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={t('title')} centered>
            <Stack>
                <Stack gap={5}>
                    <Text size="sm" fw={500}>{t('currentWeight')}</Text>
                    <WeightInput
                        value={weight}
                        onChange={setWeight}
                    />
                </Stack>

                <Textarea
                    label={t('notes')}
                    placeholder={t('notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.currentTarget.value)}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>{tCommon('cancel')}</Button>
                    <Button onClick={handleSubmit} loading={loading} disabled={!weight}>{tCommon('save')}</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
