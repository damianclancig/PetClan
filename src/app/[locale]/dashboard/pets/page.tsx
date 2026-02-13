'use client';

import { Text, Button, SimpleGrid, Tabs } from '@mantine/core';
import { PetListSkeleton } from '@/components/ui/Skeletons';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PetCard } from '@/components/pets/PetCard';
import { EmptyPetsState } from '@/components/pets/EmptyPetsState';
import { IconPlus } from '@tabler/icons-react';
import { PageContainer } from '@/components/layout/PageContainer';

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

    if (isError) return <PageContainer><Text c="red">Error al cargar las mascotas.</Text></PageContainer>;

    const actionButton = (
        <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan" leftSection={<IconPlus size={16} />}>
            Nueva Mascota
        </Button>
    );

    return (
        <PageContainer title={t('title')} action={actionButton}>
            <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
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
        </PageContainer>
    );
}
