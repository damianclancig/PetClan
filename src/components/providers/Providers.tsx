'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/styles/theme';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme}>
                    {children}
                </MantineProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
