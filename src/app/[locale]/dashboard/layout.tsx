import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { redirect } from '@/i18n/routing';

// Es un Server Component por defecto
export default async function DashboardLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { locale } = await params;

    if (!session) {
        redirect({ href: '/login', locale });
    }

    return (
        <DashboardShell user={session?.user}>
            {children}
        </DashboardShell>
    );
}
