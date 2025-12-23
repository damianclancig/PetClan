'use client';

import { AppShell, Burger, Group, Text, Avatar, UnstyledButton, rem, Box, Menu, NavLink, ScrollArea, Divider, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import NotificationBell from '@/components/notifications/NotificationBell';
import { IconHome, IconPaw, IconLogout, IconSettings, IconUser, IconChevronRight } from '@tabler/icons-react';
import { getPetIdentityColor } from '@/utils/pet-identity'; // Although not used for general layout, might be useful later
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { HoverShine } from '@/components/ui/MotionWrappers';

export function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
    const [opened, { toggle }] = useDisclosure();
    const t = useTranslations('Dashboard');
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const navItems = [
        { label: t('home'), icon: IconHome, link: '/dashboard' },
        { label: t('myPets'), icon: IconPaw, link: '/dashboard/pets' },
    ];

    return (
        <AppShell
            header={{ height: 64 }}
            navbar={{
                width: 280,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header
                style={{
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
            >
                {/* Gradient Line at the bottom of header using pseudo-element or container */}
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(to right, var(--mantine-color-teal-5), var(--mantine-color-violet-5))',
                        opacity: 0.2,
                    }}
                />

                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group gap="xs">
                            <Text
                                size="xl"
                                fw={900}
                                variant="gradient"
                                gradient={{ from: 'teal', to: 'violet', deg: 45 }}
                            >
                                PetClan
                            </Text>
                        </Group>
                    </Group>

                    <Group>
                        <NotificationBell />
                        <ThemeToggle />
                        <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                                <UnstyledButton>
                                    <Avatar
                                        src={user?.image}
                                        alt={user?.name}
                                        radius="xl"
                                        color="teal"
                                    >
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Cuenta</Menu.Label>
                                <Menu.Item leftSection={<IconUser size={14} />} disabled>
                                    {t('profile')}
                                </Menu.Item>
                                <Menu.Item
                                    component={Link}
                                    href="/dashboard/settings/notifications"
                                    leftSection={<IconSettings size={14} />}
                                >
                                    Notificaciones
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconLogout size={14} />}
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    {t('logout')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" bg="var(--bg-surface-muted)">
                <AnimatedBackground />
                <ScrollArea className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
                    <Box>
                        {navItems.map((item) => {
                            const active = isActive(item.link) && (item.link !== '/dashboard' || pathname === '/dashboard');
                            return (
                                <HoverShine key={item.link} style={{ width: '100%', borderRadius: 'var(--mantine-radius-md)' }}>
                                    <UnstyledButton
                                        component={Link}
                                        href={item.link}
                                        onClick={() => { if (opened) toggle(); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '10px 16px',
                                            borderRadius: 'var(--mantine-radius-md)',
                                            marginBottom: '4px',
                                            // Layering: Put solid base color UNDER the soft primary color to block the pattern
                                            background: active
                                                ? 'linear-gradient(0deg, var(--color-primary-soft), var(--color-primary-soft)), var(--bg-surface-muted)'
                                                : 'var(--bg-surface-muted)',
                                            color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
                                            fontWeight: active ? 600 : 400,
                                            borderLeft: active ? '4px solid var(--color-primary)' : '4px solid transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <item.icon size={20} stroke={1.5} style={{ marginRight: '12px' }} />
                                        <Text size="sm">{item.label}</Text>
                                    </UnstyledButton>
                                </HoverShine>
                            );
                        })}
                    </Box>
                </ScrollArea>

                {/* Mini Card Contextual (Example) */}
                <Box style={{ position: 'relative', zIndex: 1 }}>
                    <Divider my="sm" />
                    <Box p="xs" bg="var(--mantine-color-default)" style={{ borderRadius: 'var(--mantine-radius-md)', border: '1px solid var(--mantine-color-default-border)' }}>
                        <Group gap="xs">
                            <ThemeIcon color="orange" variant="light" size="md" radius="xl">
                                <IconPaw size={16} />
                            </ThemeIcon>
                            <Box>
                                <Text size="xs" fw={700}>Tip del día</Text>
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                    Mantén las vacunas al día.
                                </Text>
                            </Box>
                        </Group>
                    </Box>
                </Box>
            </AppShell.Navbar>

            <AppShell.Main bg="var(--bg-background)" style={{ position: 'relative' }}>
                <AnimatedBackground style={{ zIndex: 0 }} />
                <Box style={{ position: 'relative', zIndex: 1 }}>
                    {children}
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}
