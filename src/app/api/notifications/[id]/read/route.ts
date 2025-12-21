import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';

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
