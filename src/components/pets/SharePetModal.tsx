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
                throw new Error(data.error || 'Error al enviar invitación');
            }

            notifications.show({
                title: 'Invitación enviada',
                message: `Se ha invitado a ${email} a colaborar con ${petName}`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            setEmail('');
        } catch (error: any) {
            notifications.show({
                title: 'Error',
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
            title: 'Dejar mascota',
            centered: true,
            children: (
                <Text size="sm">
                    ¿Estás seguro que deseas dejar de compartir la mascota <strong>{petName}</strong>? Ya no podrás verla ni gestionarla.
                </Text>
            ),
            labels: { confirm: 'Salir de la mascota', cancel: 'Cancelar' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/pets/${petId}/owners/leave`, { method: 'POST' });
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || 'Error al salir');
                    }

                    notifications.show({ title: 'Has dejado la mascota', message: 'Ya no tienes acceso.', color: 'blue' });
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
            title: 'Solicitar baja',
            centered: true,
            children: (
                <Text size="sm">
                    ¿Solicitar a <strong>{targetName}</strong> que deje de ser dueño? Se enviará una notificación para que acepte.
                </Text>
            ),
            labels: { confirm: 'Enviar solicitud', cancel: 'Cancelar' },
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
                        throw new Error(data.error || 'Error al solicitar baja');
                    }

                    notifications.show({ title: 'Solicitud enviada', message: 'Se ha notificado al usuario.', color: 'green' });
                } catch (error: any) {
                    notifications.show({ title: 'Error', message: error.message, color: 'red' });
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
        <Modal opened={opened} onClose={() => { onClose(); setEmail(''); }} title={`Compartir a ${petName}`} centered size="md">
            <Tabs defaultValue="owners">
                <Tabs.List grow>
                    <Tabs.Tab value="owners" leftSection={<IconUsers size={16} />}>
                        Dueños
                    </Tabs.Tab>
                    <Tabs.Tab value="qr" leftSection={<IconQrcode size={16} />}>
                        QR / Público
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="owners" pt="md">
                    <Stack>
                        <Text size="sm" c="dimmed">
                            Agrega a otros usuarios para que puedan ver y gestionar a {petName}.
                        </Text>

                        <Group align="flex-end">
                            <TextInput
                                style={{ flex: 1 }}
                                label="Email del usuario"
                                placeholder="usuario@email.com"
                                leftSection={<IconMail size={16} />}
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleShare();
                                }}
                            />
                            <Button onClick={handleShare} loading={loading} disabled={!email}>
                                Invitar
                            </Button>
                        </Group>

                        <Text fw={500} size="sm" mt="md">Dueños actuales:</Text>
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
                                                <Text size="sm" fw={500}>{owner.name} {isMe && '(Tú)'}</Text>
                                                <Text size="xs" c="dimmed">{owner.email}</Text>
                                            </div>
                                        </Group>

                                        {isMe ? (
                                            owners.length === 1 ? (
                                                <Tooltip label="Eres el único dueño. Gestiona el estado desde Editar.">
                                                    <span style={{ cursor: 'not-allowed', display: 'inline-block' }}>
                                                        <ActionIcon color="gray" variant="subtle" disabled>
                                                            <IconLogout size={16} />
                                                        </ActionIcon>
                                                    </span>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip label="Dejar mascota">
                                                    <ActionIcon color="red" variant="subtle" onClick={handleLeave}>
                                                        <IconLogout size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )
                                        ) : (
                                            <Tooltip label="Solicitar baja">
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
                            Compartí este código QR para que otros puedan ver la ficha básica de <strong>{petName}</strong>.
                        </Text>
                        <PetQRCode petId={petId} petName={petName} />
                        <Button component={Link} href={`/public/pets/${petId}`} target="_blank" variant="subtle" size="xs" mt="md">
                            Abrir enlace directo
                        </Button>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}
