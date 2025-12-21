import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import Invitation from '@/models/Invitation';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: petId } = await params;
    await dbConnect();

    try {
        const { targetUserId } = await req.json();

        // Get current user (Requester)
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Get Target User
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return NextResponse.json({ error: 'Target user not found' }, { status: 404 });

        const pet = await Pet.findById(petId);
        if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

        // Verify current user is owner
        const isOwner = pet.owners.some((p: any) => p.toString() === currentUser._id.toString());
        if (!isOwner) return NextResponse.json({ error: 'Not an owner' }, { status: 403 });

        // Generate Request Token (reusing Invitation model)
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

        await Invitation.create({
            token,
            petId: pet._id,
            inviterId: currentUser._id, // Requester
            email: targetUser.email, // Target
            type: 'removal', // NEW TYPE
            expiresAt
        });

        // Notify Target User
        const wantsInApp = targetUser.notificationPreferences?.inApp !== false;
        if (wantsInApp) {
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                userId: targetUser._id,
                type: 'social', // Or 'system' or 'alert'
                title: 'Solicitud de Baja',
                message: `${currentUser.name} solicita que dejes de ser dueño de ${pet.name}.`,
                link: `/requests/${token}` // New page for actions
            });
        }

        // Email Notification
        const wantsEmail = targetUser.notificationPreferences?.email !== false;
        if (wantsEmail) {
            try {
                const { sendRemovalRequestEmail } = await import('@/lib/email');
                await sendRemovalRequestEmail(
                    targetUser.email,
                    targetUser.name,
                    currentUser.name,
                    pet.name,
                    `${process.env.NEXTAUTH_URL}/requests/${token}`
                );
            } catch (e) {
                console.error('Error sending removal email', e);
            }
        }

        return NextResponse.json({ success: true, message: 'Request sent successfully' });

    } catch (error: any) {
        console.error('Error creating removal request', error);
        return NextResponse.json({ error: error.message || 'Error creating request' }, { status: 500 });
    }
}
