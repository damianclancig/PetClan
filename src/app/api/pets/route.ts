import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import HealthRecord from '@/models/HealthRecord';
import { getTranslations } from 'next-intl/server';

// Helper para extraer el locale del request
function getLocaleFromRequest(req: Request): string {
    const acceptLanguage = req.headers.get('Accept-Language') || '';
    const locale = acceptLanguage.split(',')[0]?.split('-')[0]?.trim();
    const supported = ['es', 'en', 'pt'];
    return supported.includes(locale) ? locale : 'es';
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Buscar usuario por email para obtener su ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    let filter: any = { owners: user._id };

    if (statusParam === 'all') {
        // No filter by status, return everything (historial)
    } else if (statusParam === 'history') {
        filter.status = { $in: ['deceased', 'archived'] };
    } else if (statusParam && ['active', 'lost', 'deceased', 'archived'].includes(statusParam)) {
        filter.status = statusParam;
    } else {
        // Default: active and lost (visible in dashboard)
        filter.status = { $in: ['active', 'lost'] };
    }

    // Buscar mascotas donde el usuario sea owner y cumplan el filtro de estado
    const pets = await Pet.find(filter).sort({ name: 1 });

    return NextResponse.json(pets);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const body = await req.json();
        // Aquí se debería validar con Zod, lo haremos en breve

        const petData: any = {
            ...body,
            owners: [user._id],
        };

        // If weight provides, set lastWeightUpdate
        if (body.weight) {
            petData.lastWeightUpdate = new Date();
        }

        const pet = await Pet.create(petData) as any;

        // If weight provided, create initial HealthRecord
        if (body.weight && body.weight > 0) {
            const locale = getLocaleFromRequest(req);
            const tForm = await getTranslations({ locale, namespace: 'PetForm' });
            await HealthRecord.create({
                petId: pet._id,
                type: 'weight',
                title: tForm('initialWeight'),
                appliedAt: new Date(),
                weightValue: body.weight,
                description: tForm('initialWeightDesc'),
                createdBy: user._id
            });
        }

        return NextResponse.json(pet, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating pet' }, { status: 500 });
    }
}
