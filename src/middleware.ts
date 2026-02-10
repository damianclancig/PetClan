import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Ignorar archivos estáticos y API (ya manejado por matcher, pero doble seguridad)
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Detectar locale actual
    const segments = pathname.split('/');
    const possibleLocale = segments[1];
    const isLocalePresent = routing.locales.includes(possibleLocale as any);
    const locale = isLocalePresent ? possibleLocale : routing.defaultLocale;

    // Normalizar path sin locale para verificar rutas protegidas
    const pathWithoutLocale = isLocalePresent
        ? '/' + segments.slice(2).join('/')
        : pathname;

    // Verificar si es ruta protegida (/dashboard)
    const isProtected = pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/');

    if (isProtected) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            // Usuario no autenticado: Redirigir a login con el locale correcto
            const url = new URL(`/${locale}/login`, req.url);
            url.searchParams.set('callbackUrl', pathname); // Guardar URL original para redirección posterior
            return NextResponse.redirect(url);
        }
    }

    // Continuar con el manejo de i18n (redirecciones de locale, reescrituras, etc.)
    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
