'use client';

import { Box, Container, Avatar, Title, Text, Flex, Badge, Paper, Tabs, rem, ActionIcon, Menu, Button, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { getPetIdentityColor } from '@/utils/pet-identity';
import { PetSpeciesBadge } from '../PetSpeciesBadge';
import { HoverScale, ActionIconMotion, MagicTabBackground } from '@/components/ui/MotionWrappers';
import { MagicParticles } from '@/components/ui/MagicWrappers';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { formatAge } from '@/lib/dateUtils';
import { IconPencil, IconShare, IconDotsVertical, IconCheck, IconArrowBackUp, IconHistory, IconCake, IconDna, IconPlus } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { TimeTravelModal } from '@/components/debug/TimeTravelModal';

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
    const identityColor = getPetIdentityColor(pet._id);
    const [showTimeTravel, setShowTimeTravel] = useState(false);

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
                                    Actualizar Libreta
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

                    {/* Name Positioning */}
                    <Container size="lg" h="100%">
                        <Flex
                            h="100%"
                            align={{ base: 'flex-start', xs: 'flex-end' }}
                            justify={{ base: 'center', xs: 'flex-start' }}
                            pb={{ base: 0, xs: 16 }}
                            pl={{ base: 0, xs: 160 }}
                            pt={{ base: 20, xs: 0 }}
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
                                Volver
                            </Button>
                        </MagicParticles>
                    </HoverScale>

                    {/* Actions Top Right */}
                    <Flex style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }} gap="xs" align="center">
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
                                    Actualizar Libreta
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
                                    aria-label="Compartir"
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
                                    aria-label="Editar"
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
                                    aria-label="Simular Tiempo"
                                    onClick={() => setShowTimeTravel(true)}
                                >
                                    <IconHistory size={18} />
                                </ActionIcon>
                            </ActionIconMotion>
                        </MagicParticles>
                    </Flex>
                </Box>

                <TimeTravelModal
                    opened={showTimeTravel}
                    onClose={() => setShowTimeTravel(false)}
                    petId={pet._id}
                />

                <Container size="lg" style={{ marginTop: -60, paddingBottom: 16, position: 'relative' }}>
                    <Flex
                        direction={{ base: 'column', xs: 'row' }}
                        align={{ base: 'center', xs: 'flex-start' }} // Align top to start badges below name visual
                        gap={{ base: 'sm', xs: 'md' }}
                    >
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
                        >
                            {pet.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box
                            style={{ flex: 1 }}
                            mt={{ base: 0, xs: 72 }} // Push badges down on desktop to clear overlapped area
                            ta={{ base: 'center', xs: 'left' }}
                        >
                            <Flex gap={8} justify={{ base: 'center', xs: 'flex-start' }} wrap="wrap" align="center">
                                <PetSpeciesBadge
                                    species={pet.species}
                                    sex={pet.sex}
                                    color={identityColor}
                                    size="lg"
                                />

                                <Badge
                                    size="lg"
                                    radius="md"
                                    variant="light" // Light variant looks good on surface
                                    color={identityColor} // Use identity color for consistency
                                    leftSection={<IconDna size={16} style={{ marginTop: 4 }} />}
                                    style={{ textTransform: 'none' }}
                                >
                                    {pet.breed}
                                </Badge>

                                <Badge
                                    size="lg"
                                    radius="md"
                                    variant="light"
                                    color="gray" // Gray for date
                                    leftSection={<IconCake size={16} style={{ marginTop: 2 }} />}
                                    style={{ textTransform: 'none' }}
                                >
                                    {dayjs(pet.birthDate).utc().format('DD/MM/YY')} ({formatAge(pet.birthDate)})
                                </Badge>
                            </Flex>
                        </Box>
                    </Flex>

                    <Tabs
                        value={activeTab}
                        onChange={onTabChange}
                        variant="outline"
                        radius="md"
                        mt="xl"
                        color={identityColor}
                    >
                        <Tabs.List>
                            <Tabs.Tab value="summary" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                Resumen
                                {activeTab === 'summary' && <MagicTabBackground />}
                            </Tabs.Tab>
                            <Tabs.Tab value="timeline" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                Línea de tiempo
                                {activeTab === 'timeline' && <MagicTabBackground />}
                            </Tabs.Tab>
                            <Tabs.Tab value="health" style={{ position: 'relative', zIndex: 1, transition: 'color 0.2s' }}>
                                Salud
                                {activeTab === 'health' && <MagicTabBackground />}
                            </Tabs.Tab>
                            {/* <Tabs.Tab value="docs">Documentos</Tabs.Tab> */}
                        </Tabs.List>
                    </Tabs>
                </Container>
            </Paper>

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
                                Actualizar
                            </Button>
                        )}
                    </Transition>
                </Affix>
            )}
        </>
    );
}
