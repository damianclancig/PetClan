import { Container, Title, Text, Avatar, Group, Paper, Badge, Button, Stack } from '@mantine/core';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import HealthRecord from '@/models/HealthRecord';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { calculateVaccineStatus } from '@/lib/healthUtils';

// Force dynamic to ensure we always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function PublicPetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await dbConnect();

    let pet;
    let records = [];

    try {
        pet = await Pet.findById(id);
        if (pet) {
            // Need to convert to plain object or iterate doc
            // Also timestamps might be objects
            records = await HealthRecord.find({ petId: id }).lean();
        }
    } catch {
        notFound();
    }

    if (!pet) {
        notFound();
    }

    // Cast records for utility
    const { isUpToDate, hasRabies, overdueCount } = calculateVaccineStatus(records as any[]);

    return (
        <Container size="xs" py="xl">
            <Paper withBorder p="xl" radius="md" shadow="sm">
                <Group justify="center" mb="md">
                    <Avatar size={150} radius={150} color="cyan" src={pet.photoUrl || null} alt={pet.name}>
                        {pet.name.charAt(0)}
                    </Avatar>
                </Group>

                <Title order={1} ta="center" mb="xs">{pet.name}</Title>

                <Group justify="center" mb="md">
                    <Badge size="lg" variant="dot">{pet.species}</Badge>
                </Group>

                <Stack align="center" gap="xs" mb="xl">
                    {isUpToDate ? (
                        <Badge color="green" size="lg" variant="light">✅ Vacunas al día</Badge>
                    ) : (
                        <Badge color="orange" size="lg" variant="light">⚠️ Vacunas vencidas ({overdueCount})</Badge>
                    )}

                    {hasRabies && (
                        <Badge color="blue" size="lg" variant="light">💉 Antirábica Vigente</Badge>
                    )}
                </Stack>

                <Group justify="space-between" py="xs" style={{ borderBottom: '1px solid #eee' }}>
                    <Text c="dimmed">Raza</Text>
                    <Text fw={500}>{pet.breed}</Text>
                </Group>

                <Group justify="space-between" py="xs" style={{ borderBottom: '1px solid #eee' }}>
                    <Text c="dimmed">Sexo</Text>
                    <Text fw={500}>{pet.sex === 'male' ? 'Macho' : 'Hembra'}</Text>
                </Group>

                <Group justify="space-between" py="xs" style={{ borderBottom: '1px solid #eee' }}>
                    <Text c="dimmed">Edad</Text>
                    <Text fw={500}>{dayjs().diff(pet.birthDate, 'year')} años</Text>
                </Group>

                {pet.chipId && (
                    <Group justify="space-between" py="xs" style={{ borderBottom: '1px solid #eee' }}>
                        <Text c="dimmed">Chip ID</Text>
                        <Text fw={500}>{pet.chipId}</Text>
                    </Group>
                )}

                <Text ta="center" size="sm" c="dimmed" mt="xl">
                    Perfil verificado en <strong>PetClan</strong> 🐾
                </Text>

                <Group justify="center" mt="md">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button variant="subtle" size="xs">
                            Ir a PetClan
                        </Button>
                    </Link>
                </Group>
            </Paper>
        </Container>
    );
}
