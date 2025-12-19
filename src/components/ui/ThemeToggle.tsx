'use client';

import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Menu, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const t = useTranslations('Theme');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon variant="default" size="lg" aria-label="Toggle color scheme">
                    {!mounted ? '☀️' : (computedColorScheme === 'dark' ? '🌙' : '☀️')}
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>{t('title')}</Menu.Label>
                <Menu.Item leftSection="☀️" onClick={() => setColorScheme('light')}>
                    {t('light')}
                </Menu.Item>
                <Menu.Item leftSection="🌙" onClick={() => setColorScheme('dark')}>
                    {t('dark')}
                </Menu.Item>
                <Menu.Item leftSection="🖥️" onClick={() => setColorScheme('auto')}>
                    {t('auto')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
