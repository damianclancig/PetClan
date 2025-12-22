'use client';

import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Menu, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

export function ThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const t = useTranslations('Theme');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <ActionIcon variant="default" size="lg" aria-label="Toggle color scheme"><IconSun size={20} stroke={1.5} /></ActionIcon>;
    }

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <ActionIcon variant="default" size="lg" aria-label="Toggle color scheme">
                    {computedColorScheme === 'dark' ? <IconMoon size={20} stroke={1.5} /> : <IconSun size={20} stroke={1.5} />}
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>{t('title')}</Menu.Label>
                <Menu.Item leftSection={<IconSun size={16} />} onClick={() => setColorScheme('light')}>
                    {t('light')}
                </Menu.Item>
                <Menu.Item leftSection={<IconMoon size={16} />} onClick={() => setColorScheme('dark')}>
                    {t('dark')}
                </Menu.Item>
                <Menu.Item leftSection={<IconDeviceDesktop size={16} />} onClick={() => setColorScheme('auto')}>
                    {t('auto')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
