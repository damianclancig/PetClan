import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';

export async function GET() {
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

    // Buscar mascotas donde el usuario sea owner
    const pets = await Pet.find({ owners: user._id }).sort({ createdAt: -1 });

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

        const pet = await Pet.create({
            ...body,
            owners: [user._id],
        });

        return NextResponse.json(pet, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating pet' }, { status: 500 });
    }
}
