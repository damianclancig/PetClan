import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@/styles/globals.css';
import { inter, poppins } from '@/styles/fonts';
import { Providers } from '@/components/providers/Providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | PetClan',
        default: 'PetClan - Libreta Sanitaria Digital',
    },
    description: 'Gestiona la salud de tus mascotas de forma fácil y segura. Historial de vacunas, recordatorios y más.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.vercel.app'),
    openGraph: {
        title: 'PetClan',
        description: 'Libreta Sanitaria Digital para tus mascotas.',
        url: '/',
        siteName: 'PetClan',
        locale: 'es_AR',
        type: 'website',
    },
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // for error boundary handling and fallback.
    // In a real app we might pick only the needed ones.
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        {children}
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
