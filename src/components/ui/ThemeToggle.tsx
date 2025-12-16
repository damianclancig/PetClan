'use client';

import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Menu, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
// Importamos iconos unicode temporalmente si no tenemos tabler icons instalados, 
// o usamos texto simple por ahora. 
// Pero Mantine suele venir con soporte. Asumiremos texto/emojis por simplicidad MVP si fallan los imports.
// Mejor usar emojis ☀️ 🌙 🖥️

export function ThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const t = useTranslations('Theme');

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon variant="default" size="lg" aria-label="Toggle color scheme">
                    {computedColorScheme === 'dark' ? '🌙' : '☀️'}
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
