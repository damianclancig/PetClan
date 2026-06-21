'use client';

import { Container, Group, Button, UnstyledButton, Box, rem } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { IconPaw } from '@tabler/icons-react';

export function LandingHeader() {
    const t = useTranslations('Landing.Header');
    const tHero = useTranslations('Landing.Hero');

    return (
        <Box
            component="header"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                backgroundColor: 'light-dark(rgba(255, 255, 255, 0.8), rgba(11, 18, 32, 0.8))',
                borderBottom: '1px solid light-dark(rgba(0,0,0,0.06), rgba(255,255,255,0.06))',
                transition: 'background-color 0.3s ease',
            }}
        >
            <Container size="lg" h={70} px={{ base: 'xs', sm: 'md' }}>
                <Group h="100%" justify="space-between" wrap="nowrap" gap="xs">
                    {/* Logo (izquierda) */}
                    <UnstyledButton component={Link} href="/">
                        <Group gap="xs" wrap="nowrap">
                            {/* Isotype */}
                            <Box w={34} h={34} style={{ position: 'relative' }}>
                                <img
                                    src="/assets/logo-icon.png"
                                    alt="PetClan Isotype"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>
                            {/* Full Logo Text - Oculto en pantallas pequeñas de móvil */}
                            <Box w={{ base: 110, sm: 150 }} h={50} visibleFrom="sm" style={{ position: 'relative' }}>
                                <img
                                    src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054970/PetClan/Logo_PetClan_text_k9ibqy.png"
                                    alt="PetClan"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }}
                                />
                            </Box>
                        </Group>
                    </UnstyledButton>

                    {/* Navigation links (centro) - Hidden on mobile */}
                    <Group gap="xl" visibleFrom="md">
                        <Button
                            component="a"
                            href="#features"
                            variant="subtle"
                            color="gray"
                            size="sm"
                            styles={{
                                root: {
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: 'light-dark(rgba(0,0,0,0.04), rgba(255,255,255,0.04))',
                                        color: 'var(--color-primary)'
                                    }
                                }
                            }}
                        >
                            {t('features')}
                        </Button>
                        <Button
                            component="a"
                            href="#benefits"
                            variant="subtle"
                            color="gray"
                            size="sm"
                            styles={{
                                root: {
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: 'light-dark(rgba(0,0,0,0.04), rgba(255,255,255,0.04))',
                                        color: 'var(--color-primary)'
                                    }
                                }
                            }}
                        >
                            {t('benefits')}
                        </Button>
                    </Group>

                    {/* Controls & Actions (derecha) */}
                    <Group gap="xs" wrap="nowrap">
                        <LanguageToggle />
                        <ThemeToggle />
                        
                        {/* Login Button */}
                        <Button
                            component={Link}
                            href="/login"
                            variant="subtle"
                            color="teal"
                            radius="xl"
                            size="sm"
                            px={{ base: 'xs', sm: 'md' }}
                        >
                            {t('login')}
                        </Button>

                        {/* CTA Button - Hidden on small mobile */}
                        <Button
                            component={Link}
                            href="/login"
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                            radius="xl"
                            size="sm"
                            visibleFrom="xs"
                            leftSection={<IconPaw size={16} />}
                        >
                            {tHero('cta')}
                        </Button>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
