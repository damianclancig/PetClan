import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invitation from '@/models/Invitation';

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    await dbConnect();

    const request = await Invitation.findOne({ token, type: 'removal' })
        .populate('petId', 'name photoUrl')
        .populate('inviterId', 'name image');

    if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check if the pending request has expired
    if (request.status === 'pending' && request.expiresAt && request.expiresAt < new Date()) {
        request.status = 'expired';
        await request.save();
    }

    if (request.status !== 'pending') {
        return NextResponse.json({ error: 'Request not found or expired' }, { status: 404 });
    }

    // Return safe public info for the landing page
    return NextResponse.json({
        petName: request.petId.name,
        petPhoto: request.petId.photoUrl,
        requesterName: request.inviterId.name,
        requesterImage: request.inviterId.image,
        targetEmail: request.email
    });
}
