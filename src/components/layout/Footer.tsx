'use client';

import { Flex, Text, Anchor, ActionIcon, Modal, Box, rem } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

export function Footer() {
    const [opened, { open, close }] = useDisclosure(false);

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
                        &copy; 2025 Todos los derechos reservados - Licencia MIT
                    </Text>
                    <Text size="xs" c="dimmed">
                        Diseño y desarrollo por <Anchor href="https://clancig.com.ar" target="_blank" size="xs" c="dimmed" td="underline">clancig.com.ar</Anchor>
                    </Text>
                </Box>

                {/* Column 2: Terms Link */}
                <Anchor component={Link} href="/terms" size="sm" c="dimmed">
                    Términos y Condiciones
                </Anchor>

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

            <Modal opened={opened} onClose={close} title="Hecho con amor" centered>
                {/* Empty modal for now as requested */}
            </Modal>
        </Box>
    );
}
