import { SimpleGrid, Paper, ThemeIcon, Text } from '@mantine/core';
import { IconDog, IconCat, IconPaw } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface SpeciesSelectorProps {
    value: string;
    onChange: (value: 'dog' | 'cat' | 'other') => void;
}

export function SpeciesSelector({ value, onChange }: SpeciesSelectorProps) {
    const tCommon = useTranslations('Common');

    return (
        <SimpleGrid cols={3} spacing="xs" w="100%">
            {[
                { value: 'dog', label: tCommon('species.dog').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim(), icon: <IconDog size={24} /> },
                { value: 'cat', label: tCommon('species.cat').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim(), icon: <IconCat size={24} /> },
                { value: 'other', label: tCommon('species.other').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim(), icon: <IconPaw size={24} /> },
            ].map((item) => {
                const isSelected = value === item.value;
                return (
                    <Paper
                        key={item.value}
                        component="button"
                        type="button"
                        onClick={() => onChange(item.value as 'dog' | 'cat' | 'other')}
                        p="xs"
                        radius="md"
                        withBorder
                        style={{
                            width: '100%',
                            height: 85,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'var(--mantine-color-cyan-0)' : 'transparent',
                            borderColor: isSelected ? 'var(--mantine-color-cyan-5)' : 'var(--mantine-color-gray-3)',
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <ThemeIcon
                            size={32}
                            radius="xl"
                            variant={isSelected ? 'filled' : 'light'}
                            color={isSelected ? 'cyan' : 'gray'}
                        >
                            {item.icon}
                        </ThemeIcon>
                        <Text size="xs" mt={4} fw={700} c={isSelected ? 'cyan.8' : 'dimmed'}>
                            {item.label}
                        </Text>
                    </Paper>
                );
            })}
        </SimpleGrid>
    );
}
