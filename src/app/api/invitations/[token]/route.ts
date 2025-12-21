import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invitation from '@/models/Invitation';
import User from '@/models/User';
import Pet from '@/models/Pet';

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await dbConnect();

    // Find invitation
    const invitation = await Invitation.findOne({
        token,
        status: 'pending' // Only pending
    })
        .populate('inviterId', 'name email image')
        .populate('petId', 'name species photoUrl');

    if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
    }

    // Check expiration
    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return NextResponse.json({ error: 'Invitation expired' }, { status: 410 });
    }

    return NextResponse.json({
        email: invitation.email,
        inviter: invitation.inviterId,
        pet: invitation.petId,
        token: invitation.token
    });
}
