import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Container, Title, Text, Button, Group, Paper, Avatar, Stack, Box, UnstyledButton, Divider, ThemeIcon } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import RequestActions from './RequestActions';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

async function getRequest(token: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/requests/${token}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function RequestPage({ params }: { params: Promise<{ token: string, locale: string }> }) {
    const { token, locale } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations({ locale, namespace: 'Requests' });
    const tLayout = await getTranslations({ locale, namespace: 'Layout.Footer' });

    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/requests/${token}`);
    }

    const request = await getRequest(token);

    // Render Function Layout to keep it DRY
    const renderLayout = (children: React.ReactNode) => (
        <Box bg="var(--bg-background)" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AnimatedBackground style={{ opacity: 0.15 }} />

            <Container size="sm" py="xl" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <Group justify="space-between" mb="xl" gap="xs">
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <UnstyledButton>
                            <Group gap="xs">
                                <Box w={34} h={34} style={{ position: 'relative' }}>
                                    <img src="/assets/logo-icon.png" alt="PetClan Isotype" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </Box>
                                <Box w={{ base: 100, sm: 140 }} h={40} style={{ position: 'relative' }}>
                                    <img
                                        src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054970/PetClan/Logo_PetClan_text_k9ibqy.png"
                                        alt="PetClan"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }}
                                    />
                                </Box>
                            </Group>
                        </UnstyledButton>
                    </Link>

                    <Group gap="xs">
                        <LanguageToggle />
                        <ThemeToggle />
                    </Group>
                </Group>

                {/* Main Content */}
                <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {children}
                </Box>

                {/* Minimal Footer */}
                <Box mt="xl" pt="xl">
                    <Divider mb="md" style={{ opacity: 0.5 }} />
                    <Text ta="center" size="sm" c="dimmed">
                        {tLayout('rights')}
                    </Text>
                </Box>
            </Container>
        </Box>
    );

    if (!request) {
        return renderLayout(
            <Paper shadow="xl" p={{ base: 'xl', sm: 40 }} radius="md" withBorder w="100%" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
                <Stack align="center" gap="lg">
                    <ThemeIcon size={80} radius="xl" variant="light" color="indigo">
                        <IconClock size={45} stroke={1.5} />
                    </ThemeIcon>
                    <Stack gap="xs" align="center" ta="center">
                        <Title order={2} size="h2">{t('invalid_title')}</Title>
                        <Text size="md" c="dimmed">
                            {t('invalid_desc')}
                        </Text>
                    </Stack>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <Button mt="md" variant="filled" size="md" color="cyan" radius="xl">
                            Ir al Dashboard
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        );
    }

    return renderLayout(
        <Paper shadow="xl" p={{ base: 'xl', sm: 40 }} radius="md" withBorder w="100%" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
            <Stack align="center" gap="xl">
                <Avatar
                    src={request.requesterImage}
                    size={100}
                    radius="xl"
                    color="cyan"
                    style={{ border: '3px solid var(--mantine-primary-color-filled)', boxShadow: 'var(--mantine-shadow-xs)' }}
                >
                    {request.requesterName?.charAt(0)}
                </Avatar>

                <Stack gap="xs" align="center" ta="center">
                    <Title order={2} size="h2" mb={0}>{t('title')}</Title>
                    <Text size="md" c="dimmed">
                        {t('requested_by', { name: `**${request.requesterName}**` })
                            .split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'var(--mantine-color-text)' }}>{part}</strong> : part)}
                    </Text>
                </Stack>

                <Avatar
                    src={request.petPhoto}
                    size={150}
                    radius="md"
                    color="blue"
                    style={{ border: '4px solid var(--mantine-color-blue-filled)', boxShadow: 'var(--mantine-shadow-sm)' }}
                >
                    {request.petName?.charAt(0)}
                </Avatar>

                <Title order={1} size="h1" c="blue.6">{request.petName}</Title>

                <Text c="dimmed" ta="center" size="sm" px="lg">
                    {t('warning')}
                </Text>

                <Box w="100%" mt="sm">
                    <RequestActions token={token} />
                </Box>
            </Stack>
        </Paper>
    );
}
