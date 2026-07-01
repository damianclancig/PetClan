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

import { useEffect } from 'react';
import { Button, Container, Title, Text, Stack, Group } from '@mantine/core';
import Image from 'next/image';
import { Providers } from '@/components/providers/Providers';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import esMessages from '../../messages/es.json';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Catastrophic Root Layout Exception Captured:', error);
        }
    }, [error]);

    const { title, description, button, backHome } = esMessages.Errors.ServerError;

    return (
        <html lang="es">
            <body>
                <Providers messages={esMessages} locale="es">
                    <Container className="h-screen flex items-center justify-center" size="lg">
                        <Stack align="center" gap="xl">
                            <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '4/3' }}>
                                <Image
                                    src="/assets/images/error-500.webp"
                                    alt="500 - Fatal Error"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>

                            <Title order={1} size="h2" ta="center">
                                {title}
                            </Title>

                            <Text c="dimmed" size="lg" ta="center" maw={500}>
                                {description}
                            </Text>

                            <Group>
                                <Button onClick={reset} size="lg" variant="filled" color="teal">
                                    {button}
                                </Button>
                                <Button component="a" href="/dashboard" size="lg" variant="light" color="gray">
                                    {backHome}
                                </Button>
                            </Group>
                        </Stack>
                    </Container>
                </Providers>
            </body>
        </html>
    );
}
