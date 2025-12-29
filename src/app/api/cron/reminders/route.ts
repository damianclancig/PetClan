import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HealthRecord from '@/models/HealthRecord';
import Pet from '@/models/Pet';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendReminderEmail } from '@/lib/email';
import { getTomorrowRange, now } from '@/lib/dateUtils';
import dayjs from 'dayjs';
import { getVaccinationStatus } from '@/utils/vaccinationLogic';

// Force dynamic needed strictly? Cron jobs are usually dynamic.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await dbConnect();

        // --- 1. Reminders for TOMORROW (Email + Notification) ---
        const { start: startOfTomorrow, end: endOfTomorrow } = getTomorrowRange();

        const recordsDueTomorrow = await HealthRecord.find({
            nextDueAt: { $gte: startOfTomorrow, $lte: endOfTomorrow }
        }).populate('petId');

        let emailsSent = 0;
        let pNotificationsCreated = 0;

        for (const record of recordsDueTomorrow) {
            const pet = record.petId as any;
            if (!pet) continue;

            // Notify ALL owners
            // We need to fetch owners if not populated in Pet (Pet model usually has IDs)
            // But HealthRecord.populate('petId') populates the Pet document.
            // Be careful: pet.owners might be just IDs.

            // Let's assume pet.owners are IDs.
            const owners = await User.find({ _id: { $in: pet.owners } });

            for (const owner of owners) {
                // Email (Only if we want to span all owners, originally was just creator)
                // Let's keep original behavior for Email (or upgrade? User asked for notification system updates).
                // Let's send Email to ALL owners for robustness.
                if (owner.email && record.nextDueAt) {
                    await sendReminderEmail(
                        { email: owner.email, name: owner.name },
                        pet.name,
                        record.title,
                        record.nextDueAt
                    );
                    emailsSent++;
                }

                // In-App Notification
                await Notification.create({
                    userId: owner._id,
                    type: 'health',
                    title: 'Recordatorio de Salud',
                    message: `Mañana vence: ${record.title} para ${pet.name}.`,
                    link: `/dashboard/pets/${pet._id}`
                });
                pNotificationsCreated++;
            }
        }

        // --- 2. Overdue (Yesterday) (Notification only) ---
        // Range: Yesterday 00:00 - 23:59 UTC
        // Implementation: Tomorrow - 2 days? Or just calc.
        const startOfYesterday = dayjs().utc().subtract(1, 'day').startOf('day').toDate();
        const endOfYesterday = dayjs().utc().subtract(1, 'day').endOf('day').toDate();

        const recordsOverdue = await HealthRecord.find({
            nextDueAt: { $gte: startOfYesterday, $lte: endOfYesterday }
        }).populate('petId');

        for (const record of recordsOverdue) {
            const pet = record.petId as any;
            if (!pet) continue;
            const owners = await User.find({ _id: { $in: pet.owners } });

            for (const owner of owners) {
                await Notification.create({
                    userId: owner._id,
                    type: 'health',
                    title: 'Vacuna Vencida',
                    message: `La vacuna ${record.title} de ${pet.name} venció ayer. ¡Actualízala!`,
                    link: `/dashboard/pets/${pet._id}`
                });
                pNotificationsCreated++;
            }
        }

        // --- 3. Birthdays (Today) (Notification only) ---
        // Mongo query for matching month/day is tricky with standard props.
        // We can use aggregation or just fetch all pets and filter in JS (if small dataset).
        // Best approach for scalability: Aggregate.
        const today = dayjs().utc();
        const month = today.month() + 1; // 1-12
        const day = today.date();

        const birthdayPets = await Pet.aggregate([
            {
                $project: {
                    name: 1,
                    owners: 1,
                    month: { $month: "$birthDate" },
                    day: { $dayOfMonth: "$birthDate" }
                }
            },
            {
                $match: {
                    month: month,
                    day: day
                }
            }
        ]);

        for (const pet of birthdayPets) {
            const owners = await User.find({ _id: { $in: pet.owners } });
            for (const owner of owners) {
                await Notification.create({
                    userId: owner._id,
                    type: 'social',
                    title: '¡Feliz Cumpleaños! 🎂',
                    message: `Hoy es el cumpleaños de ${pet.name}. ¡Dale un abrazo de nuestra parte!`,
                    link: `/dashboard/pets/${pet._id}`
                });
                pNotificationsCreated++;
            }
        }

        // --- 4. Weight Control Reminders ---
        // Fetch all active pets to check their weight schedule
        const activePets = await Pet.find({ status: 'active' });

        // Pre-fetch all health records for these pets to minimize queries inside the loop? 
        // Or just query per pet (easier code, maybe slower if 1000s of pets). 
        // For now, per pet is fine for MVP.

        for (const pet of activePets) {
            // --- A. Vaccination Checks (Upcoming & Overdue Dynamic) ---
            const petHealthRecords = await HealthRecord.find({ petId: pet._id });

            // We need to recast pet to any or IPet compatibility if strict typing issues arise, 
            // but usually Mongoose docs work if interfaces align.
            // getVaccinationStatus expects IPet and IHealthRecord[]
            // We might need to map or cast.
            const statusSchedule = getVaccinationStatus(pet as any, petHealthRecords as any[]);

            const upcomingVaccines = statusSchedule.filter(s => s.status === 'upcoming');

            if (upcomingVaccines.length > 0) {
                const owners = await User.find({ _id: { $in: pet.owners } });

                for (const vaccine of upcomingVaccines) {
                    // Anti-spam: Check if we notified about this specific vaccine recently (e.g. last 7 days)
                    // We can check Notification collection.
                    // Title usually: "Vacuna Próxima" or similar.

                    const notificationTitle = 'Vacuna Próxima';
                    const diffDays = dayjs(vaccine.dueDate).diff(dayjs(), 'day');
                    const msg = `La vacuna ${vaccine.vaccineName} para ${pet.name} vence en ${diffDays} días.`;

                    for (const owner of owners) {
                        const wantsInApp = owner.notificationPreferences?.inApp !== false;
                        if (!wantsInApp) continue;

                        const alreadyNotified = await Notification.findOne({
                            userId: owner._id,
                            title: notificationTitle,
                            message: { $regex: vaccine.vaccineName }, // Weak check but likely sufficient
                            createdAt: { $gte: dayjs().subtract(7, 'day').toDate() }
                        });

                        if (!alreadyNotified) {
                            await Notification.create({
                                userId: owner._id,
                                type: 'health',
                                title: notificationTitle,
                                message: msg,
                                link: `/dashboard/pets/${pet._id}`
                            });
                            pNotificationsCreated++;
                        }
                    }
                }
            }


            // --- B. Weight Checks ---
            const birthDate = dayjs(pet.birthDate);
            const ageMonths = dayjs().diff(birthDate, 'month');

            // Determine Interval
            let intervalDays = 180; // Adult (6 months)
            let stageLabel = 'Adulto';

            if (ageMonths < 6) {
                intervalDays = 7; // Puppy (Weekly)
                stageLabel = 'Cachorro';
            } else if (ageMonths < 12) {
                intervalDays = 30; // Junior (Monthly)
                stageLabel = 'Junior';
            } else if (ageMonths > 84) {
                intervalDays = 90; // Senior (3 months)
                stageLabel = 'Senior';
            }

            // Find last weight record
            // We already fetched records, let's filter in memory to save DB call
            const lastWeight = petHealthRecords
                .filter((r: any) => r.type === 'weight')
                .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

            let lastDate = lastWeight ? dayjs(lastWeight.appliedAt) : birthDate;
            const daysSince = dayjs().diff(lastDate, 'day');

            // Logic: Notify if overdue AND (it's the exact due day OR weekly reminder thereafter)
            if (daysSince >= intervalDays && (daysSince - intervalDays) % 7 === 0) {
                const owners = await User.find({ _id: { $in: pet.owners } });

                for (const owner of owners) {
                    const wantsInApp = owner.notificationPreferences?.inApp !== false;

                    if (wantsInApp) {
                        // Check for duplicate weight notification today
                        const alreadyNotified = await Notification.exists({
                            userId: owner._id,
                            type: 'alert',
                            title: `Control de Peso (${stageLabel})`,
                            createdAt: { $gte: dayjs().startOf('day').toDate() }
                        });

                        if (!alreadyNotified) {
                            await Notification.create({
                                userId: owner._id,
                                type: 'alert',
                                title: `Control de Peso (${stageLabel})`,
                                message: `Hace ${daysSince} días fue el último pesaje de ${pet.name}. Se recomienda control cada ${intervalDays} días.`,
                                link: `/dashboard/pets/${pet._id}`
                            });
                            pNotificationsCreated++;
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error('[CRON] Error processing reminders:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
