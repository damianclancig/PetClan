import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Invitation from '@/models/Invitation';
import Pet from '@/models/Pet';
import User from '@/models/User';
import { sendInvitationResultEmail } from '@/lib/email';

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await params;
    const { action } = await req.json(); // 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await dbConnect();

    const invitation = await Invitation.findOne({ token, status: 'pending' })
        .populate('inviterId', 'name email')
        .populate('petId', 'name');

    if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found or invalid' }, { status: 404 });
    }

    // Verify user match (Important: invitation email must match logged user email? Or allow claim?)
    // Usually, we want strict match, OR if invitation email was just for notification, we can allow claim if we trust the link ownership.
    // For now, let's allow the currently logged user to claim IF the invitation email matches their email.
    // Simpler: Just allow whoever clicks if logged in? No, security risk if link leaks.
    // Check match:
    if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
        return NextResponse.json({ error: 'This invitation belongs to another email address' }, { status: 403 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'Current user not found' }, { status: 404 });

    try {
        if (action === 'accept') {
            // Update Pet
            await Pet.findByIdAndUpdate(invitation.petId._id, {
                $addToSet: { owners: currentUser._id }
            });

            invitation.status = 'accepted';
        } else {
            invitation.status = 'rejected';
        }

        await invitation.save();

        // Notify Inviter
        const inviter = invitation.inviterId;
        const pet = invitation.petId;

        if (inviter && inviter.email && inviter.name) {
            await sendInvitationResultEmail(
                inviter.email,
                inviter.name,
                currentUser.name,
                pet.name,
                action === 'accept'
            );

            // In-App Notification using dynamic import
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                userId: inviter._id,
                type: 'invitation',
                title: action === 'accept' ? 'Invitación Aceptada' : 'Invitación Rechazada',
                message: `${currentUser.name} ${action === 'accept' ? 'aceptó' : 'rechazó'} tu invitación para ${pet.name}.`,
                link: action === 'accept' ? `/dashboard/pets/${pet._id}` : undefined
            });
        }

        return NextResponse.json({ success: true, action });

    } catch (error) {
        console.error('Error processing invitation action:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
