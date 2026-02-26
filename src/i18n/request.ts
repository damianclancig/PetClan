import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Check that the incoming `locale` is valid
    let locale = await requestLocale;

    // Ensure that the incoming `locale` is valid
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale: locale as string,
        messages: (await import(`../../messages/${locale}.json`)).default,
        timeZone: 'America/Argentina/Buenos_Aires'
    };
});
