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
