'use client';

import { Text, Group, UnstyledButton, ThemeIcon, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconVaccine, IconMail, IconUsers, IconInfoCircle, IconCake, IconTrash } from '@tabler/icons-react';
import { useRouter } from '@/i18n/routing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import 'dayjs/locale/pt';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocale, useTranslations } from 'next-intl';

dayjs.extend(relativeTime);

interface NotificationItemProps {
    notification: {
        _id: string;
        type: string;
        title: string;
        message: string;
        link?: string;
        isRead: boolean;
        createdAt: string;
        severity?: 'warning' | 'critical' | 'success';
        canDelete?: boolean;
        isVirtual?: boolean;
    };
    onClose: () => void;
    onDelete?: (id: string, isVirtual?: boolean) => void;
    isDeleting?: boolean;
}

export default function NotificationItem({ notification, onClose, onDelete, isDeleting }: NotificationItemProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const locale = useLocale();
    const t = useTranslations('NotificationsCenter');
    const tDetails = useTranslations('NotificationDetails');
    const tInvitations = useTranslations('Invitations');
    const tRequests = useTranslations('Requests');
    dayjs.locale(locale);

    // Dynamic translation logic for the compact header view
    let displayTitle = notification.title;
    let displayMessage = notification.message;

    // 1. Handle PET_UPDATE_V2 format
    if (notification.message?.startsWith('PET_UPDATE_V2|')) {
        const parts = notification.message.split('|');
        const updater = parts[1] || '';
        const pet = parts[2] || '';
        displayTitle = tDetails('pet_updated_title');
        displayMessage = tDetails('pet_updated_message', { updater, pet });
    }
    else if (notification.message?.startsWith('INVITATION_NEW|')) {
        const [, name, pet] = notification.message.split('|');
        displayTitle = tDetails('invitation_title');
        displayMessage = tDetails('invitation_message', { name, pet });
    }
    else if (notification.message?.startsWith('INVITATION_ACCEPTED|')) {
        const [, name, pet] = notification.message.split('|');
        displayTitle = tDetails('invitation_accepted_title');
        displayMessage = tDetails('invitation_accepted_message', { name, pet });
    }
    else if (notification.message?.startsWith('INVITATION_REJECTED|')) {
        const [, name, pet] = notification.message.split('|');
        displayTitle = tDetails('invitation_rejected_title');
        displayMessage = tDetails('invitation_rejected_message', { name, pet });
    }
    else if (notification.message?.startsWith('REMOVE_REQUEST|')) {
        const [, name, pet] = notification.message.split('|');
        displayTitle = tDetails('remove_request_title');
        displayMessage = tDetails('remove_request_message', { name, pet });
    }
    // 2. Handle legacy hardcoded Spanish strings from DB
    else {
        if (displayTitle === 'Nueva Invitación') displayTitle = tInvitations('title');
        if (displayTitle === 'Invitación Aceptada') displayTitle = tDetails('invitation_accepted_title');
        if (displayTitle === 'Invitación Rechazada') displayTitle = tDetails('invitation_rejected_title');
        if (displayTitle === 'Solicitud de Baja') displayTitle = tRequests('title');
        if (displayTitle === 'Perfil Actualizado') displayTitle = tDetails('pet_updated_title');
    }

    const handleClick = () => {
        const titleLower = (notification.title || '').toLowerCase();
        const msg = notification.message || '';
        const isStructured = msg.startsWith('PET_UPDATE_V2|') ||
            msg.startsWith('INVITATION_') ||
            msg.startsWith('REMOVE_REQUEST|');

        const isRequestResult =
            isStructured ||
            titleLower.includes('aceptada') || titleLower.includes('accepted') || titleLower.includes('aceita') ||
            titleLower.includes('rechazada') || titleLower.includes('rejected') || titleLower.includes('rejeitada') ||
            titleLower.includes('actualizado') || titleLower.includes('updated') || titleLower.includes('atualizado') ||
            titleLower.includes('registro') || titleLower.includes('record');

        if (isRequestResult) {
            router.push(`/notifications/${notification._id}`);
            onClose();
            return;
        }

        if (notification.link) {
            router.push(notification.link);
            onClose();
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'health': return <IconVaccine size={16} />;
            case 'invitation': return <IconMail size={16} />;
            case 'social':
                if (notification.title.includes('Cumpleaños')) return <IconCake size={16} />;
                return <IconUsers size={16} />;
            default: return <IconInfoCircle size={16} />;
        }
    };

    const getColor = () => {
        switch (notification.type) {
            case 'health':
                if (notification.severity === 'success') return 'green';
                return notification.severity === 'warning' ? 'orange' : 'red';
            case 'invitation': return 'blue';
            case 'social': return 'cyan'; // Cyan for birthday/social
            default: return 'gray';
        }
    };

    const getBgColor = () => {
        if (notification.type === 'health') {
            if (notification.severity === 'success') return 'var(--mantine-color-green-light)';
            if (notification.severity === 'warning') return 'var(--mantine-color-orange-light)';
            return 'var(--mantine-color-red-light)';
        }
        return 'var(--mantine-color-blue-light)';
    }

    return (
        <UnstyledButton
            onClick={handleClick}
            style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                backgroundColor: getBgColor(),
                borderBottom: '1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                transition: 'background-color 0.2s ease',
            }}
        >
            <Group align="start" wrap="nowrap">
                <ThemeIcon
                    size="md"
                    radius="xl"
                    variant="light"
                    color={getColor()}
                    style={{ flexShrink: 0, marginTop: 4 }}
                >
                    {getIcon()}
                </ThemeIcon>

                <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Top Row: Title + Unread Dot */}
                    <Group justify="space-between" align="start" wrap="nowrap">
                        <Text size="sm" fw={notification.isRead ? 500 : 700} lh={1.3}>
                            {displayTitle}
                        </Text>
                        {!notification.isRead && (
                            <Box
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--mantine-color-blue-6)',
                                    marginTop: 4,
                                    flexShrink: 0
                                }}
                            />
                        )}
                    </Group>

                    {/* Bottom Row: Message + Date + Delete Button */}
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                            <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                                {displayMessage}
                            </Text>
                            <Text size="xs" c="dimmed" mt={4} style={{ fontSize: '10px' }}>
                                {dayjs(notification.createdAt).fromNow()}
                            </Text>
                        </Box>
                        {notification.canDelete !== false && (
                            <Tooltip label={t('delete')} position="left" withArrow withinPortal>
                                <ActionIcon
                                    component="div"
                                    variant="subtle"
                                    color="gray"
                                    size="sm"
                                    loading={isDeleting}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onDelete?.(notification._id, notification.isVirtual);
                                    }}
                                    style={{ flexShrink: 0 }}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </Box>
            </Group>
        </UnstyledButton>
    );
}
