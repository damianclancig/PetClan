/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Menu, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<typeof ActionIcon> { }

export function ThemeToggle(props: ThemeToggleProps) {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const t = useTranslations('Theme');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <ActionIcon variant="default" size="lg" {...props} aria-label="Toggle color scheme"><IconSun size={20} stroke={1.5} /></ActionIcon>;
    }

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <ActionIcon variant="default" size="lg" {...props} aria-label="Toggle color scheme">
                    <motion.div
                        key={computedColorScheme}
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {computedColorScheme === 'dark' ? <IconMoon size={20} stroke={1.5} /> : <IconSun size={20} stroke={1.5} />}
                    </motion.div>
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
