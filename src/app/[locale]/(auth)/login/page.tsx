'use client';

import { Suspense } from 'react';
import {
    Paper,
    Button,
    Title,
    Text,
    Container,
    Group,
    Box,
    Loader,
    Center,
    Stack,
    ThemeIcon,
    rem,
    Modal,
    ScrollArea
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useDisclosure } from '@mantine/hooks';
import { TermsOfService } from '@/components/legal/TermsOfService';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    );
}

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [opened, { open, close }] = useDisclosure(false);

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl });
    };

    return (
        <Box style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
            {/* Modal de Términos y Condiciones */}
            <Modal
                opened={opened}
                onClose={close}
                title="Términos y Condiciones"
                size="lg"
                padding="xl"
                centered
                radius="md"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <TermsOfService />
            </Modal>

            {/* Background Gradient for Mobile / Base Element */}
            <Box
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, var(--mantine-color-teal-1) 0%, var(--mantine-color-violet-1) 100%)',
                    zIndex: 0,
                }}
            />

            {/* Left Side (Visual) - Desktop Only */}
            <Box
                visibleFrom="md"
                style={{
                    flex: 1,
                    position: 'relative',
                    background: 'linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-violet-6) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 'var(--mantine-spacing-xl)',
                    zIndex: 1,
                    color: 'white',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png"
                        alt="PetClan Logo"
                        style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'contain' }}
                    />
                    <Text size="xl" mt="xl" maw={400} ta="center" style={{ opacity: 0.9 }}>
                        La mejor forma de cuidar la salud y el bienestar de tus mascotas.
                    </Text>
                </motion.div>

                {/* Decorative Pattern */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
                        backgroundSize: '40px 40px',
                        zIndex: -1,
                    }}
                />
            </Box>

            {/* Right Side (Form) */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 'var(--mantine-spacing-md)',
                    zIndex: 2,
                    position: 'relative',
                    overflow: 'hidden', // Added to contain background
                }}
            >
                {/* Pet Pattern Background restricted to this side */}
                <AnimatedBackground style={{ opacity: 0.15 }} />

                <Container size={420} w="100%" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <Paper
                            shadow="xl"
                            p={40}
                            radius="lg"
                            withBorder
                            style={{
                                backdropFilter: 'blur(20px)',
                                backgroundColor: 'light-dark(rgba(255, 255, 255, 0.85), rgba(36, 36, 36, 0.85))',
                            }}
                        >
                            <Stack align="center" mb={30}>
                                <img
                                    src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png"
                                    alt="PetClan"
                                    style={{ height: '120px', objectFit: 'contain' }}
                                />
                                <Text c="dimmed" size="sm" ta="center" mt="sm">
                                    Ingresa para continuar
                                </Text>
                            </Stack>

                            <Button
                                fullWidth
                                size="lg"
                                leftSection={<GoogleIcon />}
                                variant="default"
                                color="gray"
                                onClick={handleGoogleLogin}
                                mb="xl"
                                style={{
                                    borderColor: 'var(--mantine-color-gray-3)',
                                    transition: 'transform 0.2s ease',
                                }}
                                styles={{
                                    root: {
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }
                                    }
                                }}
                            >
                                Continuar con Google
                            </Button>

                            <Text c="dimmed" size="xs" ta="center">
                                Al continuar, aceptas nuestros{' '}
                                <Text
                                    span
                                    fw={500}
                                    c="teal"
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={open}
                                >
                                    Términos y Condiciones
                                </Text>
                                .
                            </Text>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<Center h="100vh"><Loader /></Center>}>
            <LoginContent />
        </Suspense>
    );
}
