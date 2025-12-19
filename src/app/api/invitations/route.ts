import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import { sendInvitationEmail } from '@/lib/email';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, petId } = await req.json();

    if (!email || !petId) {
        return NextResponse.json({ error: 'Missing email or petId' }, { status: 400 });
    }

    await dbConnect();

    // 1. Verify current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Verify pet ownership
    const pet = await Pet.findById(petId);
    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Using robust check
    const isOwner = pet.owners.some((owner: any) => owner.toString() === currentUser._id.toString());
    if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Send invitation
    const success = await sendInvitationEmail(email, currentUser.name, pet.name);

    if (!success) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invitation sent successfully' });
}
