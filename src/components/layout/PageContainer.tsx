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

import { Container, Group, Title, Box } from '@mantine/core';
import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    title?: string | ReactNode;
    action?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
}

export function PageContainer({ children, title, action, size = 'xl' }: PageContainerProps) {
    return (
        <Container size={size} py={{ base: 'sm', sm: 'lg' }} px={{ base: 'xs', sm: 'md' }}>
            {(title || action) && (
                <Group justify="space-between" mb="lg" align="center">
                    {title && (
                        typeof title === 'string' ? (
                            <Title order={2}>{title}</Title>
                        ) : (
                            <Box>{title}</Box>
                        )
                    )}
                    {action && <Box>{action}</Box>}
                </Group>
            )}
            {children}
        </Container>
    );
}
