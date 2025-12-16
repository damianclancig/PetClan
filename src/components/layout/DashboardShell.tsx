'use client';

import { AppShell, Burger, Group, Text, Avatar, UnstyledButton, rem, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
// import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react'; // Asumiendo que no tenemos iconos instalados aún, usaremos texto o emojis

export function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
    const [opened, { toggle }] = useDisclosure();
    const t = useTranslations('Dashboard');
    const tTheme = useTranslations('Theme');

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Text fw={700}> PetrClan 🐶</Text>
                    <Box style={{ flex: 1 }} />

                    <Group mr="md">
                        <ThemeToggle />
                    </Group>

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <UnstyledButton style={{ display: 'flex', alignItems: 'center' }}>
                                <Group gap="xs">
                                    <Box visibleFrom="sm" style={{ flex: 1 }}>
                                        <Text size="sm" fw={500}>{t('greeting', { name: user?.name })}</Text>
                                    </Box>
                                    <Avatar
                                        src={user?.image}
                                        alt={user?.name}
                                        radius="xl"
                                        color="cyan"
                                        imageProps={{ referrerPolicy: 'no-referrer' }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Cuenta</Menu.Label>
                            <Menu.Item onClick={() => { }} disabled>
                                👤 {t('profile')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                🚪 {t('logout')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '10px 0' }}>
                    <Text>🏠 {t('home')}</Text>
                </Link>
                <Link href="/dashboard/pets" style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '10px 0' }}>
                    <Text>🐾 {t('myPets')}</Text>
                </Link>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
