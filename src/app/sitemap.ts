/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.clancig.com.ar';
    const locales = ['es', 'en', 'pt'];
    const paths = [
        '/',
        '/login',
        '/terms',
        '/privacy-policy',
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
