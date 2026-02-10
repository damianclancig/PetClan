import { Title, Text, Container, Box } from '@mantine/core';
import { TipsCarousel } from '@/components/ui/TipsCarousel';

export default function DashboardPage() {
    return (
        <Container>
            <Title order={2}>Panel Principal</Title>
            <Text>Bienvenido a tu panel de control. Selecciona una opción del menú para comenzar.</Text>

            <Box mt="md" hiddenFrom="sm">
                <TipsCarousel />
            </Box>
        </Container>
    );
}
