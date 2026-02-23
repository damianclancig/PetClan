import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.clancig.com.ar';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/api/',
                '/_next/',
                '/static/',
                '/*.json$',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
