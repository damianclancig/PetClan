import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    // 1. Validate current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Validate Pet exists and current user is an owner
    const pet = await Pet.findById(id);
    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    if (!pet.owners.some((ownerId: any) => ownerId.toString() === currentUser._id.toString())) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Get email to share with
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    if (email === session.user.email) {
        return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });
    }

    // 4. Find the target user
    const targetUser = await User.findOne({ email: email });
    if (!targetUser) {
        return NextResponse.json({ error: 'User with this email is not registered in PetClan' }, { status: 400 });
    }

    // 5. Add to owners (atomic update)
    const updatedPet = await Pet.findByIdAndUpdate(
        id,
        { $addToSet: { owners: targetUser._id } },
        { new: true }
    ).populate('owners', 'name email image');

    if (!updatedPet) {
        return NextResponse.json({ error: 'Error updating pet' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Pet shared successfully', owners: updatedPet.owners });
}
