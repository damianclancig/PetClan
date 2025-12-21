import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch latest 20 notifications
    // We can add pagination later if needed via searchParams
    const notifications = await Notification.find({ userId: currentUser._id })
        .sort({ createdAt: -1 })
        .limit(20);

    // Count unread
    const unreadCount = await Notification.countDocuments({
        userId: currentUser._id,
        isRead: false
    });

    return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Mark ALL as read
    await Notification.updateMany(
        { userId: currentUser._id, isRead: false },
        { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
}
