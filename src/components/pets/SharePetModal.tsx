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
    // Removed showInviteOption as we always invite now
    const queryClient = useQueryClient();

    const handleShare = async () => {
        if (!email) return;
        setLoading(true);

        try {
            // Always use the invitations endpoint
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, petId }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Return error from API (e.g. "Already owner")
                throw new Error(data.error || 'Error al enviar invitación');
            }

            notifications.show({
                title: 'Invitación enviada',
                message: `Se ha invitado a ${email} a colaborar con ${petName}`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            setEmail('');
            // Optional: invalidate queries if we showed pending invitations
            // queryClient.invalidateQueries({ queryKey: ['pet', petId] }); 
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
                            Recibirán una invitación por correo electrónico.
                        </Text>

                        {/* Simplified UI: Just input and button */}
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
                                    {/* Action icons could go here */}
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
