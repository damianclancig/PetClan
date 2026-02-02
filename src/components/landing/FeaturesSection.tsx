'use client';

import { Container, SimpleGrid, Title, Text, Card, ThemeIcon, rem, Box } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconVaccine, IconScale, IconBug, IconClipboardHeart } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function FeaturesSection() {
    const t = useTranslations('Landing.Features');

    const features = [
        {
            icon: IconVaccine,
            title: t('vaccines.title'),
            description: t('vaccines.description'),
            color: 'blue'
        },
        {
            icon: IconScale,
            title: t('weight.title'),
            description: t('weight.description'),
            color: 'orange'
        },
        {
            icon: IconBug,
            title: t('deworming.title'),
            description: t('deworming.description'),
            color: 'teal'
        },
        {
            icon: IconClipboardHeart,
            title: t('records.title'),
            description: t('records.description'),
            color: 'red'
        }
    ];

    return (
        <Box component="section" id="features" py={rem(80)} bg="var(--mantine-color-gray-0)">
            <Container size="lg">
                <Title order={2} ta="center" mb={50}>
                    {t('title')}
                </Title>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={30}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card shadow="sm" radius="md" padding="xl" h="100%" withBorder>
                                <ThemeIcon
                                    size={50}
                                    radius="md"
                                    variant="light"
                                    color={feature.color}
                                    mb="md"
                                >
                                    <feature.icon style={{ width: rem(28), height: rem(28) }} />
                                </ThemeIcon>
                                <Text fw={700} fz="lg" mb="xs">
                                    {feature.title}
                                </Text>
                                <Text c="dimmed" size="sm">
                                    {feature.description}
                                </Text>
                            </Card>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
