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
import { Providers } from '@/components/providers/Providers';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import esMessages from '../../messages/es.json';

function NotFoundContent() {
    const t = useTranslations('Errors.NotFound');
    return (
        <Container className="h-screen flex items-center justify-center" size="lg">
            <Stack align="center" gap="xl">
                <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                    <Image
                        src="/assets/images/error-404.webp"
                        alt="404 - Not Found"
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

                <Button component="a" href="/dashboard" size="lg" variant="light" color="teal">
                    {t('button')}
                </Button>
            </Stack>
        </Container>
    );
}

export default function NotFound() {
    return (
        <Providers messages={esMessages} locale="es">
            <NotFoundContent />
        </Providers>
    );
}
