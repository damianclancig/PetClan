'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { NextIntlClientProvider } from 'next-intl';
import { theme } from '@/styles/theme';
import { useState } from 'react';

export function Providers({
    children,
    messages,
    locale
}: {
    children: React.ReactNode;
    messages: any;
    locale: string;
}) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <Notifications />
            <ModalsProvider>
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                    timeZone="America/Argentina/Buenos_Aires"
                >
                    <SessionProvider>
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </SessionProvider>
                </NextIntlClientProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}
