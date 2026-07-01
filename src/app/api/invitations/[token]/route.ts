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
