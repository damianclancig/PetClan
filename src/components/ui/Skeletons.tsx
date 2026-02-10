import { Skeleton, Card, Group, Stack, Grid, SimpleGrid, Container } from '@mantine/core';

export const PetCardSkeleton = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Skeleton height={160} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Skeleton height={20} width="60%" radius="xl" />
                <Skeleton height={20} width={40} radius="xl" />
            </Group>

            <Skeleton height={8} width="90%" radius="xl" mt="sm" />
            <Skeleton height={8} width="70%" radius="xl" mt="xs" />

            <ButtonSkeleton mt="md" />
        </Card>
    );
};

export const PetListSkeleton = () => {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'lg' }}>
            {Array(6).fill(0).map((_, i) => (
                <PetCardSkeleton key={i} />
            ))}
        </SimpleGrid>
    );
};

export const DashboardSkeleton = () => {
    return (
        <Container size="lg">
            <Skeleton height={40} width={200} mb="xl" />
            <PetListSkeleton />
        </Container>
    );
};

export const PetProfileSkeleton = () => {
    return (
        <Container size="lg">
            {/* Header Skeleton */}
            <Card withBorder padding="xl" radius="md" mb="xl">
                <Stack align="center">
                    <Skeleton height={120} circle mb="md" />
                    <Skeleton height={30} width={200} radius="xl" />
                    <Skeleton height={20} width={150} radius="xl" mt="xs" />
                    <Group mt="md">
                        <Skeleton height={30} width={80} radius="md" />
                        <Skeleton height={30} width={80} radius="md" />
                        <Skeleton height={30} width={80} radius="md" />
                    </Group>
                </Stack>
            </Card>

            {/* Content Skeleton */}
            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Skeleton height={300} radius="md" mb="md" />
                    <Skeleton height={150} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Skeleton height={500} radius="md" />
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export const HealthTimelineSkeleton = () => {
    return (
        <Stack>
            {Array(5).fill(0).map((_, i) => (
                <Group key={i} align="flex-start">
                    <Skeleton height={40} circle />
                    <div style={{ flex: 1 }}>
                        <Skeleton height={15} width="40%" radius="xl" mb={5} />
                        <Skeleton height={10} width="80%" radius="xl" />
                    </div>
                </Group>
            ))}
        </Stack>
    )
}

const ButtonSkeleton = ({ mt, width = "100%" }: { mt?: string | number, width?: string | number }) => (
    <Skeleton height={36} radius="md" mt={mt} width={width} />
);
