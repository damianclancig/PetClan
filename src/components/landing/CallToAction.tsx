'use client';

import { Container, Title, Text, Button, Box, rem, Overlay } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

export function CallToAction() {
    const t = useTranslations('Landing.CTA');

    return (
        <Box
            component="section"
            py={rem(100)}
            style={{
                position: 'relative',
                backgroundColor: 'var(--mantine-color-blue-6)',
                overflow: 'hidden'
            }}
        >
            {/* Abstract Background Shapes */}
            <Box
                style={{
                    position: 'absolute',
                    top: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    bottom: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                }}
            />

            <Container size="md" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Title order={2} c="white" mb="md" size={rem(36)}>
                        {t('title')}
                    </Title>
                    <Text c="white" size="xl" mb={40} opacity={0.9}>
                        {t('subtitle')}
                    </Text>
                    <Button
                        component={Link}
                        href="/dashboard"
                        size="xl"
                        radius="xl"
                        variant="white"
                        c="blue"
                    >
                        {t('button')}
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
}
