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

import { Button, Container, Title, Text, Stack } from '@mantine/core';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function DashboardNotFound() {
    const t = useTranslations('Errors.NotFound');

    return (
        <Container
            size="lg"
            style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Stack align="center" gap="xl">
                <div style={{ position: 'relative', width: '100%', maxWidth: 400, aspectRatio: '4/3' }}>
                    <Image
                        src="/assets/images/404.png"
                        alt="404"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                <Title order={1} size="h2" ta="center">
                    {t('title')}
                </Title>

                <Text c="dimmed" size="lg" ta="center" maw={500}>
                    {t('description')}
                </Text>

                <Button component={Link} href="/dashboard" size="lg" variant="light" color="teal">
                    {t('backDashboard')}
                </Button>
            </Stack>
        </Container>
    );
}
