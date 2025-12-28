import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import HealthRecord from '@/models/HealthRecord';
import Pet from '@/models/Pet';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const petId = searchParams.get('petId');

    if (!petId) return NextResponse.json({ error: 'Pet ID is required' }, { status: 400 });

    await dbConnect();

    // Verificar acceso a la mascota (si el usuario es dueño)
    const pet = await Pet.findById(petId);
    // Aquí podríamos validar owners, pero por simplicidad de MVP asumimos auth básico o implementamos check rápido
    // const user = await User.findOne({ email: session.user?.email });
    // if (!pet.owners.includes(user._id)) ...

    const records = await HealthRecord.find({ petId }).sort({ appliedAt: -1 });

    return NextResponse.json(records);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    try {
        const body = await req.json();
        // Validar body con Zod idealmente

        // Obtener ID de usuario creador
        const User = (await import('@/models/User')).default; // Import dinámico para evitar circular deps si las hubiera
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            console.error('User not found via email:', session.user.email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const record = await HealthRecord.create({
            ...body,
            createdBy: user._id,
        });

        // Update Pet Weight if type is weight
        if (body.type === 'weight' && typeof body.weightValue === 'number') {
            await Pet.findByIdAndUpdate(body.petId, {
                weight: body.weightValue,
                lastWeightUpdate: new Date()
            });
        }

        // Notificar a otros dueños
        try {
            const pet = await Pet.findById(body.petId).populate('owners') as any;
            if (pet && pet.owners && pet.owners.length > 1) {
                const otherOwners = pet.owners.filter((owner: any) => owner._id.toString() !== user._id.toString());

                const { sendHealthRecordEmail } = await import('@/lib/email');
                const Notification = (await import('@/models/Notification')).default;

                for (const owner of otherOwners) {
                    const recordTypeLabel = body.type === 'vaccine' ? 'Vacuna' :
                        body.type === 'consultation' ? 'Consulta' :
                            body.type === 'antiparasitic' ? 'Desparasitación' : 'Registro';

                    const notificationTitle = `Nuevo Registro: ${pet.name}`;
                    const notificationMessage = `${user.name} agregó "${body.title || recordTypeLabel}" al historial de ${pet.name}.`;

                    // 1. Email
                    const wantsEmail = owner.notificationPreferences?.email !== false;
                    if (wantsEmail && owner.email && owner.name) {
                        try {
                            await sendHealthRecordEmail(
                                owner.email,
                                owner.name,
                                pet.name,
                                body.type,
                                body.title || body.type,
                                user.name,
                                pet._id.toString()
                            );
                        } catch (e) {
                            console.error('Failed to send record email', e);
                        }
                    }

                    // 2. In-App Notification
                    const wantsInApp = owner.notificationPreferences?.inApp !== false;
                    if (wantsInApp) {
                        try {
                            await Notification.create({
                                userId: owner._id,
                                type: 'social',
                                title: notificationTitle,
                                message: notificationMessage,
                                link: `/dashboard/pets/${pet._id}`
                            });
                        } catch (e) {
                            console.error('Failed to create notification', e);
                        }
                    }
                }
            }
        } catch (notifyError) {
            console.error('Error notifying other owners:', notifyError);
            // No fallar el request principal por error de notificación
        }

        return NextResponse.json(record, { status: 201 });
    } catch (error: any) {
        console.error('Error creating health record:', error);
        if (error.name === 'ValidationError') {
            console.error('Validation Error Details:', JSON.stringify(error.errors, null, 2));
            return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Error creating health record' }, { status: 500 });
    }
}
