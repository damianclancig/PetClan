'use client';

import { Container, Grid, Stack, Box } from '@mantine/core';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ActiveAlertsWidget } from '@/components/dashboard/ActiveAlertsWidget';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { PetSnapshotGrid } from '@/components/dashboard/PetSnapshotGrid';
import { TipsCarousel } from '@/components/ui/TipsCarousel';
import type { DashboardData } from '@/types/dashboard';

interface DashboardViewProps {
    data: DashboardData;
}

export default function DashboardView({ data }: DashboardViewProps) {
    const { userName, pets, alerts } = data;

    return (
        <Container size="xl" py="lg">
            <DashboardHeader userName={userName} />

            <Box mb="xl" hiddenFrom="sm">
                <TipsCarousel />
            </Box>

            <Box mb="xl" hiddenFrom="md">
                <ActiveAlertsWidget alerts={alerts} />
            </Box>

            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="xl">
                        <Box>
                            <PetSnapshotGrid pets={pets} alerts={alerts} />
                        </Box>

                        <Box>
                            <QuickActionsGrid />
                        </Box>
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }} visibleFrom="md">
                    <Stack gap="lg">
                        <ActiveAlertsWidget alerts={alerts} />
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
