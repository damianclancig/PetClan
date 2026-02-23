import React from 'react';
import { Title, Text, Stack, List, ThemeIcon, Divider, Box, Group } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconGavel, IconInfoCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function TermsOfService() {
    const tAuth = useTranslations('Auth');
    const tTerms = useTranslations('Terms');
    return (
        <Stack gap="xl">
            <Box>
                <Title order={3} mb="sm" c="blue.7">1. {tAuth('termsTitle')}</Title>
                <Text lh={1.6}>
                    {tAuth('termsContent1')}
                </Text>
            </Box>

            <Divider />

            <Box>
                <Group align="center" mb="sm" gap="xs">
                    <ThemeIcon color="red" variant="light" size="lg">
                        <IconAlertTriangle size={20} />
                    </ThemeIcon>
                    <Title order={3} c="red.8">{tTerms('section2Title')}</Title>
                </Group>

                <Text fw={700} mb="xs">
                    {tTerms('section2Important')}
                </Text>

                <Text lh={1.6} mb="md">
                    {tTerms('section2Body')}
                </Text>

                <List spacing="sm" icon={<ThemeIcon color="red" size={16} radius="xl"><IconInfoCircle size={10} /></ThemeIcon>}>
                    <List.Item>
                        <b>{tTerms('consultationsTitle')}</b> {tTerms('consultationsBody')}
                    </List.Item>
                    <List.Item>
                        <b>{tTerms('emergenciesTitle')}</b> {tTerms('emergenciesBody')}
                    </List.Item>
                    <List.Item>
                        <b>{tTerms('variabilityTitle')}</b> {tTerms('variabilityBody')}
                    </List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{tTerms('section3Title')}</Title>
                <Text lh={1.6} mb="md">
                    {tTerms('section3Body')}
                </Text>
                <List spacing="sm" icon={<ThemeIcon color="blue" size={16} radius="xl"><IconCheck size={10} /></ThemeIcon>}>
                    <List.Item>
                        <b>{tTerms('healthDataTitle')}</b> {tTerms('healthDataBody')}
                    </List.Item>
                    <List.Item>
                        <b>{tTerms('accountSecurityTitle')}</b> {tTerms('accountSecurityBody')}
                    </List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{tTerms('section4Title')}</Title>
                <Text lh={1.6}>
                    {tTerms('section4Body')}
                </Text>
                <List mt="sm" spacing="xs" type="ordered">
                    <List.Item>{tTerms('liability1')}</List.Item>
                    <List.Item>{tTerms('liability2')}</List.Item>
                    <List.Item>{tTerms('liability3')}</List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{tTerms('section5Title')}</Title>
                <Text lh={1.6}>
                    {tTerms('section5Body')}
                </Text>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">{tTerms('section6Title')}</Title>
                <Text lh={1.6}>
                    {tTerms('section6Body')}
                </Text>
            </Box>

            <Divider />

            <Box>
                <Group align="center" mb="sm" gap="xs">
                    <ThemeIcon color="gray" variant="light" size="md">
                        <IconGavel size={18} />
                    </ThemeIcon>
                    <Title order={3}>{tTerms('section7Title')}</Title>
                </Group>
                <Text lh={1.6}>
                    {tTerms('section7Body')}
                </Text>
            </Box>
        </Stack>
    );
}
