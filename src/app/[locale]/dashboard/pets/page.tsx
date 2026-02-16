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

    // Fetch ALL pets to filter client-side and determine if we need the Memorias tab
    const { pets, isLoading, isError } = usePets('all');
    const t = useTranslations('Pets');

    if (isError) return <PageContainer><Text c="red">Error al cargar las mascotas.</Text></PageContainer>;

    const actionButton = (
        <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan" leftSection={<IconPlus size={16} />}>
            Nueva Mascota
        </Button>
    );

    // Client-side filtering
    const allPets = pets || [];
    const activePets = allPets.filter((p: any) => ['active', 'lost'].includes(p.status));
    const historyPets = allPets.filter((p: any) => ['deceased', 'archived'].includes(p.status));
    const showHistoryTab = historyPets.length > 0;

    const displayedPets = activeTab === 'active' ? activePets : historyPets;

    return (
        <PageContainer title={t('title')} action={actionButton}>
            {showHistoryTab && (
                <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
                    <Tabs.List>
                        <Tabs.Tab value="active">Mis Mascotas</Tabs.Tab>
                        <Tabs.Tab value="history">Memorias</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            )}

            {isLoading ? (
                <PetListSkeleton />
            ) : displayedPets.length === 0 ? (
                activeTab === 'active' ? (
                    <EmptyPetsState />
                ) : (
                    <Text c="dimmed" fs="italic" ta="center" py="xl">
                        No hay memorias para mostrar.
                    </Text>
                )
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'lg' }}>
                    <AnimatePresence mode="popLayout">
                        {displayedPets
                            .filter((pet: any) => !selectedPetId || pet._id === selectedPetId)
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
