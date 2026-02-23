import React, { useState } from 'react';
import { Modal, Tabs, Stack, Text, Button, TextInput, Avatar, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconQrcode, IconUsers, IconMail, IconCheck, IconAlertCircle, IconLogout, IconUserMinus } from '@tabler/icons-react';
import { PetQRCode } from './PetQRCode';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SharePetModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    petName: string;
    owners: any[]; // Populated owners
}

export function SharePetModal({ opened, onClose, petId, petName, owners }: SharePetModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const tModalShare = useTranslations('ModalSharePet');
    const tCommon = useTranslations('Common');
    const tNotifications = useTranslations('Notifications');

    const handleShare = async () => {
        if (!email) return;
        setLoading(true);

        try {
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, petId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || tModalShare('notifications.inviteErrorTitle'));
            }

            notifications.show({
                title: tModalShare('notifications.inviteSentTitle'),
                message: tModalShare('notifications.inviteSentMsg', { email, name: petName }),
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            setEmail('');
        } catch (error: any) {
            notifications.show({
                title: tNotifications('error'),
                message: error.message,
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = () => {
        modals.openConfirmModal({
            title: tModalShare('leavePetTitle'),
            centered: true,
            children: (
                <Text size="sm">
                    {tModalShare('leavePetConfirmMessage')} <strong>{petName}</strong>{tModalShare('leavePetConfirmMessage2')}
                </Text>
            ),
            labels: { confirm: tModalShare('btnLeavePet'), cancel: tModalShare('btnCancel') },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/pets/${petId}/owners/leave`, { method: 'POST' });
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || tNotifications('error'));
                    }

                    notifications.show({ title: tNotifications('leftPetTitle'), message: tNotifications('leftPetMessage'), color: 'blue' });
                    onClose();
                    router.push('/dashboard/pets');
                    queryClient.invalidateQueries({ queryKey: ['pets'] });
                } catch (error: any) {
                    notifications.show({ title: 'Error', message: error.message, color: 'red' });
                }
            }
        });
    };

    const handleRequestRemove = (targetUserId: string, targetName: string) => {
        modals.openConfirmModal({
            title: tModalShare('removeModal.title'),
            centered: true,
            children: (
                <Text size="sm">
                    {tModalShare('removeModal.description', { name: targetName })}
                </Text>
            ),
            labels: { confirm: tModalShare('removeModal.btnConfirm'), cancel: tModalShare('removeModal.btnCancel') },
            confirmProps: { color: 'blue' },
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/pets/${petId}/owners/remove-request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ targetUserId }),
                    });

                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || tModalShare('notifications.removeRequestErrorTitle'));
                    }

                    notifications.show({ title: tModalShare('notifications.removeRequestSentTitle'), message: tModalShare('notifications.removeRequestSentMsg'), color: 'green' });
                } catch (error: any) {
                    notifications.show({ title: tNotifications('error'), message: error.message, color: 'red' });
                }
            }
        });
    };

    // Check if current user is owner (safety check)
    // We assume owners prop is populated with {_id, name, email, image} objects
    // session.user usually has name, email, image. 
    // We need to match by email if ID is not available in session (NextAuth default session often lacks ID unless configured).
    // But owners array has _id. 
    // Let's use email matching if session.user.id undefined.
    // Ideally session.user.id is set in callbacks. Let's assume email match is safer if unsure.

    const isCurrentUser = (owner: any) => {
        if (session?.user?.email && owner.email) {
            return session.user.email === owner.email;
        }
        return false;
    };

    return (
        <Modal opened={opened} onClose={() => { onClose(); setEmail(''); }} title={tModalShare('title', { name: petName })} centered size="md">
            <Tabs defaultValue="owners">
                <Tabs.List grow>
                    <Tabs.Tab value="owners" leftSection={<IconUsers size={16} />}>
                        {tModalShare('tabs.owners')}
                    </Tabs.Tab>
                    <Tabs.Tab value="qr" leftSection={<IconQrcode size={16} />}>
                        {tModalShare('tabs.qr')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="owners" pt="md">
                    <Stack>
                        <Text size="sm" c="dimmed">
                            {tModalShare('ownersTab.description', { name: petName })}
                        </Text>

                        <Group align="flex-end">
                            <TextInput
                                style={{ flex: 1 }}
                                label={tModalShare('ownersTab.emailLabel')}
                                placeholder={tModalShare('ownersTab.emailPlaceholder')}
                                leftSection={<IconMail size={16} />}
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleShare();
                                }}
                            />
                            <Button onClick={handleShare} loading={loading} disabled={!email}>
                                {tModalShare('ownersTab.btnInvite')}
                            </Button>
                        </Group>

                        <Text fw={500} size="sm" mt="md">{tModalShare('ownersTab.currentOwners')}</Text>
                        <Stack gap="sm">
                            {owners && owners.map((owner: any) => {
                                const isMe = isCurrentUser(owner);
                                return (
                                    <Group key={owner._id} justify="space-between" p="xs" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                                        <Group>
                                            <Avatar src={owner.image} radius="xl" color="cyan">
                                                {owner.name?.charAt(0)}
                                            </Avatar>
                                            <div style={{ flex: 1 }}>
                                                <Text size="sm" fw={500}>{owner.name} {isMe && tModalShare('ownersTab.you')}</Text>
                                                <Text size="xs" c="dimmed">{owner.email}</Text>
                                            </div>
                                        </Group>

                                        {isMe ? (
                                            owners.length === 1 ? (
                                                <Tooltip label={tModalShare('ownersTab.onlyOwnerTooltip')}>
                                                    <span style={{ cursor: 'not-allowed', display: 'inline-block' }}>
                                                        <ActionIcon color="gray" variant="subtle" disabled>
                                                            <IconLogout size={16} />
                                                        </ActionIcon>
                                                    </span>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip label={tModalShare('leavePetTooltip')}>
                                                    <ActionIcon color="red" variant="subtle" onClick={handleLeave}>
                                                        <IconLogout size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )
                                        ) : (
                                            <Tooltip label={tModalShare('ownersTab.requestRemoveTooltip')}>
                                                <ActionIcon color="orange" variant="transparent" onClick={() => handleRequestRemove(owner._id, owner.name)}>
                                                    <IconUserMinus size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </Group>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="qr" pt="md">
                    <Stack align="center">
                        <Text size="sm" ta="center" mb="md">
                            {tModalShare('qrTab.description')} <strong>{petName}</strong>.
                        </Text>
                        <PetQRCode petId={petId} petName={petName} />
                        <Button component={Link} href={`/public/pets/${petId}`} target="_blank" variant="subtle" size="xs" mt="md">
                            {tModalShare('qrTab.btnOpenLink')}
                        </Button>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}
