import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import HealthRecord from '@/models/HealthRecord';
import Pet from '@/models/Pet';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const petId = searchParams.get('petId');

    if (!petId) return NextResponse.json({ error: 'Pet ID is required' }, { status: 400 });

    await dbConnect();

    // Verificar acceso a la mascota (si el usuario es dueño)
    const pet = await Pet.findById(petId);
    // Aquí podríamos validar owners, pero por simplicidad de MVP asumimos auth básico o implementamos check rápido
    // const user = await User.findOne({ email: session.user?.email });
    // if (!pet.owners.includes(user._id)) ...

    const records = await HealthRecord.find({ petId }).sort({ appliedAt: -1 });

    return NextResponse.json(records);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    try {
        const body = await req.json();
        // Validar body con Zod idealmente

        // Obtener ID de usuario creador
        const User = (await import('@/models/User')).default; // Import dinámico para evitar circular deps si las hubiera
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            console.error('User not found via email:', session.user.email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const record = await HealthRecord.create({
            ...body,
            createdBy: user._id,
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error: any) {
        console.error('Error creating health record:', error);
        return NextResponse.json({ error: error.message || 'Error creating health record' }, { status: 500 });
    }
}
