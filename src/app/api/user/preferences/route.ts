import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Default to true if undefined (though Schema default should handle it for new/fetched docs usually)
    const preferences = user.notificationPreferences || { email: true, inApp: true };

    return NextResponse.json(preferences);
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, inApp } = await req.json();

    if (typeof email !== 'boolean' || typeof inApp !== 'boolean') {
        return NextResponse.json({ error: 'Invalid data types' }, { status: 400 });
    }

    await dbConnect();

    // Use findOneAndUpdate to ensure atomic update and return new
    const user = await User.findOneAndUpdate(
        { email: session.user.email },
        {
            $set: {
                'notificationPreferences.email': email,
                'notificationPreferences.inApp': inApp
            }
        },
        { new: true }
    );

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.notificationPreferences);
}
