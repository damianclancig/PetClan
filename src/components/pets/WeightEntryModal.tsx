/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Modal, Button, Group, Stack, Textarea, Text } from '@mantine/core';
import { WeightInput } from './form/WeightInput';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { useHealthRecords } from '@/hooks/useHealthRecords';

interface WeightEntryModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    currentWeight?: number;
}

export function WeightEntryModal({ opened, onClose, petId, currentWeight }: WeightEntryModalProps) {
    const { createRecord, isCreating } = useHealthRecords(petId);
    const [weight, setWeight] = useState<number | string>(currentWeight || '');
    const [notes, setNotes] = useState('');
    const t = useTranslations('PetForm.weightModal');
    const tCommon = useTranslations('Common');

    useEffect(() => {
        if (opened && currentWeight !== undefined) {
            setWeight(currentWeight);
        }
    }, [opened, currentWeight]);

    const handleSubmit = async () => {
        if (!weight) return;

        try {
            await createRecord({
                petId,
                type: 'weight',
                title: t('recordTitle'),
                description: notes,
                appliedAt: dayjs().format('YYYY-MM-DD'),
                weightValue: Number(weight),
            });

            notifications.show({
                title: t('successTitle'),
                message: t('successMsg'),
                color: 'green',
            });

            setNotes('');
            onClose();
        } catch (error) {
            notifications.show({
                title: t('errorTitle'),
                message: t('errorMsg'),
                color: 'red',
            });
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
                    <Button onClick={handleSubmit} loading={isCreating} disabled={!weight}>{tCommon('save')}</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
