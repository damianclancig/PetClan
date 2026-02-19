import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User'; // Import User model
import { sendPetUpdateEmail } from '@/lib/email';
import { formatAge } from '@/lib/dateUtils';

async function getAuthenticatedUser() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return null;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const pet = await Pet.findById(id).populate('owners', 'name email image');

    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Security check
    // Security check
    const isOwner = pet.owners.some((owner: any) => owner._id.toString() === user._id.toString());
    if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(pet);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // First fetch the existing pet to verify ownership
    const existingPet = await Pet.findById(id);
    if (!existingPet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Security check
    // Security check
    const isOwner = existingPet.owners.some((ownerId: any) => ownerId.toString() === user._id.toString());
    if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // If weight is being updated, automatically set lastWeightUpdate
    if (body.weight !== undefined) {
        body.lastWeightUpdate = new Date();
    }

    // Check for photo update history
    if (body.photoUrl && body.photoUrl !== existingPet.photoUrl) {
        // Extract public_id roughly if possible, or just store URL
        // Cloudinary URL format usually contains public_id, but here simple storage is fine
        // Ideally frontend sends publicId, but for now we auto-track URL changes

        const ageDescription = existingPet.birthDate
            ? `Edad: ${formatAge(existingPet.birthDate)}`
            : 'Foto de perfil actualizada';

        const newPhotoEntry = {
            url: body.photoUrl,
            publicId: body.publicId || 'unknown', // Frontend should ideally send this
            date: new Date(),
            description: ageDescription
        };

        // Add to history
        await Pet.updateOne(
            { _id: id },
            { $push: { photos: newPhotoEntry } }
        );
    }

    const updatedPet = await Pet.findByIdAndUpdate(id, body, { new: true });

    if (!updatedPet) {
        return NextResponse.json({ error: 'Error updating pet' }, { status: 500 });
    }

    // Send notifications to OTHER owners
    // We filter out the current user from the owners list
    const otherOwnerIds = existingPet.owners.filter(ownerId => ownerId.toString() !== user._id.toString());

    if (otherOwnerIds.length > 0) {
        // Fetch details of other owners to get emails
        const otherOwners = await User.find({ _id: { $in: otherOwnerIds } });

        // Send emails asynchronously (fire and forget to not block response)
        otherOwners.forEach(owner => {
            if (owner.email && owner.name) {
                sendPetUpdateEmail(
                    { email: owner.email, name: owner.name },
                    updatedPet.name, // Use the potentially updated name
                    user.name
                ).catch(err => console.error('Failed to send update email', err));
            }
        });
    }

    return NextResponse.json(updatedPet);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const pet = await Pet.findById(id);
    if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

    // Security check
    // Security check
    const isOwner = pet.owners.some((ownerId: any) => ownerId.toString() === user._id.toString());
    if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete logic
    if (pet.status !== 'archived') {
        pet.status = 'archived';
        await pet.save();
        return NextResponse.json({ message: 'Pet archived successfully', isArchived: true });
    }

    // Hard delete if already archived
    await Pet.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Pet deleted permanently', isDeleted: true });
}
