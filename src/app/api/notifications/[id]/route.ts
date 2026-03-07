import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';
import Invitation from '@/models/Invitation';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const notification = await Notification.findOne({ _id: id, userId: currentUser._id });
    if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ notification });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const notification = await Notification.findOneAndUpdate(
        { _id: id, userId: currentUser._id },
        { $set: { isRead: true } },
        { new: true }
    );

    if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const notification = await Notification.findOne({ _id: id, userId: currentUser._id });
    if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (notification.type === 'invitation' || notification.type === 'social') {
        const link = notification.link || '';
        const tokenMatch = link.match(/\/(?:invitations|requests)\/([a-zA-Z0-9_-]+)/);
        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            const pendingInvitation = await Invitation.findOne({ token, status: 'pending' });
            if (pendingInvitation) {
                return NextResponse.json({ error: 'Cannot delete a pending invitation notification' }, { status: 400 });
            }
        }
    }

    await Notification.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
}
