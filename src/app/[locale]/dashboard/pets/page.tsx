'use client';

import { Title, Text, Button, Group, Container, SimpleGrid, Tabs } from '@mantine/core';
import { PetListSkeleton } from '@/components/ui/Skeletons';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PetCard } from '@/components/pets/PetCard';
import { EmptyPetsState } from '@/components/pets/EmptyPetsState';
import { IconPlus } from '@tabler/icons-react';

import { useRouter } from '@/i18n/routing';
import { AnimatePresence } from 'framer-motion';

export default function PetsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>('active');
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const handlePetClick = (petId: string) => {
        setSelectedPetId(petId);
        setTimeout(() => {
            router.push(`/dashboard/pets/${petId}`);
        }, 500);
    };
    // Si tab es 'active', enviamos undefined para traer (active+lost). Si es 'history', enviamos 'history' (deceased+archived).
    const { pets, isLoading, isError } = usePets(activeTab === 'active' ? undefined : 'history');
    const t = useTranslations('Pets');
    const tCommon = useTranslations('Common');

    if (isError) return <Container><Text c="red">Error al cargar las mascotas.</Text></Container>;

    return (
        <Container size="lg" px={{ base: 5, xs: 'md' }}>
            <Group justify="space-between" mb="xs" px={{ base: 'xs', xs: 0 }}>
                <Title order={2}>{t('title')}</Title>
                <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan" leftSection={<IconPlus size={16} />}>
                    Nueva Mascota
                </Button>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} mb="xl" px={{ base: 'xs', xs: 0 }}>
                <Tabs.List>
                    <Tabs.Tab value="active">Mis Mascotas</Tabs.Tab>
                    <Tabs.Tab value="history">Historial</Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {isLoading ? (
                <PetListSkeleton />
            ) : pets && pets.length === 0 ? (
                activeTab === 'active' ? (
                    <EmptyPetsState />
                ) : (
                    <Text c="dimmed" fs="italic" ta="center" py="xl">
                        No tienes mascotas en el historial.
                    </Text>
                )
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'lg' }}>
                    <AnimatePresence mode="popLayout">
                        {pets
                            ?.filter((pet: any) => !selectedPetId || pet._id === selectedPetId)
                            .map((pet: any) => (
                                <PetCard
                                    key={pet._id}
                                    pet={pet}
                                    layoutId={pet._id}
                                    onClick={() => handlePetClick(pet._id)}
                                />
                            ))}
                    </AnimatePresence>
                </SimpleGrid>
            )}
        </Container>
    );
}
