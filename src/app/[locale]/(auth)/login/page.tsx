'use client';

import { Suspense } from 'react';
import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
    Loader
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
// import { IconBrandGoogle } from '@tabler/icons-react';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl });
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className="mantine-Title-root">
                Bienvenido a PetClan
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Ingresa para gestionar la salud de tus mascotas
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Button
                    fullWidth
                    variant="outline"
                    color="gray"
                    onClick={handleGoogleLogin}
                    mb="md"
                >
                    Continuar con Google
                </Button>

                <Text c="dimmed" size="xs" ta="center" mt="md">
                    Al continuar, aceptas nuestros términos y condiciones.
                </Text>
            </Paper>
        </Container>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<Center h="100vh"><Loader /></Center>}>
            <LoginContent />
        </Suspense>
    );
}
