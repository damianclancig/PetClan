import { Title, Text, Container } from '@mantine/core';

export default function DashboardPage() {
    return (
        <Container>
            <Title order={2}>Panel Principal</Title>
            <Text>Bienvenido a tu panel de control. Selecciona una opción del menú para comenzar.</Text>
        </Container>
    );
}
