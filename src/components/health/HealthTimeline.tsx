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
import { HealthTimelineSkeleton } from '@/components/ui/Skeletons';

interface HealthTimelineProps {
    petId: string;
    petSpecies?: string;
    petBirthDate?: Date;
    petDeathDate?: Date | string; // Enable death date prop
    limit?: number;
    onViewAll?: () => void;
    onAddRecord?: () => void;
    readOnly?: boolean;
}

export function HealthTimeline({ petId, petSpecies, petBirthDate, petDeathDate, limit, onViewAll, onAddRecord, readOnly = false }: HealthTimelineProps) {
    const { records, isLoading, createRecord, isCreating } = useHealthRecords(petId);
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('Health');
    const identityColor = getPetIdentityColor(petId);

    // Sort records using centralized logic (DRY)
    const sortedRecords = sortHealthRecords(records as IHealthRecord[] || []);

    // Inject "Death" event if exists (most recent usually)
    if (petDeathDate) {
        const deathDateObj = new Date(petDeathDate);
        sortedRecords.unshift({
            _id: 'death-event',
            type: 'death_event' as any,
            title: t('Timeline.deathTitle'),
            description: t('Timeline.deathDesc'),
            appliedAt: deathDateObj,
            petId: petId as any,
            createdBy: 'system' as any,
            createdAt: deathDateObj,
            version: 1,
            isSystemEvent: true
        } as any);

        // Re-sort to ensure correct order if other records happen to be "future" relative to death (unlikely but possible if scheduled)
        // Actually, sortHealthRecords sorts descending by appliedAt. 
        // If we just unshift, it might be out of order if there are future scheduled vaccines.
        // It is safer to push and re-sort, OR rely on it being the "final" event effectively.
        // Let's rely on standard sort to be safe:
        sortedRecords.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    }

    // Inject "Birth" event at the end (oldest)
    if (petBirthDate) {
        sortedRecords.push({
            _id: 'birth-event',
            type: 'birth_event' as any, // Cast to avoid TS issues if strict
            title: t('Timeline.birthTitle'),
            description: t('Timeline.birthDesc'),
            appliedAt: petBirthDate,
            petId: petId as any,
            createdBy: 'system' as any,
            createdAt: petBirthDate,
            version: 1
        });
        // Ensure birth is last
        sortedRecords.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    }

    if (isLoading) return <HealthTimelineSkeleton />;

    const handleAdd = () => {
        if (readOnly) return;
        if (onAddRecord) {
            onAddRecord();
        } else {
            open();
        }
    };

    // ...

    return (
        <>
            <Group justify="space-between" mb="lg">
                <Text size="lg" fw={500}>{t('title')}</Text>
                {!readOnly && (
                    <Button onClick={handleAdd} size="xs" variant="light" color={identityColor}>{t('Timeline.update')}</Button>
                )}
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
                                ) : record.type === 'death_event' ? (
                                    <div style={{ fontSize: 16 }}>🕊️</div>
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
                            {record.type === 'weight' && record.weightValue && (
                                <Text size="xs" fw={600} c={identityColor}>
                                    {record.weightValue} kg
                                </Text>
                            )}
                            <Group gap="xs" mt={4}>
                                <Badge size="xs" color={typeColor} variant="subtle">
                                    {(record.type === 'birth_event' || record.type === 'death_event') ? t('Timeline.milestone') : t(`types.${record.type}`)}
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
                    {t('Timeline.viewAll', { count: sortedRecords.length })}
                </Button>
            )}

            {/* Only render internal modal if NO external handler provided */}
            {!onAddRecord && (
                <SmartHealthRecordModal
                    opened={opened}
                    onClose={close}
                    petId={petId}
                    petSpecies={petSpecies || 'dog'}
                    petBirthDate={petBirthDate || new Date()}
                    existingRecords={records as IHealthRecord[] || []}
                    createRecord={createRecord}
                    isCreating={isCreating}
                />
            )}
        </>
    );
}
