'use client';

import { Container, Title, Text, Button, Group, Box, rem, ThemeIcon, Flex } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, Variants } from 'framer-motion';
import { IconPaw, IconHeartbeat, IconVaccine } from '@tabler/icons-react';

export function HeroSection() {
    const t = useTranslations('Landing.Hero');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <Box
            component="section"
            style={{
                position: 'relative',
                overflow: 'hidden',
                paddingTop: rem(80),
                paddingBottom: rem(80)
            }}
        >
            {/* Background decoration */}
            <Box
                style={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, var(--mantine-color-blue-1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    zIndex: -1,
                    opacity: 0.5
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, var(--mantine-color-cyan-1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    zIndex: -1,
                    opacity: 0.5
                }}
            />

            <Container size="lg">
                <Flex
                    direction={{ base: 'column-reverse', md: 'row' }}
                    align="center"
                    gap={50}
                    justify="space-between"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ flex: 1 }}
                    >
                        <motion.div variants={itemVariants}>
                            <Box mb={20}>
                                <div style={{ position: 'relative', width: 350, height: 250, margin: '0 auto' }}>
                                    <img
                                        src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png"
                                        alt="PetClan Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            </Box>
                            <Title
                                order={1}
                                size={rem(48)}
                                fw={900}
                                style={{ lineHeight: 1.1 }}
                            >
                                <Text
                                    component="span"
                                    inherit
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'cyan' }}
                                >
                                    {t('title')}
                                </Text>
                            </Title>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Text c="dimmed" mt="md" size="xl" maw={500}>
                                {t('subtitle')}
                            </Text>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Group mt={30} gap="md">
                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    size="lg"
                                    radius="xl"
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'cyan' }}
                                    leftSection={<IconPaw size={20} />}
                                >
                                    {t('cta')}
                                </Button>
                                <Button
                                    component="a"
                                    href="#features"
                                    size="lg"
                                    radius="xl"
                                    variant="default"
                                >
                                    {t('secondaryCta')}
                                </Button>
                            </Group>
                        </motion.div>
                    </motion.div>

                    {/* Simple graphic representation */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}
                    >
                        <Box style={{ position: 'relative', width: 300, height: 300 }}>
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                <ThemeIcon size={300} radius="100%" variant="light" color="blue" style={{ opacity: 0.2 }}>
                                    <IconPaw style={{ width: '60%', height: '60%' }} />
                                </ThemeIcon>
                            </motion.div>

                            {/* Floating badges */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{ position: 'absolute', top: 20, left: 0 }}
                            >
                                <ThemeIcon size={60} radius="xl" color="teal" variant="filled">
                                    <IconVaccine size={32} />
                                </ThemeIcon>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                style={{ position: 'absolute', bottom: 40, right: 0 }}
                            >
                                <ThemeIcon size={60} radius="xl" color="red" variant="filled">
                                    <IconHeartbeat size={32} />
                                </ThemeIcon>
                            </motion.div>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}
