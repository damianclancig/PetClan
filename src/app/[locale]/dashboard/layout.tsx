import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppShell, Burger, Group, Text, Avatar, UnstyledButton, rem } from '@mantine/core';
import { AppShellHeader } from '@mantine/core';
import { AppShellNavbar } from '@mantine/core';
import { AppShellMain } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';

// Es un Server Component por defecto
export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/dashboard');
    }

    return (
        <DashboardShell user={session.user}>
            {children}
        </DashboardShell>
    );
}

// Client component wrapper for interactivity if needed, 
// or simpler structure directly here. 
// For Mantine AppShell we need client side for toggle usually, 
// so let's make a separate client component for the shell structure.

import { DashboardShell } from '@/components/layout/DashboardShell';
