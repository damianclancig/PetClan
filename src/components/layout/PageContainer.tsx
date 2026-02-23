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
