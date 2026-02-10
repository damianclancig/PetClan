'use client';

import { Text, Group, UnstyledButton, ThemeIcon, Box } from '@mantine/core';
import { IconVaccine, IconMail, IconUsers, IconInfoCircle, IconCake, IconUserMinus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

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
    };
    onClose: () => void;
}

export default function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleClick = () => {
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
            style={(theme) => ({
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                // Use 'light' variant variables which adapt transparently in dark mode
                backgroundColor: getBgColor(),
                borderBottom: '1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                '&:hover': {
                    backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))',
                },
                transition: 'background-color 0.2s ease',
            })}
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

                <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={notification.isRead ? 500 : 700} lh={1.3}>
                        {notification.title}
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                        {notification.message}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4} style={{ fontSize: '10px' }}>
                        {dayjs(notification.createdAt).fromNow()}
                    </Text>
                </Box>

                {!notification.isRead && (
                    <Box
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'var(--mantine-color-blue-6)',
                            marginTop: 8
                        }}
                    />
                )}
            </Group>
        </UnstyledButton>
    );
}
