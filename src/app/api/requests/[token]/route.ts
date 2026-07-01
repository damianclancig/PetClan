/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
