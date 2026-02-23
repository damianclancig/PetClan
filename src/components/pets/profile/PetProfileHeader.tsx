'use client';

import { Box, Container, Avatar, Title, Text, Flex, Badge, Paper, Tabs, rem, ActionIcon, Menu, Button, Affix, Transition, Tooltip } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { PetSpeciesBadge } from '../PetSpeciesBadge';
import { HoverScale, ActionIconMotion, MagicTabBackground } from '@/components/ui/MotionWrappers';
import { MagicParticles } from '@/components/ui/MagicWrappers';
import { useTranslations, useFormatter } from 'next-intl';
import dayjs from 'dayjs';
import { getPetAge } from '@/lib/dateUtils';
import { IconPencil, IconShare, IconDotsVertical, IconCheck, IconArrowBackUp, IconHistory, IconCake, IconDna, IconPlus, IconCamera } from '@tabler/icons-react';
import { CloudinaryUploadButton } from '@/components/ui/CloudinaryUploadButton';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { TimeTravelModal } from '@/components/debug/TimeTravelModal';
import { useUpdatePetPhoto } from '@/hooks/useUpdatePetPhoto';
import { FileButton, Loader } from '@mantine/core';

interface PetProfileHeaderProps {
    pet: any;
    activeTab: string;
    onTabChange: (value: string | null) => void;
    onShare: () => void;
    onAddRecord?: () => void;
}

