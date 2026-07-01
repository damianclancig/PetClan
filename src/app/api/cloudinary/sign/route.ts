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
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiSecret) {
            return NextResponse.json({ error: 'Falta configuración de Cloudinary' }, { status: 500 });
        }

        // Ordenar parámetros alfabéticamente
        const sortedParams = Object.keys(paramsToSign)
            .sort()
            .map((key) => `${key}=${paramsToSign[key]}`)
            .join('&');

        // Generar firma SHA-1
        const signature = crypto
            .createHash('sha1')
            .update(sortedParams + apiSecret)
            .digest('hex');

        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Error signing Cloudinary params:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
