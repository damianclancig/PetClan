'use client';

import { Paper, Text, Group, ActionIcon, Title, Stack, Collapse, Button, ThemeIcon } from '@mantine/core';
import { IconScale, IconPlus, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useState } from 'react';
import { WeightEntryModal } from './WeightEntryModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';

interface WeightRecord {
    date: string; // ISO or formatted
    weight: number;
}

interface WeightControlProps {
    petId: string;
    currentWeight: number;
    history: any[]; // Raw health records filtered by type='weight'
}

export function WeightControl({ petId, currentWeight, history }: WeightControlProps) {
    const t = useTranslations('PetDetail.WeightControl');
    const tSummary = useTranslations('PetDetail.Summary');
    const [opened, { open, close }] = useDisclosure(false);
    const [showHistory, { toggle }] = useDisclosure(false);

    // Process history for chart
    // Sort by date ascending
    const data = history
        .map(h => ({
            date: new Date(h.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            timestamp: new Date(h.appliedAt).getTime(),
            weight: h.weightValue || 0
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    // Add current weight if logical (e.g. if last record is old)
    // Actually currentWeight comes from Pet model, which is updated by api. 
    // Data source 'history' comes from HealthRecords.

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="xs">
                <Group gap="xs">
                    <ThemeIcon color="blue" variant="light" size="lg">
                        <IconScale size={20} />
                    </ThemeIcon>
                    <div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t('title')}</Text>
                        <Text fw={700} size="xl">{currentWeight} kg</Text>
                    </div>
                </Group>
                <ActionIcon variant="light" color="blue" size="lg" onClick={open} radius="xl">
                    <IconPlus size={20} />
                </ActionIcon>
            </Group>

            {data.length > 1 && (
                <div style={{ height: 160, marginTop: 10, marginBottom: 10 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#228be6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#228be6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={['auto', 'auto']} fontSize={12} tickLine={false} axisLine={false} unit="kg" hide />
                            <Tooltip
                                labelStyle={{ color: 'black' }}
                                itemStyle={{ color: '#228be6' }}
                                formatter={(value: number | undefined) => [`${value ?? 0} kg`, tSummary('weightTitle')]}
                            />
                            <Area type="monotone" dataKey="weight" stroke="#228be6" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            <Button
                variant="subtle"
                size="xs"
                fullWidth
                onClick={toggle}
                rightSection={showHistory ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                mt="xs"
            >
                {showHistory ? t('hideHistory') : t('showHistory')}
            </Button>

            <Collapse in={showHistory}>
                <Stack gap="xs" mt="md">
                    {data.slice().reverse().map((record, i) => (
                        <Group key={i} justify="space-between" py="xs" style={{ borderBottom: '1px solid #eee' }}>
                            <Text size="sm">{record.date}</Text>
                            <Text size="sm" fw={600}>{record.weight} kg</Text>
                        </Group>
                    ))}
                    {data.length === 0 && <Text size="sm" c="dimmed" ta="center">{t('noPrevious')}</Text>}
                </Stack>
            </Collapse>

            <WeightEntryModal
                opened={opened}
                onClose={close}
                petId={petId}
                currentWeight={currentWeight}
            />
        </Paper>
    );
}