export function PetProfileHeader({ pet, activeTab, onTabChange, onShare, onAddRecord }: PetProfileHeaderProps) {
    const t = useTranslations('PetDetail');
    const tCommon = useTranslations('Common');
    const tPets = useTranslations('DashboardView.Pets');
    const format = useFormatter();
    const identityColor = getPetIdentityColor(pet._id);
    const [showTimeTravel, setShowTimeTravel] = useState(false);
    const isDeceased = pet.status === 'deceased';
    const { updatePhoto, isUploading } = useUpdatePetPhoto(pet._id);

    const [scroll] = useWindowScroll();
    const showSticky = scroll.y > 180;

    // Icon for Sticky Header
    const StickyAddButton = onAddRecord ? (
        <ActionIcon
            variant="filled"
            color={identityColor}
            radius="xl"
            size="lg"
            onClick={onAddRecord}
            style={{ marginLeft: 'auto' }}
        >
            <IconPlus size={20} />
        </ActionIcon>
    ) : null;

    return (
        <>
            {/* Sticky Hero Header */}
            {/* Sticky Hero Header */}
            <Box
                className="sticky-pet-header"
                style={{
                    position: 'fixed',
                    top: 64, // Just below main header
                    left: 0,
                    right: 0,
                    height: 56, // Slightly compact
                    zIndex: 90,
                    // Glassmorphism
                    backgroundColor: 'light-dark(rgba(255, 255, 255, 0.8), rgba(36, 36, 36, 0.8))',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    // Subtle Top Gradient Line (Identity)
                    borderTop: `2px solid var(--mantine-color-${identityColor}-4)`,

                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',

                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', // Smooth easeOut
                    transform: showSticky ? 'translateY(0)' : 'translateY(-100%)',
                    opacity: showSticky ? 1 : 0,
                    pointerEvents: showSticky ? 'auto' : 'none',
                }}
            >
                {/* No internal extra boxes needed for background opacity now using rgba */}

                <Container size="lg" w="100%" h="100%">
                    <Flex align="center" h="100%">
                        {/* Spacer Left */}
                        <Box style={{ flex: 1 }} />

                        {/* Center Title */}
                        <Flex align="center" gap="sm">
                            <Avatar
                                src={pet.photoUrl}
                                size="md"
                                radius="xl"
                                style={{ border: `2px solid var(--mantine-color-${identityColor}-5)` }}
                            >
                                {pet.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Text fw={700} size="lg">{pet.name}</Text>
                        </Flex>

                        {/* Spacer Right + Actions */}
                        <Box style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            {onAddRecord && (
                                <Button
                                    display={{ base: 'none', xs: 'flex' }}
                                    size="xs"
                                    variant="light"
                                    color={identityColor}
                                    leftSection={<IconPlus size={14} />}
                                    onClick={onAddRecord}
                                >
                                    {t('Header.updateRecord')}
                                </Button>
                            )}
                        </Box>
                    </Flex>
                </Container>
            </Box>

            {/* ... styles ... */}

            {/* Injected Style for Responsive Left Offset */}
            <style jsx global>{`
                @media (min-width: 768px) {
                    .sticky-pet-header {
                        left: 280px !important;
                        width: calc(100% - 280px) !important;
                    }
                }
            `}</style>

            <Paper radius="lg" withBorder mb="lg" style={{ overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
                {/* Organic Header Background */}
                <Box
                    h={120}
                    style={{
                        background: `linear-gradient(135deg, var(--mantine-color-${identityColor}-5), var(--mantine-color-${identityColor}-3))`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative Blob */}
                    <svg
                        viewBox="0 0 1440 320"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 'auto',
                            opacity: 0.2
                        }}
                    >
                        <path
                            fill="#fff"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>

                    {/* Name Positioning - DESKTOP ONLY */}
                    <Container size="lg" h="100%" display={{ base: 'none', xs: 'block' }}>
                        <Flex
                            h="100%"
                            align="flex-end"
                            justify="flex-start"
                            pb={16}
                            pl={160}
                        >
                            <Title
                                order={1}
                                fw={800}
                                c="white"
                                style={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    lineHeight: 1,
                                    zIndex: 5,
                                }}
                            >
                                {pet.name}
                            </Title>
                        </Flex>
                    </Container>

                    {/* Back Button Top Left */}
                    <HoverScale className="absolute top-4 left-4" style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                        <MagicParticles color={`var(--mantine-color-${identityColor}-2)`}>
                            <Button
                                component={Link}
                                href="/dashboard/pets"
                                variant="white"
                                color={identityColor}
                                radius="xl"
                                leftSection={<IconArrowBackUp size={18} />}
                                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                                {t('Header.back')}
                            </Button>
                        </MagicParticles>
                    </HoverScale>

                    {/* Actions Top Right */}
                    <Flex style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }} gap="xs" align="center">
                        {/* Only show actions if NOT deceased */}
                        {pet.status !== 'deceased' && (
                            <>
                                {onAddRecord && (
                                    <MagicParticles color="white">
                                        <Button
                                            variant="white"
                                            color={identityColor}
                                            radius="xl"
                                            leftSection={<IconPlus size={18} />}
                                            onClick={onAddRecord}
                                            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontWeight: 600 }}
                                            className="shiny-button"
                                            display={{ base: 'none', xs: 'flex' }}
                                        >
                                            {t('Header.updateRecord')}
                                        </Button>
                                    </MagicParticles>
                                )}
                                <MagicParticles onClick={onShare} color="white">
                                    <ActionIconMotion>
                                        <ActionIcon
                                            variant="white"
                                            color={identityColor}
                                            size="lg"
                                            radius="xl"
                                            aria-label={t('Header.share')}
                                            style={{ pointerEvents: 'none' }} // Click handled by wrapper
                                        >
                                            <IconShare size={18} />
                                        </ActionIcon>
                                    </ActionIconMotion>
                                </MagicParticles>

                                <MagicParticles color="white">
                                    <ActionIconMotion>
                                        <ActionIcon
                                            component={Link}
                                            href={`/dashboard/pets/${pet._id}/edit`}
                                            variant="white"
                                            color={identityColor}
                                            size="lg"
                                            radius="xl"
                                            aria-label={t('Header.edit')}
                                        >
                                            <IconPencil size={18} />
                                        </ActionIcon>
                                    </ActionIconMotion>
                                </MagicParticles>
                                <MagicParticles color="white">
                                    <ActionIconMotion>
                                        <ActionIcon
                                            variant="white"
                                            color={identityColor}
                                            size="lg"
                                            radius="xl"
                                            aria-label={t('Header.timeTravel')}
                                            onClick={() => setShowTimeTravel(true)}
                                        >
                                            <IconHistory size={18} />
                                        </ActionIcon>
                                    </ActionIconMotion>
                                </MagicParticles>
                            </>
                        )}

                        {/* If deceased, maybe show only edit to allow restoring/deleting? 
                            User said "neither share nor update record". 
                            Usually one wants to be able to edit (to fix the date or delete).
                            Let's keep Edit button but hide others?
                            User said: "tampoco se podrá compartir, ni actualizar libreta". 
                            Did not explicitly forbid "Edit". 
                            However, the prompt implies a read-only view.
                            But if I hide Edit, they can never change it back if they made a mistake or want to delete.
                            I will SHOW Edit but HIDE Share/Add/TimeTravel. 
                        */}
                        {pet.status === 'deceased' && (
                            <MagicParticles color="white">
                                <ActionIconMotion>
                                    <ActionIcon
                                        component={Link}
                                        href={`/dashboard/pets/${pet._id}/edit`}
                                        variant="white"
                                        color={identityColor}
                                        size="lg"
                                        radius="xl"
                                        aria-label={t('Header.edit')}
                                    >
                                        <IconPencil size={18} />
                                    </ActionIcon>
                                </ActionIconMotion>
                            </MagicParticles>
                        )}
                    </Flex>
                </Box>

                <TimeTravelModal
                    opened={showTimeTravel}
                    onClose={() => setShowTimeTravel(false)}
                    petId={pet._id}
                />

                <Container size="lg" style={{ marginTop: -60, paddingBottom: 16, position: 'relative' }}>
                    <Flex
                        direction="row" // Always row for mobile and desktop (Mobile: Avatar left, Name right)
                        align={{ base: 'center', xs: 'flex-start' }} // Center vertically on mobile (for half-color alignment), Top on desktop
                        gap={{ base: 'sm', xs: 'md' }}
                    >
                        <Box style={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={pet.photoUrl}
                                size={120}
                                radius={120}
                                style={{
                                    border: '4px solid var(--bg-surface)',
                                    boxShadow: 'var(--mantine-shadow-md)',
                                    background: !pet.photoUrl ? `linear-gradient(135deg, var(--mantine-color-${identityColor}-5), var(--mantine-color-${identityColor}-9))` : undefined,
                                    color: 'white',
                                    fontSize: '3rem',
                                    fontWeight: 700,
                                    flexShrink: 0
                                }}
                                styles={{
                                    root: {
                                        flexShrink: 1,
                                        minWidth: 80,
                                    }
                                }}
                            >
                                {pet.name.charAt(0).toUpperCase()}
                            </Avatar>
                            {!isDeceased && (
                                <FileButton onChange={(file) => file && updatePhoto(file)} accept="image/png,image/jpeg,image/webp">
                                    {(props) => (
                                        <Tooltip label={t('Header.changePhoto')} withArrow position="right">
                                            <ActionIcon
                                                {...props}
                                                variant="filled"
                                                color="blue"
                                                size="lg"
                                                radius="xl"
                                                loading={isUploading}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 5,
                                                    right: 5,
                                                    border: '2px solid var(--bg-surface)',
                                                    zIndex: 10
                                                }}
                                            >
                                                <IconCamera size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </FileButton>
                            )}
                        </Box>

                        <Box
                            style={{ flex: 1, minWidth: 0, zIndex: 10 }}
                            mt={{ base: 0, xs: 72 }} // Display badges below separate title on Desktop
                            ta="left"
                            h={{ base: 130, xs: 'auto' }} // Fix height in mobile (slightly > 120 for spacing)
                            display={{ base: 'flex', xs: 'block' }} // Flex col in mobile
                        >
                            <Flex
                                direction="column"
                                justify={{ base: 'space-between', xs: 'flex-start' }}
                                h="100%"
                                w="100%"
                            >
                                {/* MOBILE TITLE: Visible only on mobile, right next to avatar */}
                                <Title
                                    order={1}
                                    fw={800}
                                    c="white"
                                    display={{ base: 'block', xs: 'none' }} // Mobile Only
                                    style={{
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                        lineHeight: 1.1,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        paddingTop: 20 // Increased padding to lower the name
                                    }}
                                    fz={28}
                                >
                                    {pet.name}
                                </Title>

                                <Flex gap={8} justify="flex-start" wrap="wrap" align="center" pb={{ base: 4, xs: 0 }}>
                                    <PetSpeciesBadge
                                        species={pet.species}
                                        sex={pet.sex}
                                        color={identityColor}
                                        size="md"
                                    />

                                    <Badge
                                        size="md"
                                        radius="md"
                                        variant="light" // Light variant looks good on surface
                                        color={identityColor} // Use identity color for consistency
                                        leftSection={<IconDna size={14} style={{ marginTop: 4 }} />}
                                        style={{ textTransform: 'none' }}
                                    >
                                        {pet.breed}
                                    </Badge>

                                    {pet.status === 'deceased' ? (
                                        <Badge
                                            size="md"
                                            radius="md"
                                            variant="light"
                                            color="gray"
                                            leftSection={<Text size="xs">🕊️</Text>}
                                            style={{ textTransform: 'none' }}
                                        >
                                            {dayjs(pet.birthDate).utc().format('YYYY')} - {pet.deathDate ? dayjs(pet.deathDate).utc().format('YYYY') : '...'}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            size="md"
                                            radius="md"
                                            variant="light"
                                            color="gray" // Gray for date
                                            leftSection={<IconCake size={14} style={{ marginTop: 2 }} />}
                                            style={{ textTransform: 'none' }}
                                        >
                                            {format.dateTime(new Date(pet.birthDate), { year: 'numeric', month: '2-digit', day: '2-digit' })} ({
                                                (() => {
                                                    const age = getPetAge(pet.birthDate);
                                                    if (age.years >= 1) return tPets('ageYears', { count: age.years });
                                                    if (age.months >= 2) return tPets('ageMonths', { count: age.months });
                                                    return tPets('ageDays', { count: age.days === 0 ? 1 : age.days });
                                                })()
                                            })
                                        </Badge>
                                    )}
                                </Flex>
                            </Flex>
                        </Box>
                    </Flex>

                    {pet.status !== 'deceased' && (
                        <Tabs
                            value={activeTab}
                            onChange={onTabChange}
                            variant="outline"
                            radius="md"
                            mt="xl"
                            color={identityColor}
                        >
                            <Tabs.List style={{ flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                                <Tabs.Tab value="summary" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                    {t('tabs.summary')}
                                    {activeTab === 'summary' && <MagicTabBackground />}
                                </Tabs.Tab>
                                <Tabs.Tab value="timeline" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                    {t('tabs.timeline')}
                                    {activeTab === 'timeline' && <MagicTabBackground />}
                                </Tabs.Tab>
                                <Tabs.Tab value="health" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                    {t('tabs.health')}
                                    {activeTab === 'health' && <MagicTabBackground />}
                                </Tabs.Tab>
                                <Tabs.Tab value="gallery" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                    {t('tabs.gallery')}
                                    {activeTab === 'gallery' && <MagicTabBackground />}
                                </Tabs.Tab>
                                {/* <Tabs.Tab value="docs">Documentos</Tabs.Tab> */}
                            </Tabs.List>
                        </Tabs>
                    )}
                </Container>
            </Paper >

            {onAddRecord && (
                <Affix position={{ bottom: 20, right: 20 }} zIndex={199}>
                    <Transition transition="slide-up" mounted={true}>
                        {(transitionStyles) => (
                            <Button
                                leftSection={<IconPlus size={18} />}
                                style={{
                                    ...transitionStyles,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    height: 'auto',
                                    paddingLeft: 12,
                                    paddingRight: 16,
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                }}
                                radius="xl"
                                size="sm"
                                color={identityColor}
                                onClick={onAddRecord}
                                display={{ base: 'flex', xs: 'none' }}
                            >
                                {t('Header.updateRecord')}
                            </Button>
                        )}
                    </Transition>
                </Affix>
            )
            }
        </>
    );
}
