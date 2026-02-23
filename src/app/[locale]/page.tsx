import { LandingPage } from '@/components/landing/LandingPage';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Landing' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
    };
}

export default async function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'PetClan',
        'operatingSystem': 'Web',
        'applicationCategory': 'HealthApplication',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
        },
        'description': 'PetClan es la libreta sanitaria digital completa para llevar el control de vacunas, peso, desparasitaciones y más.',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LandingPage />
        </>
    );
}

