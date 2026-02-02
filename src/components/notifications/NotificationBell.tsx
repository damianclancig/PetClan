'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionIcon, Indicator, Popover, Text, Stack, ScrollArea, Group, Button, Loader, Box } from '@mantine/core';
import { IconBell, IconCheck } from '@tabler/icons-react';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';

interface NotificationBellProps extends React.ComponentPropsWithoutRef<typeof ActionIcon> { }

export default function NotificationBell(props: NotificationBellProps) {
    const [opened, setOpened] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notifications');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        // Poll every minute to keep fresh
        refetchInterval: 60000,
    });

    const markAllRead = useMutation({
        mutationFn: async () => {
            await fetch('/api/notifications', { method: 'PATCH' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;

    const handleMarkAllRead = () => {
        markAllRead.mutate();
    };

    return (
        <Popover opened={opened} onChange={setOpened} width={360} position="bottom-end" shadow="md" withArrow>
            <Popover.Target>
                <Indicator inline label={unreadCount} size={16} disabled={unreadCount === 0} color="red" offset={4}>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="lg"
                        {...props}
                        onClick={() => setOpened((o) => !o)}
                        aria-label="Notificaciones"
                    >
                        <IconBell size={20} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown p={0}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text fw={600} size="sm">Notificaciones</Text>
                    {unreadCount > 0 && (
                        <Button
                            variant="subtle"
                            size="compact-xs"
                            onClick={handleMarkAllRead}
                            leftSection={<IconCheck size={12} />}
                            disabled={markAllRead.isPending}
                        >
                            Marcar leídas
                        </Button>
                    )}
                </div>

                <ScrollArea.Autosize mah={400} type="scroll">
                    {isLoading ? (
                        <Group justify="center" p="xl"><Loader size="sm" /></Group>
                    ) : notifications.length === 0 ? (
                        <Stack align="center" justify="center" p="xl" style={{ opacity: 0.5 }}>
                            <IconBell size={32} />
                            <Text size="sm">No tienes notificaciones</Text>
                        </Stack>
                    ) : (
                        <Box>
                            {notifications.map((notif: any) => (
                                <NotificationItem
                                    key={notif._id}
                                    notification={notif}
                                    onClose={() => setOpened(false)}
                                />
                            ))}
                        </Box>
                    )}
                </ScrollArea.Autosize>
            </Popover.Dropdown>
        </Popover>
    );
}
