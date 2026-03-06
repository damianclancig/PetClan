import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Container, Title, Text, Button, Group, Paper, Avatar, Stack, Alert, Box, UnstyledButton, Divider, ThemeIcon } from '@mantine/core';
import { IconAlertCircle, IconClock } from '@tabler/icons-react';
import InvitationActions from './InvitationActions';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

async function getInvitation(token: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/invitations/${token}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function InvitationPage({ params }: { params: Promise<{ token: string, locale: string }> }) {
    const { token, locale } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations({ locale, namespace: 'Invitations' });
    const tLayout = await getTranslations({ locale, namespace: 'Layout.Footer' });

    const tCommon = await getTranslations({ locale, namespace: 'Common' });

    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/invitations/${token}`);
    }

    const invitation = await getInvitation(token);

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

    if (!invitation) {
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
                            {t('go_to_dashboard')}
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        );
    }

    const isEmailMismatch = session.user?.email && invitation.email &&
        session.user.email.toLowerCase() !== invitation.email.toLowerCase();

    return renderLayout(
        <Paper shadow="xl" p={{ base: 'xl', sm: 40 }} radius="md" withBorder w="100%" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
            <Stack align="center" gap="xl">
                <Avatar
                    size={150}
                    src={invitation.pet.photoUrl}
                    radius="md"
                    color="cyan"
                    style={{ border: '4px solid var(--mantine-primary-color-filled)', boxShadow: 'var(--mantine-shadow-sm)' }}
                >
                    {invitation.pet.name[0]}
                </Avatar>

                <Stack gap="xs" align="center" ta="center">
                    <Title order={2} size="h2" mb={0}>{t('title')}</Title>
                    <Text size="md" c="dimmed">
                        {t('invited_by', { name: `**${invitation.inviter.name}**` })
                            .split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'var(--mantine-color-text)' }}>{part}</strong> : part)}
                    </Text>
                    <Title order={1} mt="xs" c="cyan.6" size="h1">{invitation.pet.name}</Title>
                    <Text size="sm" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>({tCommon(`species.${invitation.pet.species}`)})</Text>
                </Stack>

                {isEmailMismatch ? (
                    <Alert color="orange" title={t('account_mismatch_title')} icon={<IconAlertCircle />} w="100%">
                        {t('account_mismatch_desc', { invitedEmail: `[${invitation.email}]`, currentEmail: `[${session.user?.email}]` })
                            .split('[').map((part, i) => {
                                if (part.includes(']')) {
                                    const [strong, rest] = part.split(']');
                                    return <span key={i}><strong>{strong}</strong>{rest}</span>;
                                }
                                return <span key={i}>{part}</span>;
                            })}
                    </Alert>
                ) : (
                    <Box w="100%" mt="sm">
                        <InvitationActions token={token} />
                    </Box>
                )}
            </Stack>
        </Paper>
    );
}
