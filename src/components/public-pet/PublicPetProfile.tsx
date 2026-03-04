'use client';

import {
    Container, Title, Text, Avatar, Group, Badge, Button, Stack, SimpleGrid, Card, Divider, UnstyledButton, Box, Paper, ThemeIcon
} from '@mantine/core';
import {
    IconVaccine, IconScale, IconExternalLink, IconPaw, IconStethoscope, IconFirstAidKit, IconNotes, IconCalendar, IconCheck, IconPill, IconAlertCircle, IconClock
} from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import dayjs from 'dayjs';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { formatAgeTranslated } from '@/lib/dateUtils';
import { useTranslations } from 'next-intl';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

interface PublicPetProfileProps {
    pet: any;
    owners: any[];
    vaccineStatus: {
        isUpToDate: boolean;
        hasRabies: boolean;
        overdueCount: number;
        rabiesExpires?: Date;
    };
    healthRecords: any[];
}

export default function PublicPetProfile({
    pet,
    owners,
    vaccineStatus,
    healthRecords
}: PublicPetProfileProps) {
    const t = useTranslations('PublicPet');
    const tCommon = useTranslations('Common');
    const tDashboardPets = useTranslations('DashboardView.Pets');
    const tExtra = useTranslations('PetDetail.ExtraInfo');

    const ageString = formatAgeTranslated(pet.birthDate, tDashboardPets);

    // Health Categories Logic for Veterinarian Control
    const getStatusInfo = (categoryRecords: any[], categoryId: string) => {
        const latest = categoryRecords[0];
        if (!latest) return { status: 'pending', date: null, expiry: null };

        const today = dayjs();
        const expiry = latest.nextDueAt ? dayjs(latest.nextDueAt) : null;

        // Basic overdue logic for the public view (could be more complex, but this is for quick reading)
        const isOverdue = expiry && today.isAfter(expiry);
        const isDueSoon = expiry && expiry.diff(today, 'days') <= 15;

        return {
            status: isOverdue ? 'overdue' : (isDueSoon ? 'due_soon' : 'completed'),
            date: latest.appliedAt,
            expiry: latest.nextDueAt,
            title: latest.title
        };
    };

    const categories = [
        {
            id: 'sextuple',
            label: pet.species === 'cat' ? t('triple') : t('sextuple'),
            icon: <IconVaccine size={20} />,
            color: 'teal',
            filter: (r: any) => /sextuple|sextu|quintuple|quint|triple|polivalente|polyvalent|moquillo|distemper|parvo/i.test(r.title) && r.type === 'vaccine'
        },
        {
            id: 'rabies',
            label: t('rabies'),
            icon: <IconVaccine size={20} />,
            color: 'blue',
            filter: (r: any) => /rabia|antirrabica|rabies/i.test(r.title) && r.type === 'vaccine'
        },
        {
            id: 'internal',
            label: t('internalDeworming'),
            icon: <IconPill size={20} />,
            color: 'orange',
            filter: (r: any) => r.type === 'deworming' && (r.dewormingType === 'internal' || !r.dewormingType)
        },
        {
            id: 'external',
            label: t('externalDeworming'),
            icon: <IconPill size={20} />,
            color: 'grape',
            filter: (r: any) => (r.type === 'deworming' && r.dewormingType === 'external') || /pipeta|pulgas|garrapatas|externa/i.test(r.title)
        }
    ];

    const categoryData = categories.map(cat => {
        const matchingRecords = healthRecords.filter(cat.filter);
        return {
            ...cat,
            ...getStatusInfo(matchingRecords, cat.id)
        };
    });

    const overdueCount = categoryData.filter(c => c.status === 'overdue').length;
    const isUpToDate = overdueCount === 0;

    return (
        <Box bg="var(--bg-background)" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            <AnimatedBackground style={{ opacity: 0.15 }} />

            <Container size="md" py="xl" style={{ position: 'relative', zIndex: 1 }}>
                {/* Top Header: Logo & Toggles */}
                <Group justify="space-between" mb="xl" gap="xs">
                    <UnstyledButton component={Link} href="/">
                        <Group gap="xs">
                            <Box w={34} h={34} style={{ position: 'relative' }}>
                                <img
                                    src="/assets/logo-icon.png"
                                    alt="PetClan Isotype"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>
                            <Box w={{ base: 100, sm: 140 }} h={40} style={{ position: 'relative' }}>
                                <img
                                    src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054970/PetClan/Logo_PetClan_text_k9ibqy.png"
                                    alt="PetClan"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }}
                                />
                            </Box>
                        </Group>
                    </UnstyledButton>

                    <Group gap="xs">
                        <LanguageToggle />
                        <ThemeToggle />
                    </Group>
                </Group>

                <Stack gap="xl">
                    {/* FIRST ROW: Identity & Basic Data */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                        <Stack gap="lg" align="center" justify="center">
                            <Avatar
                                size={180}
                                radius="xl"
                                color="cyan"
                                src={pet.photoUrl || null}
                                alt={pet.name}
                                style={{ border: '4px solid var(--mantine-primary-color-filled)', boxShadow: 'var(--mantine-shadow-md)' }}
                            >
                                {pet.name?.charAt(0)}
                            </Avatar>

                            <Stack gap={4} align="center">
                                <Title order={1} ta="center" size="h1">{pet.name}</Title>
                                <Badge size="xl" variant="light" color="cyan">
                                    {tCommon(`species.${pet.species}`)}
                                </Badge>
                            </Stack>
                        </Stack>

                        <Card withBorder shadow="sm" radius="md" p="lg">
                            <Card.Section withBorder inheritPadding py="xs" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))">
                                <Text fw={700} size="sm" tt="uppercase" c="dimmed">{t('verifiedProfile')}</Text>
                            </Card.Section>
                            <Stack mt="md" gap="md">
                                <Group justify="space-between">
                                    <Text c="dimmed" size="sm">{t('breed')}</Text>
                                    <Text fw={600}>{pet.breed}</Text>
                                </Group>
                                <Divider variant="dashed" />
                                <Group justify="space-between">
                                    <Text c="dimmed" size="sm">{t('sex')}</Text>
                                    <Text fw={600}>{tCommon(`sex.${pet.sex}`)}</Text>
                                </Group>
                                <Divider variant="dashed" />
                                <Group justify="space-between">
                                    <Text c="dimmed" size="sm">{t('age')}</Text>
                                    <Text fw={600}>{ageString}</Text>
                                </Group>
                                <Divider variant="dashed" />
                                <Group justify="space-between">
                                    <Text c="dimmed" size="sm">{t('weight')}</Text>
                                    <Group gap={4}>
                                        <IconScale size={18} color="var(--mantine-color-cyan-6)" />
                                        <Text fw={600}>{pet.weight} kg</Text>
                                    </Group>
                                </Group>
                                {pet.chipId && (
                                    <>
                                        <Divider variant="dashed" />
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="sm">Chip ID</Text>
                                            <Text fw={600} style={{ fontFamily: 'monospace' }}>{pet.chipId}</Text>
                                        </Group>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    </SimpleGrid>

                    {/* SECOND ROW: Additional Info & Owners */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                        <Card withBorder shadow="sm" radius="md" p="lg">
                            <Title order={4} mb="md" size="h4">{tExtra('title')}</Title>
                            <Stack gap="md">
                                {pet.characteristics && (
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" color="orange" radius="md">
                                            <IconPaw size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">{tExtra('characteristics')}</Text>
                                            <Text size="sm">{pet.characteristics}</Text>
                                        </div>
                                    </Group>
                                )}
                                {pet.diseases && (
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" color="red" radius="md">
                                            <IconStethoscope size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">{tExtra('diseases')}</Text>
                                            <Text size="sm">{pet.diseases}</Text>
                                        </div>
                                    </Group>
                                )}
                                {pet.treatments && (
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" color="blue" radius="md">
                                            <IconFirstAidKit size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">{tExtra('treatments')}</Text>
                                            <Text size="sm">{pet.treatments}</Text>
                                        </div>
                                    </Group>
                                )}
                                {pet.notes && (
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" color="gray" radius="md">
                                            <IconNotes size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">{tExtra('notes')}</Text>
                                            <Text size="sm">{pet.notes}</Text>
                                        </div>
                                    </Group>
                                )}
                                {!pet.characteristics && !pet.diseases && !pet.treatments && !pet.notes && (
                                    <Text size="sm" c="dimmed" fs="italic" ta="center" py="sm">
                                        No hay información adicional registrada.
                                    </Text>
                                )}
                            </Stack>
                        </Card>

                        <Card withBorder shadow="sm" radius="md" p="lg">
                            <Title order={4} mb="md" size="h4">{t('owners')}</Title>
                            <Stack gap="md">
                                {owners.map((owner) => (
                                    <Group key={owner._id}>
                                        <Avatar src={owner.image} radius="xl" size="md" color="cyan">
                                            {owner.name?.charAt(0)}
                                        </Avatar>
                                        <div>
                                            <Text size="sm" fw={600}>{owner.name}</Text>
                                            <Text size="xs" c="dimmed">{owner.email}</Text>
                                        </div>
                                    </Group>
                                ))}
                            </Stack>
                        </Card>
                    </SimpleGrid>

                    {/* THIRD ROW: Libreta Sanitaria (Control View) */}
                    <Card withBorder shadow="md" radius="md" p="lg" style={{ overflow: 'hidden' }}>
                        <Card.Section withBorder inheritPadding py="md" bg="var(--mantine-color-teal-light)">
                            <Group justify="space-between">
                                <Group gap="sm">
                                    <ThemeIcon size="lg" radius="md" variant="filled" color="teal">
                                        <IconVaccine size={22} />
                                    </ThemeIcon>
                                    <Title order={3} size="h3">{t('healthControl')}</Title>
                                </Group>
                                {isUpToDate ? (
                                    <Badge color="green" size="lg" variant="filled" leftSection={<IconCheck size={14} />}>
                                        {t('upToDate')}
                                    </Badge>
                                ) : (
                                    <Badge color="red" size="lg" variant="filled" leftSection={<IconAlertCircle size={14} />}>
                                        {t('overdue', { count: overdueCount })}
                                    </Badge>
                                )}
                            </Group>
                        </Card.Section>

                        <Box mt="xl" style={{ overflowX: 'auto' }}>
                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                                {categoryData.map((cat) => (
                                    <Paper key={cat.id} withBorder p="md" radius="md" style={{
                                        borderLeft: `6px solid var(--mantine-color-${cat.color}-6)`,
                                        backgroundColor: cat.status === 'overdue' ? 'var(--mantine-color-red-light)' : undefined
                                    }}>
                                        <Group justify="space-between" mb="xs">
                                            <Group gap="xs">
                                                <ThemeIcon variant="light" color={cat.color} radius="md">
                                                    {cat.icon}
                                                </ThemeIcon>
                                                <Text fw={700}>{cat.label}</Text>
                                            </Group>
                                            {cat.status === 'completed' && <IconCheck size={20} color="var(--mantine-color-green-6)" />}
                                            {cat.status === 'overdue' && <IconAlertCircle size={20} color="var(--mantine-color-red-6)" />}
                                            {cat.status === 'due_soon' && <IconCalendar size={20} color="var(--mantine-color-orange-6)" />}
                                            {cat.status === 'pending' && <IconClock size={20} color="var(--mantine-color-gray-6)" />}
                                        </Group>

                                        <Stack gap={4}>
                                            <Group justify="space-between">
                                                <Text size="xs" c="dimmed" fw={600}>{t('lastApplied')}</Text>
                                                <Text size="sm" fw={500}>
                                                    {cat.date ? dayjs(cat.date).format('DD/MM/YYYY') : t('pending')}
                                                </Text>
                                            </Group>
                                            {cat.expiry && (
                                                <Group justify="space-between">
                                                    <Text size="xs" c="dimmed" fw={600}>{t('expires')}</Text>
                                                    <Text size="sm" fw={700} color={cat.status === 'overdue' ? 'red' : (cat.status === 'due_soon' ? 'orange' : 'teal')}>
                                                        {dayjs(cat.expiry).format('DD/MM/YYYY')}
                                                    </Text>
                                                </Group>
                                            )}
                                            {cat.title && cat.status !== 'pending' && (
                                                <Text size="xs" c="dimmed" fs="italic" mt={4}>
                                                    {cat.title}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </Card>
                </Stack>

                <Divider my="xl" variant="dashed" />

                {/* Bottom Button */}
                <Group justify="center" mt="md">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="light"
                            color="cyan"
                            radius="xl"
                            size="md"
                            leftSection={<IconExternalLink size={18} />}
                            fullWidth={false}
                        >
                            {t('goToPetClan')}
                        </Button>
                    </Link>
                </Group>
            </Container>
        </Box>
    );
}
