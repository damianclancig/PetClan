import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: petId } = await params;

    await dbConnect();

    // Get current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const pet = await Pet.findById(petId);
    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Check if user is owner
    const isOwner = pet.owners.some((ownerId: mongoose.Types.ObjectId) => ownerId.toString() === user._id.toString());
    if (!isOwner) return NextResponse.json({ error: 'Not an owner' }, { status: 403 });

    // Check if last owner
    if (pet.owners.length <= 1) {
        return NextResponse.json({ error: 'No puedes salir si eres el único dueño. Gestiona el estado de la mascota en Editar.' }, { status: 400 });
    }

    // Remove user from owners
    pet.owners = pet.owners.filter((ownerId: mongoose.Types.ObjectId) => ownerId.toString() !== user._id.toString());
    await pet.save();

    // Create Notification for remaining owners (optional but good UX)
    // We can do this async
    const Notification = (await import('@/models/Notification')).default;

    // Notify other owners
    // Notify other owners
    const remainingOwners = pet.owners;
    if (remainingOwners.length > 0) {
        const User = (await import('@/models/User')).default;
        const ownersToNotify = await User.find({ _id: { $in: remainingOwners } });

        const { sendOwnerLeftEmail } = await import('@/lib/email');

        for (const owner of ownersToNotify) {
            // In-App
            const wantsInApp = owner.notificationPreferences?.inApp !== false;
            if (wantsInApp) {
                Notification.create({
                    userId: owner._id,
                    type: 'social',
                    title: 'Coproprietario salió',
                    message: `${user.name} ha dejado de compartir la mascota ${pet.name}.`,
                    link: `/dashboard/pets/${petId}`
                }).catch(err => console.error('Failed to create notification', err));
            }

            // Email
            const wantsEmail = owner.notificationPreferences?.email !== false;
            if (wantsEmail && owner.email && owner.name) {
                try {
                    await sendOwnerLeftEmail(
                        owner.email,
                        owner.name,
                        user.name,
                        pet.name
                    );
                } catch (err) {
                    console.error('Failed to send email', err);
                }
            }
        }
    }

    return NextResponse.json({ success: true, message: 'Successfully left the pet clan' });
}
