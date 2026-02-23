'use client';

import { Grid, Stack, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ActiveAlertsWidget } from '@/components/dashboard/ActiveAlertsWidget';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { PetSnapshotGrid } from '@/components/dashboard/PetSnapshotGrid';
import { TipsCarousel } from '@/components/ui/TipsCarousel';
import type { DashboardData } from '@/types/dashboard';
import { PageContainer } from '@/components/layout/PageContainer';

interface DashboardViewProps {
    data: DashboardData;
}

export default function DashboardView({ data }: DashboardViewProps) {
    const { userName, pets, alerts } = data;
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <PageContainer>
            <DashboardHeader userName={userName} />

            <Box mb={{ base: 'md', sm: 'xl' }} hiddenFrom="sm">
                <TipsCarousel />
            </Box>

            {pets.length > 0 && (
                <Box mb={{ base: 'md', sm: 'xl' }} hiddenFrom="md">
                    <ActiveAlertsWidget alerts={alerts} />
                </Box>
            )}

            <Grid gutter={{ base: 'md', sm: 'lg' }}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap={isMobile ? 'md' : 'xl'}>
                        <Box>
                            <PetSnapshotGrid pets={pets} alerts={alerts} />
                        </Box>

                        {pets.length > 0 && (
                            <Box>
                                <QuickActionsGrid pets={pets} />
                            </Box>
                        )}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }} visibleFrom="md">
                    <Stack gap="lg">
                        {pets.length > 0 && <ActiveAlertsWidget alerts={alerts} />}
                    </Stack>
                </Grid.Col>
            </Grid>
        </PageContainer>
    );
}
