import { Group, Paper, Stack, ThemeIcon, Text } from '@mantine/core';
import { IconGenderMale, IconGenderFemale } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface SexSelectorProps {
    value: string;
    onChange: (value: 'male' | 'female') => void;
}

export function SexSelector({ value, onChange }: SexSelectorProps) {
    const tCommon = useTranslations('Common');

    return (
        <Group justify="center" gap="lg" grow>
            {[
                { value: 'male', label: tCommon('sex.male'), icon: <IconGenderMale size={24} />, color: 'blue' },
                { value: 'female', label: tCommon('sex.female'), icon: <IconGenderFemale size={24} />, color: 'pink' }
            ].map((option) => {
                const isSelected = value === option.value;
                return (
                    <Paper
                        key={option.value}
                        component="button"
                        type="button"
                        onClick={() => onChange(option.value as 'male' | 'female')}
                        p="sm"
                        radius="md"
                        withBorder
                        style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? `var(--mantine-color-${option.color}-0)` : 'transparent',
                            borderColor: isSelected ? `var(--mantine-color-${option.color}-5)` : 'var(--mantine-color-gray-3)',
                            borderWidth: isSelected ? 2 : 1,
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            flex: 1
                        }}
                    >
                        <Stack align="center" gap={4}>
                            <ThemeIcon
                                size={36}
                                radius="xl"
                                variant={isSelected ? 'filled' : 'light'}
                                color={option.color}
                            >
                                {option.icon}
                            </ThemeIcon>
                            <Text size="sm" fw={700} c={isSelected ? `${option.color}.8` : 'dimmed'}>
                                {option.label}
                            </Text>
                        </Stack>
                    </Paper>
                );
            })}
        </Group>
    );
}
