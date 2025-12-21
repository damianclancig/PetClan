import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
// Force Invitation model registration
import Invitation from '@/models/Invitation';
import { sendInvitationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const email = body.email?.toLowerCase().trim();
    const { petId } = body;

    if (!email || !petId) {
        return NextResponse.json({ error: 'Missing email or petId' }, { status: 400 });
    }

    await dbConnect();

    // 1. Verify current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Verify pet ownership (Current User)
    const pet = await Pet.findById(petId);
    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Using robust check
    const isOwner = pet.owners.some((owner: any) => owner.toString() === currentUser._id.toString());
    if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2.5 Check if target email is ALREADY an owner
    const targetUser = await User.findOne({ email });
    if (targetUser) {
        const isAlreadyOwner = pet.owners.some((owner: any) => owner.toString() === targetUser._id.toString());
        if (isAlreadyOwner) {
            return NextResponse.json({ error: 'This user is already an owner of this pet' }, { status: 400 });
        }
    }

    // 3. Create persistent invitation
    const token = crypto.randomBytes(32).toString('hex');

    // Check if pending invitation exists? Optional. Let's just create new one for simplicity or update existing?
    // Let's create new.
    await Invitation.create({
        token,
        petId: pet._id,
        inviterId: currentUser._id,
        email,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiration
    });

    // 4. Send invitation email with link
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invitations/${token}`;

    let success = true;
    const shouldSendEmail = !targetUser || targetUser.notificationPreferences?.email !== false;

    if (shouldSendEmail) {
        success = await sendInvitationEmail(
            email,
            currentUser.name,
            pet.name,
            invitationUrl
        );
    }

    // 4.5 Create In-App Notification if user exists
    if (targetUser) {
        const wantsInApp = targetUser.notificationPreferences?.inApp !== false;
        if (wantsInApp) {
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                userId: targetUser._id,
                type: 'invitation',
                title: 'Nueva Invitación',
                message: `${currentUser.name} te invitó a colaborar con ${pet.name}.`,
                link: `/invitations/${token}`
            });
        }
    }

    if (!success) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invitation sent successfully' });
}
