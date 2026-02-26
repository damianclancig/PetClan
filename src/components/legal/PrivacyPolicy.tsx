import React from 'react';
import { Title, Text, Stack, List, ThemeIcon, Divider, Box } from '@mantine/core';
import { IconCheck, IconDatabase, IconShieldLock, IconUser, IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function PrivacyPolicy() {
    const t = useTranslations('Privacy');
    return (
        <Stack gap="xl">
            <Box>
                <Title order={3} mb="sm" c="blue.7">{t('section1Title')}</Title>
                <Text lh={1.6} mb="md">
                    {t('section1Body')}
                </Text>
                <List spacing="sm" icon={<ThemeIcon color="blue" size={20} radius="xl"><IconDatabase size={12} /></ThemeIcon>}>
                    <List.Item>{t('data1')}</List.Item>
                    <List.Item>{t('data2')}</List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{t('section2Title')}</Title>
                <Text lh={1.6} mb="md">
                    {t('section2Body')}
                </Text>
                <List spacing="sm" icon={<ThemeIcon color="green" size={20} radius="xl"><IconCheck size={12} /></ThemeIcon>}>
                    <List.Item>{t('use1')}</List.Item>
                    <List.Item>{t('use2')}</List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{t('section3Title')}</Title>
                <Text lh={1.6}>
                    {t('section3Body')}
                </Text>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{t('section4Title')}</Title>
                <Text lh={1.6}>
                    {t('section4Body')}
                </Text>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{t('section5Title')}</Title>
                <Text lh={1.6}>
                    {t('section5Body')}
                </Text>
            </Box>
        </Stack>
    );
}
