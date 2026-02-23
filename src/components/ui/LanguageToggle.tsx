'use client';

import { ActionIcon, Menu, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useState, useEffect } from 'react';

export function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Navigation'); // Assuming some translation namespace, or we can hardcode for now if 'Language' doesn't exist
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const changeLanguage = (newLocale: 'es' | 'en' | 'pt') => {
        router.replace(pathname, { locale: newLocale });
    };

    if (!mounted) {
        return (
            <ActionIcon variant="default" size="lg" aria-label="Cambiar idioma">
                <Text fw={700} size="sm">ES</Text>
            </ActionIcon>
        );
    }

    return (
        <Menu shadow="md" width={150} position="bottom-end">
            <Menu.Target>
                <ActionIcon variant="default" size="lg" aria-label="Cambiar idioma">
                    <motion.div
                        key={locale}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text fw={700} size="sm" tt="uppercase">{locale}</Text>
                    </motion.div>
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item onClick={() => changeLanguage('es')}>
                    🇪🇸 Español
                </Menu.Item>
                <Menu.Item onClick={() => changeLanguage('en')}>
                    🇬🇧 English
                </Menu.Item>
                <Menu.Item onClick={() => changeLanguage('pt')}>
                    🇧🇷 Português
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
