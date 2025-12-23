'use client';

import { Timeline, Text, Group, Button, Modal, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { formatDate } from '@/lib/dateUtils';
import { useTranslations } from 'next-intl';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { sortHealthRecords } from '@/utils/recordUtils';
import { HealthRecordForm } from './HealthRecordForm';
import { IHealthRecord } from '@/models/HealthRecord';

export function HealthTimeline({ petId }: { petId: string }) {
    const { records, isLoading, createRecord, isCreating } = useHealthRecords(petId);
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('Health');

    // Sort records using centralized logic (DRY)
    const sortedRecords = sortHealthRecords(records as IHealthRecord[] || []);
    const identityColor = getPetIdentityColor(petId);

    if (isLoading) return <Text>{t('loading')}</Text>;

    return (
        <>
            <Group justify="space-between" mb="lg">
                <Text size="lg" fw={500}>{t('title')}</Text>
                <Button onClick={open} size="xs" variant="light" color={identityColor}>{t('addRecord')}</Button>
            </Group>

            {(!sortedRecords || sortedRecords.length === 0) && <Text c="dimmed">{t('noRecords')}</Text>}

            <Timeline active={-1} bulletSize={32} lineWidth={2} color={identityColor}>
                {sortedRecords.map((record) => {
                    const isFuture = new Date(record.appliedAt) > new Date();
                    const typeColor = record.type === 'vaccine' ? 'blue' : record.type === 'deworming' ? 'green' : 'gray';

                    return (
                        <Timeline.Item
                            key={record._id?.toString()}
                            title={
                                <Text size="sm" fw={600} c={isFuture ? 'dimmed' : undefined}>
                                    {record.title}
                                </Text>
                            }
                            bullet={
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: isFuture ? 'var(--bg-surface)' : `var(--mantine-color-${identityColor}-6)`,
                                        border: `2px solid var(--mantine-color-${identityColor}-6)`,
                                    }}
                                />
                            }
                            lineVariant={isFuture ? 'dashed' : 'solid'}
                        >
                            <Text c="dimmed" size="xs" mt={4}>{record.description}</Text>
                            <Group gap="xs" mt={4}>
                                <Badge size="xs" color={typeColor} variant="subtle">
                                    {t(`types.${record.type}`)}
                                </Badge>
                                <Text size="xs" c="dimmed">{formatDate(record.appliedAt)}</Text>
                            </Group>
                        </Timeline.Item>
                    );
                })}
            </Timeline>

            <Modal opened={opened} onClose={close} title={t('newRecordTitle')}>
                <HealthRecordForm
                    petId={petId}
                    createRecord={createRecord}
                    isCreating={isCreating}
                    onSubmitSuccess={close}
                />
            </Modal>
        </>
    );
}
