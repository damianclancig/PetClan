import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Invitation from '@/models/Invitation';
import Pet from '@/models/Pet';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { token } = await params;
    await dbConnect();

    try {
        const { action } = await req.json(); // 'accept' or 'reject'

        const request = await Invitation.findOne({ token, type: 'removal' }).populate('inviterId').populate('petId');
        if (!request) return NextResponse.json({ error: 'Invalid or expired request' }, { status: 404 });

        if (request.status !== 'pending') {
            return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
        }

        // Verify that the logged in user is the TARGET of the request (matching email)
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (currentUser.email.toLowerCase() !== request.email.toLowerCase()) {
            return NextResponse.json({ error: 'This request is not for you' }, { status: 403 });
        }

        const pet = await Pet.findById(request.petId);
        if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

        if (action === 'accept') {
            // Remove user from owners
            pet.owners = pet.owners.filter((ownerId: any) => ownerId.toString() !== currentUser._id.toString());
            await pet.save();
            request.status = 'accepted';
        } else if (action === 'reject') {
            request.status = 'rejected';
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        await request.save();

        const requester = request.inviterId as any;

        // Notify Requester (Inviter)
        const wantsInApp = requester.notificationPreferences?.inApp !== false;
        if (wantsInApp) {
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                userId: requester._id,
                type: 'social',
                title: action === 'accept' ? 'Solicitud Aceptada' : 'Solicitud Rechazada',
                message: `${currentUser.name} ha ${action === 'accept' ? 'aceptado' : 'rechazado'} dejar de ser dueño de ${pet.name}.`,
                link: `/dashboard/pets/${pet._id}`
            });
        }

        // Email Notification
        const wantsEmail = requester.notificationPreferences?.email !== false;
        if (wantsEmail && requester.email && requester.name) {
            try {
                const { sendRemovalResultEmail } = await import('@/lib/email');
                await sendRemovalResultEmail(
                    requester.email,
                    requester.name,
                    currentUser.name,
                    pet.name,
                    action === 'accept'
                );
            } catch (e) {
                console.error('Error sending removal result email', e);
            }
        }

        return NextResponse.json({ success: true, action });

    } catch (error: any) {
        console.error('Error processing request action', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
