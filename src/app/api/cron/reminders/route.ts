import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HealthRecord from '@/models/HealthRecord';
import Pet from '@/models/Pet'; // Ensure model is registered
import User from '@/models/User'; // Ensure model is registered
import { sendReminderEmail } from '@/lib/email';
import { getTomorrowRange } from '@/lib/dateUtils';

// Force dynamic needed strictly? Cron jobs are usually dynamic.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await dbConnect();

        // Register models if not already active (implicitly handled by imports usually, but good practice)
        // const _ = [Pet, User]; 

        // Calculate "Tomorrow" in UTC to match how dates are typically stored (ISO at 00:00 UTC)
        // If local is -03:00, "Tomorrow" starts 3 hours "late" in UTC terms if we use local time.
        // We want the full 24h block of the next calendar date in UTC.

        // Strategy: Get tomorrow's date string YYYY-MM-DD based on user intent (or server time), 
        // then define range as 00:00:00Z to 23:59:59Z of that date.

        // Using centralized utility:
        const { start: startOfTomorrow, end: endOfTomorrow } = getTomorrowRange();

        console.log(`[CRON] Server Time: ${new Date().toISOString()} `);
        console.log(`[CRON] Querying range: ${startOfTomorrow.toISOString()} - ${endOfTomorrow.toISOString()} `);

        const records = await HealthRecord.find({
            nextDueAt: {
                $gte: startOfTomorrow,
                $lte: endOfTomorrow
            }
        })
            .populate('petId')
            .populate('createdBy');

        console.log(`[CRON] Found ${records.length} records due.`);

        let sentCount = 0;

        for (const record of records) {
            // Type casting since populate replaces ObjectId with Document
            const pet = record.petId as any;
            const user = record.createdBy as any;

            if (user?.email && pet?.name && record.nextDueAt) {
                const success = await sendReminderEmail(
                    { email: user.email, name: user.name },
                    pet.name,
                    record.title,
                    record.nextDueAt
                );
                if (success) {
                    sentCount++;
                    console.log(`[CRON] Email sent to ${user.email} for ${pet.name}`);
                } else {
                    console.error(`[CRON] Failed to send email to ${user.email} `);
                }
            } else {
                console.warn(`[CRON] Skipping record ${record._id}: Missing user email or pet name.`);
            }
        }

        return NextResponse.json({ success: true, count: sentCount, message: 'Reminders processed' });

    } catch (error) {
        console.error('[CRON] Error processing reminders:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
