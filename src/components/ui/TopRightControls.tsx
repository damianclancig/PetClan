'use client';

import { Group } from '@mantine/core';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

interface TopRightControlsProps {
    className?: string;
    style?: React.CSSProperties;
}

export function TopRightControls({ className, style }: TopRightControlsProps) {
    return (
        <Group gap="xs" className={className} style={{ ...style, zIndex: 100 }}>
            <LanguageToggle />
            <ThemeToggle />
        </Group>
    );
}
