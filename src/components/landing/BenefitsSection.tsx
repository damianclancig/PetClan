'use client';

import { Container, Title, Text, SimpleGrid, ThemeIcon, rem, Box, Flex } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconDeviceMobile, IconLock, IconBell } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function BenefitsSection() {
    const t = useTranslations('Landing.Benefits');

    const benefits = [
        {
            icon: IconDeviceMobile,
            title: t('access.title'),
            description: t('access.description'),
            color: 'indigo'
        },
        {
            icon: IconLock,
            title: t('security.title'),
            description: t('security.description'),
            color: 'green'
        },
        {
            icon: IconBell,
            title: t('reminders.title'),
            description: t('reminders.description'),
            color: 'yellow'
        }
    ];

    return (
        <Box component="section" py={rem(80)}>
            <Container size="lg">
                <Title order={2} ta="center" mb={60}>
                    {t('title')}
                </Title>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing={50}>
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <Flex direction="column" align="center" style={{ textAlign: 'center' }}>
                                <ThemeIcon
                                    size={80}
                                    radius="50%"
                                    variant="light"
                                    color={benefit.color}
                                    mb="lg"
                                >
                                    <benefit.icon style={{ width: rem(40), height: rem(40) }} />
                                </ThemeIcon>
                                <Text fw={700} fz="xl" mb="sm">
                                    {benefit.title}
                                </Text>
                                <Text c="dimmed">
                                    {benefit.description}
                                </Text>
                            </Flex>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
