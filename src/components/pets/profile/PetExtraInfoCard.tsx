import { Paper, Title, Text, Group, Stack, ThemeIcon, SimpleGrid, Box } from '@mantine/core';
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
                <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {content}
                </Text>
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
        <Paper withBorder p="lg" radius="md" mt="md">
            <Title order={4} mb="lg">{t('title')}</Title>

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
