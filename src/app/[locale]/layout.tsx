import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';
import { Metadata } from 'next';
import { inter, poppins } from '@/styles/fonts';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/globals.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.clancig.com.ar';

    const languages: Record<string, string> = {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        pt: `${baseUrl}/pt`,
    };

    return {
        title: {
            template: '%s | PetClan',
            default: 'PetClan - Libreta Sanitaria Digital',
        },
        description: 'Gestiona la salud de tus mascotas de forma fácil y segura. Historial de vacunas, recordatorios y más.',
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/${locale}`,
            languages,
        },
        icons: {
            icon: [
                { url: '/assets/logo-icon.png', sizes: '32x32' },
                { url: '/assets/logo-icon.png', sizes: '192x192' },
            ],
            shortcut: '/assets/logo-icon.png',
            apple: '/assets/logo-icon.png',
        },
        manifest: '/manifest.json',
        openGraph: {
            title: 'PetClan',
            description: 'Libreta Sanitaria Digital para tus mascotas. Historial clínico, recordatorios de vacunas y más.',
            url: `/${locale}`,
            siteName: 'PetClan',
            locale: locale === 'en' ? 'en_US' : locale === 'pt' ? 'pt_BR' : 'es_AR',
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
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

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
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <Providers messages={messages} locale={locale}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
