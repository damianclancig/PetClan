import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await dbConnect();
    const pet = await Pet.findById(id);

    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    return NextResponse.json(pet);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await dbConnect();
    const body = await req.json();
    const pet = await Pet.findByIdAndUpdate(id, body, { new: true });

    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    return NextResponse.json(pet);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await dbConnect();
    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    return NextResponse.json({ message: 'Pet deleted successfully' });
}
