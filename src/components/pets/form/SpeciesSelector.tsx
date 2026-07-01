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
