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

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (isProtected) {
        if (!token) {
            // Usuario no autenticado: Redirigir a login con el locale correcto
            const url = new URL(`/${locale}/login`, req.url);
            url.searchParams.set('callbackUrl', pathname); // Guardar URL original para redirección posterior
            return NextResponse.redirect(url);
        }
    }

    // Si el usuario está autenticado e intenta acceder a la landing page o login,
    // redirigir directamente al dashboard para una experiencia más fluida.
    if ((pathWithoutLocale === '/' || pathWithoutLocale === '/login') && token) {
        const url = new URL(`/${locale}/dashboard`, req.url);
        return NextResponse.redirect(url);
    }

    // Continuar con el manejo de i18n (redirecciones de locale, reescrituras, etc.)
    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
