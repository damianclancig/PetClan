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
    icons: {
        icon: '/assets/logo-icon.png',
        shortcut: '/assets/logo-icon.png',
        apple: '/assets/logo-icon.png',
    },
    openGraph: {
        title: 'PetClan',
        description: 'Libreta Sanitaria Digital para tus mascotas. Historial clínico, recordatorios de vacunas y más.',
        url: '/',
        siteName: 'PetClan',
        locale: 'es_AR',
        type: 'website',
        images: [
            {
                url: 'https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png',
                width: 1200,
                height: 630,
                alt: 'PetClan - Libreta Sanitaria Digital',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PetClan',
        description: 'Libreta Sanitaria Digital para tus mascotas. Gestiona su salud de forma fácil y segura.',
        images: ['https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png'],
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
