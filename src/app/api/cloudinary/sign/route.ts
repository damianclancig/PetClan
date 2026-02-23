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
