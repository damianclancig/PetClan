'use client';

import { Flex, Text, Anchor, ActionIcon, Modal, Box, rem, Stack } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SupportProjectModal } from './SupportProjectModal';

export function Footer() {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('Layout.Footer');

    return (
        <Box
            component="div"
            h="100%"
        >
            <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify={{ base: 'center', sm: 'space-between' }}
                align="center"
                wrap="wrap"
                gap="md"
                h="100%"
            >
                {/* Column 1: Copyright & Credits */}
                <Box>
                    <Text size="xs" c="dimmed">
                        {t('rights')}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {t('design')} <Anchor href="https://clancig.com.ar" target="_blank" size="xs" c="dimmed" td="underline">clancig.com.ar</Anchor>
                    </Text>
                </Box>

                {/* Column 2: Legal Disclaimer */}
                <Stack gap={0} align="center" mt={{ base: 'md', sm: 0 }}>
                    <Text size="xs" c="dimmed">
                        {t('termsPrefix')}
                    </Text>
                    <Anchor component={Link} href="/terms" size="xs" c="dimmed" td="underline">
                        {t('termsLink')}
                    </Anchor>
                </Stack>
                {/* Mobile version for Legal Disclaimer (hidden on desktop to avoid clutter or handled via responsive props) 
                    For now, following user request on "center". 
                */}

                {/* Column 3: Beating Heart Modal */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        size="lg"
                        onClick={open}
                        aria-label="Amor"
                    >
                        <IconHeart style={{ width: rem(24), height: rem(24) }} fill="currentColor" />
                    </ActionIcon>
                </motion.div>

            </Flex>

            <SupportProjectModal opened={opened} onClose={close} />
        </Box>
    );
}
