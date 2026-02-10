'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import '@mantine/notifications/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <Notifications />
                    <ModalsProvider>
                        {children}
                    </ModalsProvider>
                </MantineProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
