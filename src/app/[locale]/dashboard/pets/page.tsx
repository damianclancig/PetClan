'use client';

import { Title, Text, Button, Group, Container, SimpleGrid, Loader, Tabs } from '@mantine/core';
import { Link } from '@/i18n/routing';
import { usePets } from '@/hooks/usePets';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PetCard } from '@/components/pets/PetCard';

export default function PetsPage() {
    const [activeTab, setActiveTab] = useState<string | null>('active');
    // Si tab es 'active', enviamos undefined para traer (active+lost). Si es 'history', enviamos 'history' (deceased+archived).
    const { pets, isLoading, isError } = usePets(activeTab === 'active' ? undefined : 'history');
    const t = useTranslations('Pets');
    const tCommon = useTranslations('Common');

    if (isLoading) return <Container><Loader /></Container>;
    if (isError) return <Container><Text c="red">Error al cargar las mascotas.</Text></Container>;

    return (
        <Container size="lg">
            <Group justify="space-between" mb="xs">
                <Title order={2}>{t('title')}</Title>
                <Button component={Link} href="/dashboard/pets/new" variant="filled" color="cyan">
                    {t('addPet')}
                </Button>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
                <Tabs.List>
                    <Tabs.Tab value="active">Mis Mascotas</Tabs.Tab>
                    <Tabs.Tab value="history">Historial</Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {pets && pets.length === 0 ? (
                <Text c="dimmed" fs="italic" ta="center" py="xl">
                    {activeTab === 'active' ? t('noPets') : 'No tienes mascotas en el historial.'}
                </Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    {pets?.map((pet: any) => (
                        <PetCard key={pet._id} pet={pet} />
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
