import { Modal, Text, Button, Stack, Group, ThemeIcon, CopyButton, ModalProps, Divider, Box, Center } from '@mantine/core';
import { IconCoffee, IconBrandPaypal, IconBrandGithub, IconBriefcase, IconCopy, IconCheck, IconHeart } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface SupportProjectModalProps extends ModalProps {
    onClose: () => void;
}

export function SupportProjectModal({ opened, onClose, ...props }: SupportProjectModalProps) {
    const t = useTranslations('Layout.Support');
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <Text fw={700}>{t('title')}</Text>
                    <IconHeart size={16} color="var(--mantine-color-red-filled)" style={{ fill: 'var(--mantine-color-red-filled)' }} />
                </Group>
            }
            centered
            size="md"
            radius="md"
            padding="xl"
            {...props}
        >
            <Stack gap="md">
                <Text size="sm" ta="center" lh={1.6}>
                    {t.rich('description', {
                        b: (chunks) => <b>{chunks}</b>,
                        br: () => <br />
                    })}
                </Text>

                <Text size="sm" ta="center" lh={1.5}>
                    {t('share')}
                </Text>

                <Text size="sm" ta="center" lh={1.5}>
                    {t('help')}
                </Text>

                <Stack gap="sm" mt="md">
                    <CopyButton value={process.env.NEXT_PUBLIC_APP_URL || 'https://petclan.clancig.com.ar'} timeout={2000}>
                        {({ copied, copy }) => (
                            <Button color={copied ? 'teal' : 'gray'} onClick={copy} fullWidth leftSection={copied ? <IconCheck size={18} /> : <IconCopy size={18} />} variant={copied ? 'filled' : 'default'}>
                                {copied ? t('linkCopied') : t('copyLink')}
                            </Button>
                        )}
                    </CopyButton>

                    <Button
                        component="a"
                        href={`https://cafecito.app/${process.env.NEXT_PUBLIC_CAFECITO_USER || ''}`}
                        target="_blank"
                        color="blue"
                        fullWidth
                        leftSection={<IconCoffee size={18} />}
                        variant="filled"
                        disabled={!process.env.NEXT_PUBLIC_CAFECITO_USER}
                    >
                        {t('cafecito')}
                    </Button>

                    <Button
                        component="a"
                        href={process.env.NEXT_PUBLIC_PAYPAL_URL || '#'}
                        target="_blank"
                        color="indigo" // PayPal blue-ish
                        fullWidth
                        leftSection={<IconBrandPaypal size={18} />}
                        variant="filled"
                        disabled={!process.env.NEXT_PUBLIC_PAYPAL_URL}
                    >
                        {t('paypal')}
                    </Button>

                    <Button
                        component="a"
                        href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#'}
                        target="_blank"
                        color="gray"
                        fullWidth
                        leftSection={<IconBriefcase size={18} />}
                        variant="default"
                        disabled={!process.env.NEXT_PUBLIC_PORTFOLIO_URL}
                    >
                        {t('portfolio')}
                    </Button>

                    <Button
                        component="a"
                        href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL || '#'}
                        target="_blank"
                        color="gray"
                        fullWidth
                        leftSection={<IconBrandGithub size={18} />}
                        variant="default"
                        disabled={!process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                    >
                        {t('github')}
                    </Button>
                </Stack>
            </Stack>
        </Modal>
    );
}
