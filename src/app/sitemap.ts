import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.vercel.app';
    const locales = ['es', 'en', 'pt'];
    const paths = [
        '/',
        '/login',
        '/terms',
        '/public/support' // Asumiendo que existe o se creará
    ];

    let sitemapEntries: MetadataRoute.Sitemap = [];

    // Generar entradas para cada locale y path
    locales.forEach(locale => {
        paths.forEach(path => {
            const pathWithLocale = path === '/' ? `/${locale}` : `/${locale}${path}`;
            sitemapEntries.push({
                url: `${baseUrl}${pathWithLocale}`,
                lastModified: new Date(),
                changeFrequency: path === '/' ? 'yearly' : 'monthly',
                priority: path === '/' ? 1 : 0.8,
            });
        });
    });

    // Agregar la raíz sin locale (que redirige al default)
    sitemapEntries.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    });

    return sitemapEntries;
}
