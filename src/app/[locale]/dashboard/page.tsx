import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardService } from '@/services/DashboardService';
import DashboardView from '@/components/dashboard/DashboardView';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const dashboardData = await DashboardService.getDashboardData(session.user.id);

    return <DashboardView data={dashboardData} />;
}

