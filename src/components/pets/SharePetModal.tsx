import React, { useState } from 'react';
import { Modal, Tabs, Stack, Text, Button, TextInput, Avatar, Group, ActionIcon, Alert, Loader } from '@mantine/core';
import { IconQrcode, IconUsers, IconMail, IconTrash, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { PetQRCode } from './PetQRCode';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@/i18n/routing';

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
    const [showInviteOption, setShowInviteOption] = useState(false); // State for invitation workflow
    const queryClient = useQueryClient();

    const handleShare = async () => {
        if (!email) return;
        setLoading(true);
        setShowInviteOption(false); // Reset invitation state

        try {
            const res = await fetch(`/api/pets/${petId}/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Check if error is specifically about user not found
                if (res.status === 400 && data.error && data.error.includes('not registered')) {
                    setShowInviteOption(true);
                    // Don't throw error yet, just return to let user decide
                    return;
                }
                throw new Error(data.error || 'Error al compartir');
            }

            notifications.show({
                title: 'Invitación enviada',
                message: `Se ha compartido a ${petName} con ${email}`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            setEmail('');
            queryClient.invalidateQueries({ queryKey: ['pet', petId] }); // Refresh to show new owner
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

    const handleInvite = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, petId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al enviar invitación');

            notifications.show({
                title: 'Correo enviado',
                message: `Se ha invitado a ${email} a unirse a PetClan`,
                color: 'blue',
                icon: <IconMail size={16} />,
            });

            setShowInviteOption(false);
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

    return (
        <Modal opened={opened} onClose={() => { onClose(); setShowInviteOption(false); setEmail(''); }} title={`Compartir a ${petName}`} centered size="md">
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
                            Necesitan tener una cuenta en PetClan.
                        </Text>

                        {showInviteOption && (
                            <Alert variant="light" color="blue" title="Usuario no registrado" icon={<IconAlertCircle size={16} />} withCloseButton onClose={() => setShowInviteOption(false)}>
                                <Text size="sm" mb="xs">
                                    El correo <strong>{email}</strong> no tiene cuenta en PetClan.
                                    ¿Quieres enviarle una invitación para que se registre?
                                </Text>
                                <Group mt="sm">
                                    <Button size="xs" onClick={handleInvite} loading={loading} leftSection={<IconMail size={14} />}>
                                        Enviar invitación por email
                                    </Button>
                                    <Button size="xs" variant="default" onClick={() => setShowInviteOption(false)}>
                                        Cancelar
                                    </Button>
                                </Group>
                            </Alert>
                        )}

                        {!showInviteOption && (
                            <Group align="flex-end">
                                <TextInput
                                    style={{ flex: 1 }}
                                    label="Email del usuario"
                                    placeholder="usuario@email.com"
                                    leftSection={<IconMail size={16} />}
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                    // Removed Enter key logic for simplicity with new flow, or verify it works
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleShare();
                                    }}
                                />
                                <Button onClick={handleShare} loading={loading} disabled={!email}>
                                    Invitar
                                </Button>
                            </Group>
                        )}

                        <Text fw={500} size="sm" mt="md">Dueños actuales:</Text>
                        <Stack gap="sm">
                            {owners && owners.map((owner: any) => (
                                <Group key={owner._id} justify="space-between" p="xs" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                                    <Group>
                                        <Avatar src={owner.image} radius="xl" color="cyan">
                                            {owner.name?.charAt(0)}
                                        </Avatar>
                                        <div style={{ flex: 1 }}>
                                            <Text size="sm" fw={500}>{owner.name}</Text>
                                            <Text size="xs" c="dimmed">{owner.email}</Text>
                                        </div>
                                    </Group>
                                    {/* TODO: Add logic to remove owner (future feature) */}
                                </Group>
                            ))}
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
