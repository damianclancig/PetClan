'use client';

import { Timeline, Text, Group, Button, Modal, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { formatDate } from '@/lib/dateUtils';
import { useTranslations } from 'next-intl';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { sortHealthRecords } from '@/utils/recordUtils';
import { SmartHealthRecordModal } from './SmartHealthRecordModal';
import { IHealthRecord } from '@/models/HealthRecord';

interface HealthTimelineProps {
    petId: string;
    petSpecies?: string;
    petBirthDate?: Date;
    limit?: number;
    onViewAll?: () => void;
}

export function HealthTimeline({ petId, petSpecies, petBirthDate, limit, onViewAll }: HealthTimelineProps) {
    const { records, isLoading, createRecord, isCreating } = useHealthRecords(petId);
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('Health');

    // Sort records using centralized logic (DRY)
    const sortedRecords = sortHealthRecords(records as IHealthRecord[] || []);

    // Inject "Birth" event at the end (oldest)
    if (petBirthDate) {
        sortedRecords.push({
            _id: 'birth-event',
            type: 'birth_event' as any, // Cast to avoid TS issues if strict
            title: 'Nacimiento 🎉',
            description: '¡Bienvenido al mundo!',
            appliedAt: petBirthDate,
            petId: petId as any,
            createdBy: 'system' as any,
            createdAt: petBirthDate,
            version: 1
        });
    }

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
                {(limit ? sortedRecords.slice(0, limit) : sortedRecords).map((record: any) => {
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
                                record.type === 'birth_event' ? (
                                    <div style={{ fontSize: 16 }}>🎂</div>
                                ) : (
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            backgroundColor: isFuture ? 'var(--bg-surface)' : `var(--mantine-color-${identityColor}-6)`,
                                            border: `2px solid var(--mantine-color-${identityColor}-6)`,
                                        }}
                                    />
                                )
                            }
                            lineVariant={isFuture ? 'dashed' : 'solid'}
                        >
                            <Text c="dimmed" size="xs" mt={4}>{record.description}</Text>
                            <Group gap="xs" mt={4}>
                                <Badge size="xs" color={typeColor} variant="subtle">
                                    {record.type === 'birth_event' ? 'Hito' : t(`types.${record.type}`)}
                                </Badge>
                                <Text size="xs" c="dimmed">{formatDate(record.appliedAt)}</Text>
                            </Group>
                        </Timeline.Item>
                    );
                })}
            </Timeline>

            {limit && sortedRecords.length > limit && onViewAll && (
                <Button
                    variant="subtle"
                    size="sm"
                    fullWidth
                    mt="md"
                    onClick={onViewAll}
                >
                    Ver historial completo ({sortedRecords.length})
                </Button>
            )}

            <SmartHealthRecordModal
                opened={opened}
                onClose={close}
                petId={petId}
                petSpecies={petSpecies || 'dog'} // Fallback
                petBirthDate={petBirthDate || new Date()}
                existingRecords={records as IHealthRecord[] || []}
                createRecord={createRecord}
                isCreating={isCreating}
            />
        </>
    );
}
