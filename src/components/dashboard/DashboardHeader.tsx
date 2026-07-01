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

'use client';

import { Group, Stack, Text, Title, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useTranslations, useFormatter } from 'next-intl';

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const t = useTranslations('DashboardView.Header');
    const format = useFormatter();
    const now = new Date();

    // next-intl formatter for "lunes, 15 de abril" or "Monday, April 15"
    const today = format.dateTime(now, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <Box mb={{ base: 'md', sm: 'xl' }}>
            <Group justify="space-between" align="flex-end">
                <Stack gap={0}>
                    <Text size="sm" c="dimmed" tt="capitalize">
                        {today}
                    </Text>
                    <Title order={2} style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                        {t('greeting')} <Text span c="teal" inherit>{userName}</Text>
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        {t('summary')}
                    </Text>
                </Stack>
            </Group>
        </Box>
    );
}
