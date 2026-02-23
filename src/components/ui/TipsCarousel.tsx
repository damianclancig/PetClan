'use client';

import { useState, useEffect } from 'react';
import { Box, Text, Group, ThemeIcon } from '@mantine/core';
import { IconBulb } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function TipsCarousel() {
    const t = useTranslations('DashboardView');
    const tipsArray = t.raw('Tips') as string[];
    const [page, setPage] = useState(0);
    const [activeFace, setActiveFace] = useState<'front' | 'back'>('front');

    useEffect(() => {
        const timer = setTimeout(() => {
            triggerFlip();
        }, 8000);

        return () => clearTimeout(timer);
    }, [page]);

    const triggerFlip = () => {
        setTimeout(() => {
            setActiveFace(prev => prev === 'front' ? 'back' : 'front');
        }, 300);

        setPage(prev => prev + 1);
    };

    const rotation = page * 180;
    const len = tipsArray.length;

    // Final Stable Content Logic:
    // Front Face (Even Rotations): Updates only when HIDDEN (transitioning In).
    // Formula: floor(page / 2) * 2
    // Trace: P0(0, Vis), P1(0, Hid/Out), P2(2, Vis/In), P3(2, Hid/Out)... Correct.
    const frontIndex = (Math.floor(page / 2) * 2) % len;

    // Back Face (Odd Rotations): Updates only when HIDDEN (transitioning In).
    // Needs to hold T1 during P1 (Vis/In) AND P2 (Vis/Out).
    // Updates at P3 (Vis/In).
    // Formula: floor((page - 1) / 2) * 2 + 1. Using max(0) to handle initial state.
    // Trace: P0(1, Hid), P1(1, Vis/In), P2(1, Vis/Out), P3(3, Vis/In)... Correct.
    const backLoopIndex = Math.max(0, Math.floor((page - 1) / 2));
    const backIndex = (backLoopIndex * 2 + 1) % len;

    return (
        <Box
            style={{ position: 'relative', zIndex: 1, perspective: 1000 }}
            onClick={triggerFlip}
        >
            <motion.div
                animate={{ rotateY: rotation }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                    width: '100%',
                    position: 'relative',
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Front Face */}
                <Box
                    style={{
                        position: activeFace === 'front' ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        backfaceVisibility: 'hidden',
                        zIndex: 2,
                        transform: 'rotateY(0deg)'
                    }}
                >
                    <TipCard content={tipsArray[frontIndex]} label={t('TipLabel')} />
                </Box>

                {/* Back Face */}
                <Box
                    style={{
                        position: activeFace === 'back' ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: 1
                    }}
                >
                    <TipCard content={tipsArray[backIndex]} label={t('TipLabel')} />
                </Box>
            </motion.div>
        </Box>
    );
}

function TipCard({ content, label }: { content: string, label: string }) {
    return (
        <Box
            p="md"
            bg="var(--mantine-color-default)"
            style={{
                borderRadius: 'var(--mantine-radius-md)',
                border: '1px solid var(--mantine-color-default-border)',
                cursor: 'pointer',
            }}
        >
            <Group gap="xs" mb="xs" align="center">
                <ThemeIcon color="yellow" variant="light" size="md" radius="xl">
                    <IconBulb size={16} />
                </ThemeIcon>
                <Text size="sm" fw={700}>{label}</Text>
            </Group>
            <Text size="xs" c="dimmed">
                {content}
            </Text>
        </Box>
    );
}
