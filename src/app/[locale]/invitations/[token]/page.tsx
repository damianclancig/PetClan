import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Container, Title, Text, Button, Group, Paper, Avatar, Stack, Alert } from '@mantine/core';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import InvitationActions from './InvitationActions'; // Client component for buttons

// We need to fetch data. DRY best practice: extract logic or fetch API. 
// Since we are in SC, we can fetch the API using absolute URL.
async function getInvitation(token: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/invitations/${token}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const session = await getServerSession(authOptions);

    // 1. Auth Guard with Callback
    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/invitations/${token}`);
    }

    // 2. Fetch Data
    const invitation = await getInvitation(token);

    if (!invitation) {
        return (
            <Container size="xs" mt={100}>
                <Alert color="red" title="Invitación no válida" icon={<IconAlertCircle />}>
                    La invitación no existe, ha expirado o ya fue procesada.
                </Alert>
                <Button component="a" href="/dashboard" mt="md" variant="default">
                    Ir al Dashboard
                </Button>
            </Container>
        );
    }

    // Validate email match? 
    // If the logged user email is different from invitation email, strictly strictly speaking we should block or warn.
    // User requested "si es la primera vez que ingresa... se crea usuario y acepta".
    // This implies creating account with Google matches the email.
    // Logic inside Actions API checks for mismatch. We should show warning here if mismatch.
    const isEmailMismatch = session.user?.email && invitation.email &&
        session.user.email.toLowerCase() !== invitation.email.toLowerCase();

    return (
        <Container size="xs" py="xl" mt="xl">
            <Paper shadow="md" p="xl" radius="md" withBorder>
                <Stack align="center" gap="lg">
                    <Avatar size="xl" src={invitation.pet.photoUrl} radius="xl">
                        {invitation.pet.name[0]}
                    </Avatar>

                    <div style={{ textAlign: 'center' }}>
                        <Title order={2} mb="xs">¡Invitación de Copropiedad!</Title>
                        <Text c="dimmed">
                            <strong>{invitation.inviter.name}</strong> te ha invitado a colaborar en el cuidado de:
                        </Text>
                        <Title order={3} mt="xs" c="cyan.7">{invitation.pet.name}</Title>
                        <Text size="sm" c="dimmed" mt="xs">({invitation.pet.species})</Text>
                    </div>

                    {isEmailMismatch ? (
                        <Alert color="orange" title="Cuenta incorrecta">
                            Esta invitación fue enviada a <strong>{invitation.email}</strong>, pero has iniciado sesión como <strong>{session.user?.email}</strong>.
                            Debes cambiar de cuenta para aceptar.
                        </Alert>
                    ) : (
                        <InvitationActions token={token} />
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}
