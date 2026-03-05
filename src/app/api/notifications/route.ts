import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';
import Pet from '@/models/Pet';
import HealthRecord from '@/models/HealthRecord';
import { HealthAnalysisService } from '@/services/HealthAnalysisService';
import { getTranslations } from 'next-intl/server';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 1. Fetch System/Social Notifications (Stored in DB)
    // We EXCLUDE 'health' type from DB query since we compute them now.
    // Or we just fetch all non-health types.
    const storedNotifications = await Notification.find({
        userId: currentUser._id,
        type: { $ne: 'health' } // Ignore old DB health alerts if any exist
    }).sort({ createdAt: -1 });

    // 2. Compute Health Alerts (Real-time)
    let healthAlerts: any[] = [];

    try {
        const tAlerts = await getTranslations('DashboardView.Alerts');
        const pets = await Pet.find({ owners: currentUser._id, status: 'active' });

        for (const pet of pets) {
            // Fetch records for this pet (Optimized: only needed fields or sorted by date)
            const records = await HealthRecord.find({
                petId: pet._id,
                type: { $in: ['vaccine', 'deworming'] }
            }).sort({ appliedAt: -1 });

            const petAlerts = HealthAnalysisService.analyzePetHealth(pet, records, tAlerts);

            // Map to Notification interface shape for frontend consistency
            const mappedAlerts = petAlerts.map(alert => ({
                _id: alert.id, // Virtual ID
                type: alert.type,
                title: alert.title,
                message: alert.message,
                link: alert.link,
                isRead: false, // Computed alerts are always "active/unread"
                createdAt: alert.date, // Use effective date
                isVirtual: true, // Flag for frontend if needed
                severity: alert.severity
            }));

            healthAlerts.push(...mappedAlerts);
        }
    } catch (error) {
        console.error("Error computing health alerts:", error);
    }

    // 3. Merge and Sort
    // Priority: Critical (0) > Success (1) > Warning (2) > Others (3)
    // Then by Date Descending
    const priorityMap: Record<string, number> = {
        'critical': 0,
        'success': 1,
        'warning': 2
    };

    const getPriority = (n: any) => {
        if (n.type === 'health' && n.severity) {
            return priorityMap[n.severity] ?? 3;
        }
        return 3; // Standard notifications
    };

    const allNotifications = [...healthAlerts, ...storedNotifications].sort((a, b) => {
        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pA - pB; // Lower priority first (0 is top)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    });

    // Count unread (All computed are unread + stored unread)
    const unreadCount = healthAlerts.length + storedNotifications.filter(n => !n.isRead).length;

    // Find all potential tokens for computing canDelete
    const tokens: string[] = [];
    allNotifications.forEach(n => {
        if (n.link && (n.type === 'invitation' || n.type === 'social')) {
            const match = n.link.match(/\/(?:invitations|requests)\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                tokens.push(match[1]);
            }
        }
    });

    // Fetch pending invitations matching those tokens
    const pendingTokens = new Set<string>();
    if (tokens.length > 0) {
        const Invitation = (await import('@/models/Invitation')).default;
        const pendingInvs = await Invitation.find({
            token: { $in: tokens },
            status: 'pending'
        }).select('token').lean();
        pendingInvs.forEach((inv: any) => pendingTokens.add(inv.token));
    }

    // Compute canDelete
    const mappedNotifications = allNotifications.map(n => {
        let canDelete = true;

        if (n.isVirtual) {
            canDelete = false; // Cannot delete computed health alerts
        } else if (n.link && (n.type === 'invitation' || n.type === 'social')) {
            const match = n.link.match(/\/(?:invitations|requests)\/([a-zA-Z0-9_-]+)/);
            if (match && match[1] && pendingTokens.has(match[1])) {
                canDelete = false;
            }
        }

        // Ensure n is a plain object before spreading
        const plainNotification = typeof n.toObject === 'function' ? n.toObject() : n;

        return {
            ...plainNotification,
            canDelete
        };
    });

    return NextResponse.json({ notifications: mappedNotifications, unreadCount });
}


