import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User'; // Import User model
import Invitation from '@/models/Invitation';
import { sendPetUpdateEmail } from '@/lib/email';
import { formatAge } from '@/lib/dateUtils';
import mongoose, { Types } from 'mongoose';

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

    // Search for pending removal requests for this pet
    const pendingRequests = await Invitation.find({
        petId: id,
        type: 'removal',
        status: 'pending'
    });

    const petObj = pet.toObject();

    // Enrich owners with pending removal status
    petObj.owners = petObj.owners.map((owner: any) => ({
        ...owner,
        hasPendingRemoval: pendingRequests.some(req => req.email === owner.email)
    }));

    return NextResponse.json(petObj);
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

    // Map keys to readable Spanish names for notifications
    const fieldLabels: Record<string, string> = {
        name: 'Nombre',
        species: 'Especie',
        breed: 'Raza',
        birthDate: 'Fecha de nacimiento',
        sex: 'Sexo',
        weight: 'Peso',
        chipId: 'Nro de Chip',
        characteristics: 'Características',
        diseases: 'Enfermedades',
        treatments: 'Tratamientos',
        notes: 'Notas',
        photoUrl: 'Foto de perfil',
        environment: 'Entorno',
        riskLevel: 'Nivel de riesgo',
        status: 'Estado',
        deathDate: 'Fecha de fallecimiento'
    };

    // Detect changed fields and their new values
    const changedFields: { key: string; label: string; value: string }[] = [];
    for (const key in body) {
        if (Object.prototype.hasOwnProperty.call(fieldLabels, key)) {
            const oldValue = existingPet.get(key);
            const newValue = body[key];

            // Comparison logic
            let isDifferent = false;
            if (oldValue instanceof Date && newValue) {
                isDifferent = oldValue.getTime() !== new Date(newValue).getTime();
            } else if (oldValue !== newValue) {
                isDifferent = true;
            }

            if (isDifferent) {
                let formattedValue = String(newValue);

                // Format specific values for readability
                if (key === 'weight') formattedValue = `${newValue} kg`;
                if (key === 'sex') {
                    // Use keys for i18n
                    formattedValue = newValue === 'male' ? 'SEX_MALE' : 'SEX_FEMALE';
                }
                if (key === 'birthDate') formattedValue = new Date(newValue).toLocaleDateString('es-AR');
                if (key === 'status') {
                    // Use keys for i18n
                    const statusKeys: Record<string, string> = { active: 'STATUS_ACTIVE', lost: 'STATUS_LOST', deceased: 'STATUS_DECEASED', archived: 'STATUS_ARCHIVED' };
                    formattedValue = statusKeys[newValue] || newValue;
                }

                changedFields.push({
                    key,
                    label: fieldLabels[key],
                    value: formattedValue
                });
            }
        }
    }

    // Special case for weight tracking
    if (body.weight !== undefined) {
        body.lastWeightUpdate = new Date();
    }

    // Check for photo update history
    if (body.photoUrl && body.photoUrl !== existingPet.photoUrl) {
        // ... (existing photo history logic)
        const ageDescription = existingPet.birthDate
            ? `Edad: ${formatAge(existingPet.birthDate)}`
            : 'Foto de perfil actualizada';

        const newPhotoEntry = {
            url: body.photoUrl,
            publicId: body.publicId || 'unknown',
            date: new Date(),
            description: ageDescription
        };

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
    const otherOwnerIds = existingPet.owners.filter(ownerId => ownerId.toString() !== user._id.toString());

    if (otherOwnerIds.length > 0 && changedFields.length > 0) {
        const otherOwners = await User.find({ _id: { $in: otherOwnerIds } });

        const notifyOwners = async () => {
            const Notification = (await import('@/models/Notification')).default;

            // Format structured message for In-App i18n
            // Structure: PET_UPDATE_V2|updaterName|petName|key1:val1|key2:val2...
            const changesList = changedFields.map(c => `${c.key}:${c.value}`).join('|');
            const inAppMessage = `PET_UPDATE_V2|${user.name}|${updatedPet.name}|${changesList}`;

            for (const owner of otherOwners) {
                // In-App Notification
                const wantsInApp = owner.notificationPreferences?.inApp !== false;
                if (wantsInApp) {
                    try {
                        const newNotificationId = new Types.ObjectId();
                        await Notification.create({
                            _id: newNotificationId,
                            userId: owner._id,
                            type: 'social',
                            title: 'PET_UPDATED_TITLE', // Key for i18n
                            message: inAppMessage,
                            link: `/notifications/${newNotificationId}`
                        });
                    } catch (error) {
                        console.error('Error creating in-app notification for pet update:', error);
                    }
                }

                // Email Notification
                const wantsEmail = owner.notificationPreferences?.email !== false;
                if (wantsEmail && owner.email && owner.name) {
                    try {
                        // For email, transform SEX_MALE etc back to Spanish for now as requested
                        const emailFields = changedFields.map(f => {
                            let val = f.value;
                            if (val === 'SEX_MALE') val = 'Macho';
                            if (val === 'SEX_FEMALE') val = 'Hembra';
                            if (val === 'STATUS_ACTIVE') val = 'Activo';
                            if (val === 'STATUS_LOST') val = 'Perdido';
                            if (val === 'STATUS_DECEASED') val = 'Fallecido';
                            if (val === 'STATUS_ARCHIVED') val = 'Archivado';
                            return { label: f.label, value: val };
                        });

                        await sendPetUpdateEmail(
                            { email: owner.email, name: owner.name },
                            updatedPet.name,
                            user.name,
                            emailFields
                        );
                    } catch (err) {
                        console.error('Failed to send update email', err);
                    }
                }
            }
        };

        await notifyOwners();
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
