import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Container, Title, Text, Button, Group, Paper, Stack, Box, UnstyledButton, Divider, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconBell, IconInfoCircle, IconCheck, IconX, IconEdit, IconStethoscope } from '@tabler/icons-react';
import NotificationActions from './NotificationActions';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import dayjs from 'dayjs';

import dbConnect from '@/lib/mongodb';
import NotificationModel, { INotification } from '@/models/Notification';
import User from '@/models/User';

async function getNotification(id: string, userEmail: string): Promise<INotification | null> {
    try {
        await dbConnect();
        const currentUser = await User.findOne({ email: userEmail });
        if (!currentUser) return null;

        const notification = await NotificationModel.findOne({ _id: id, userId: currentUser._id });
        if (!notification) return null;

        // Ensure we pass a plain object to the client component if needed, 
        // though here we just render it directly.
        return typeof notification.toObject === 'function' ? notification.toObject() : notification;
    } catch (e) {
        console.error("Error fetching notification", e);
        return null;
    }
}

export default async function NotificationPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id, locale } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations({ locale, namespace: 'NotificationDetails' });
    const tNewPet = await getTranslations({ locale, namespace: 'NewPet' });
    const tCommon = await getTranslations({ locale, namespace: 'Common' });
    const tPetForm = await getTranslations({ locale, namespace: 'PetForm' });
    const tLayout = await getTranslations({ locale, namespace: 'Layout.Footer' });

    if (!session || !session.user?.email) {
        redirect(`/api/auth/signin?callbackUrl=/notifications/${id}`);
    }

    const notification = await getNotification(id, session.user.email);

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

    if (!notification) {
        return renderLayout(
            <Paper shadow="xl" p={{ base: 'xl', sm: 40 }} radius="md" withBorder w="100%" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
                <Stack align="center" gap="lg">
                    <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                        <IconBell size={45} stroke={1.5} />
                    </ThemeIcon>
                    <Stack gap="xs" align="center" ta="center">
                        <Title order={2} size="h2">{t('not_found_title')}</Title>
                        <Text size="md" c="dimmed">
                            {t('not_found_desc')}
                        </Text>
                    </Stack>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <Button mt="md" variant="filled" size="md" color="cyan" radius="xl">
                            {t('back')}
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        );
    }

    const getIcon = () => {
        const title = notification.title || '';
        const msg = notification.message || '';

        if (title.includes('Accepted') || title.includes('Aceptada') || title.includes('Aceita') || title === 'INVITATION_ACCEPTED' || msg.startsWith('INVITATION_ACCEPTED|')) return <IconCheck size={45} stroke={1.5} />;
        if (title.includes('Rejected') || title.includes('Rechazada') || title.includes('Rejeitada') || title === 'INVITATION_REJECTED' || msg.startsWith('INVITATION_REJECTED|')) return <IconX size={45} stroke={1.5} />;
        if (title.includes('Updated') || title.includes('Actualizado') || title.includes('Atualizado') || title === 'PET_UPDATED_TITLE' || msg.startsWith('PET_UPDATE_V2|')) return <IconEdit size={45} stroke={1.5} />;
        if (title.includes('Record') || title.includes('Registro') || title === 'REMOVE_REQUEST' || msg.startsWith('REMOVE_REQUEST|')) return <IconStethoscope size={45} stroke={1.5} />;
        return <IconInfoCircle size={45} stroke={1.5} />;
    };

    const getColor = () => {
        const title = notification.title || '';
        const msg = notification.message || '';

        if (title.includes('Accepted') || title.includes('Aceptada') || title.includes('Aceita') || title === 'INVITATION_ACCEPTED' || msg.startsWith('INVITATION_ACCEPTED|')) return 'green';
        if (title.includes('Rejected') || title.includes('Rechazada') || title.includes('Rejeitada') || title === 'INVITATION_REJECTED' || msg.startsWith('INVITATION_REJECTED|')) return 'red';
        if (title.includes('Updated') || title.includes('Actualizado') || title.includes('Atualizado') || title === 'PET_UPDATED_TITLE' || msg.startsWith('PET_UPDATE_V2|')) return 'blue';
        if (title.includes('Record') || title.includes('Registro') || title === 'REMOVE_REQUEST' || msg.startsWith('REMOVE_REQUEST|')) return 'teal';
        return 'cyan';
    };

    // Logic to parse change list from message with i18n support
    const renderMessage = () => {
        // V2 Format: PET_UPDATE_V2|updaterName|petName|key1:val1|key2:val2...
        if (notification.message.startsWith('PET_UPDATE_V2|')) {
            const parts = notification.message.split('|');
            const updater = parts[1] || '';
            const pet = parts[2] || '';
            const changesRaw = parts.slice(3);

            return (
                <Stack gap="md" w="100%">
                    <Text size="lg" ta="center" fw={500} c="dimmed">
                        {t('pet_updated_message', { updater, pet })}
                    </Text>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        {changesRaw.map((change: string, index: number) => {
                            const [key, rawValue] = change.split(':');

                            // Translate label using NewPet namespace
                            let label = key;
                            try {
                                // @ts-ignore - dynamic key
                                label = tNewPet(key as any);
                            } catch (e) { }

                            // Translate value if it's a key
                            let value = rawValue || '';
                            if (rawValue === 'SEX_MALE') value = tCommon('sex.male');
                            else if (rawValue === 'SEX_FEMALE') value = tCommon('sex.female');
                            else if (rawValue?.startsWith('STATUS_')) {
                                const statusKey = rawValue.replace('STATUS_', '').toLowerCase();
                                // @ts-ignore - dynamic key
                                value = tPetForm(`status.${statusKey}` as any);
                            }

                            return (
                                <Paper
                                    key={index}
                                    withBorder
                                    p="sm"
                                    radius="md"
                                    bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
                                    style={{
                                        borderLeft: '4px solid var(--mantine-color-teal-5)',
                                    }}
                                >
                                    <Stack gap={2}>
                                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
                                            {label}
                                        </Text>
                                        <Text size="sm" fw={600} c="var(--mantine-color-text)">
                                            {value}
                                        </Text>
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </SimpleGrid>
                </Stack>
            );
        }

        // Handle other structured formats (Invitations, Requests)
        if (notification.message.includes('|')) {
            const parts = notification.message.split('|');
            const type = parts[0];
            let content = notification.message;

            if (type === 'INVITATION_NEW' || type === 'INVITATION_ACCEPTED' || type === 'INVITATION_REJECTED' || type === 'REMOVE_REQUEST') {
                const name = parts[1] || '';
                const pet = parts[2] || '';
                let key = type.toLowerCase();
                if (key === 'invitation_new') key = 'invitation';
                content = t(`${key}_message` as any, { name, pet });

                return (
                    <Text size="lg" mt="sm" ta="center" style={{ whiteSpace: 'pre-line' }}>
                        {content}
                    </Text>
                );
            }
        }

        // Legacy / Standard Format
        const lines = notification.message.split('\n');

        // If it doesn't look like a list of changes, render normally
        if (lines.length <= 1 && !notification.message.includes('•')) {
            return (
                <Text size="lg" mt="sm" style={{ whiteSpace: 'pre-line' }}>
                    {notification.message}
                </Text>
            );
        }

        const intro = lines[0];
        const changes = lines.slice(1).filter(l => l.trim().startsWith('•'));

        return (
            <Stack gap="md" w="100%">
                <Text size="lg" ta="center" fw={500} c="dimmed">
                    {intro}
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    {changes.map((change: string, index: number) => {
                        const cleanChange = change.replace('• ', '').trim();
                        const [label, ...valueParts] = cleanChange.split(':');
                        const value = valueParts.join(':').trim();

                        return (
                            <Paper
                                key={index}
                                withBorder
                                p="sm"
                                radius="md"
                                bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
                                style={{
                                    borderLeft: '4px solid var(--mantine-color-teal-5)',
                                    transition: 'transform 0.2s ease',
                                }}
                            >
                                <Stack gap={2}>
                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
                                        {label}
                                    </Text>
                                    <Text size="sm" fw={600} c="var(--mantine-color-text)">
                                        {value}
                                    </Text>
                                </Stack>
                            </Paper>
                        );
                    })}
                </SimpleGrid>
            </Stack>
        );
    };

    return renderLayout(
        <Paper shadow="xl" p={{ base: 'xl', sm: 40 }} radius="md" withBorder w="100%" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
            <Stack align="center" gap="xl">
                <ThemeIcon size={100} radius="xl" variant="light" color={getColor()} style={{ marginBottom: 10 }}>
                    {getIcon()}
                </ThemeIcon>

                <Stack gap="xs" align="center" ta="center" w="100%">
                    <Title order={1} size="h2" c="var(--mantine-color-text)">
                        {(() => {
                            if (notification.title === 'PET_UPDATED_TITLE' || notification.message.startsWith('PET_UPDATE_V2|')) return t('pet_updated_title');
                            if (notification.title === 'INVITATION_NEW' || notification.message.startsWith('INVITATION_NEW|')) return t('invitation_title');
                            if (notification.title === 'INVITATION_ACCEPTED' || notification.message.startsWith('INVITATION_ACCEPTED|')) return t('invitation_accepted_title');
                            if (notification.title === 'INVITATION_REJECTED' || notification.message.startsWith('INVITATION_REJECTED|')) return t('invitation_rejected_title');
                            if (notification.title === 'REMOVE_REQUEST' || notification.message.startsWith('REMOVE_REQUEST|')) return t('remove_request_title');
                            return notification.title;
                        })()}
                    </Title>
                    <Box mt="md" w="100%">
                        {renderMessage()}
                    </Box>
                    <Text size="sm" c="dimmed" mt="xl">
                        {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                </Stack>

                <Box w="100%" mt="sm">
                    <NotificationActions notificationId={id} />
                </Box>
            </Stack>
        </Paper>
    );
}

