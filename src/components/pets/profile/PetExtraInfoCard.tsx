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

import { Paper, Title, Text, Group, Stack, ThemeIcon, SimpleGrid, Box } from '@mantine/core';
import { LinkifiedText } from '@/components/ui/LinkifiedText';
import { IconNotes, IconFirstAidKit, IconStethoscope, IconPaw } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface PetExtraInfoCardProps {
    pet: any;
}

function InfoRow({ icon: Icon, color, title, content }: { icon: any, color: string, title: string, content: string }) {
    if (!content) return null;

    return (
        <Group align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" color={color} size="xl" radius="md" style={{ flexShrink: 0 }}>
                <Icon size={24} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
                <Text size="xs" tt="uppercase" c="dimmed" fw={700} mb={4}>
                    {title}
                </Text>
                <LinkifiedText size="sm" style={{ lineHeight: 1.5 }} text={content} />
            </Box>
        </Group>
    );
}

export function PetExtraInfoCard({ pet }: PetExtraInfoCardProps) {
    const t = useTranslations('PetDetail.ExtraInfo');
    const hasCharacteristics = !!pet.characteristics;
    const hasDiseases = !!pet.diseases;
    const hasTreatments = !!pet.treatments;
    const hasNotes = !!pet.keywords || !!pet.notes;

    const hasInfo = hasCharacteristics || hasDiseases || hasTreatments || hasNotes;

    if (!hasInfo) return null;

    return (
        <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">{t('title')}</Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={32} verticalSpacing="xl">
                {hasCharacteristics && (
                    <InfoRow
                        icon={IconPaw}
                        color="orange"
                        title={t('characteristics')}
                        content={pet.characteristics}
                    />
                )}

                {hasDiseases && (
                    <InfoRow
                        icon={IconStethoscope}
                        color="red"
                        title={t('diseases')}
                        content={pet.diseases}
                    />
                )}

                {hasTreatments && (
                    <InfoRow
                        icon={IconFirstAidKit}
                        color="blue"
                        title={t('treatments')}
                        content={pet.treatments}
                    />
                )}

                {(pet.notes || pet.keywords) && (
                    <InfoRow
                        icon={IconNotes}
                        color="gray"
                        title={t('notes')}
                        content={[pet.notes, pet.keywords].filter(Boolean).join('\n')}
                    />
                )}
            </SimpleGrid>
        </Paper>
    );
}
