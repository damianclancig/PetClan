import React from 'react';
import { Title, Text, Stack, List, ThemeIcon, Divider, Box, Group } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconGavel, IconInfoCircle } from '@tabler/icons-react';

export function TermsOfService() {
    return (
        <Stack gap="xl">
            <Box>
                <Title order={3} mb="sm" c="blue.7">1. Aceptación de los Términos</Title>
                <Text lh={1.6}>
                    Bienvenido a <b>PetClan</b> ("la Aplicación"). Al acceder, navegar o utilizar esta aplicación web, usted ("el Usuario") reconoce haber leído, entendido y aceptado incondicionalmente los presentes Términos y Condiciones.
                    Si no está de acuerdo con estos términos, le rogamos que se abstenga de utilizar nuestros servicios.
                    El uso continuado de la Aplicación implica la aceptación de cualquier modificación futura de estos términos.
                </Text>
            </Box>

            <Divider />

            <Box>
                <Group align="center" mb="sm" gap="xs">
                    <ThemeIcon color="red" variant="light" size="lg">
                        <IconAlertTriangle size={20} />
                    </ThemeIcon>
                    <Title order={3} c="red.8">2. Descargo de Responsabilidad Médica y Veterinaria</Title>
                </Group>

                <Text fw={700} mb="xs">
                    IMPORTANTE: PETCLAN NO SUSTITUYE EL ASESORAMIENTO VETERINARIO PROFESIONAL.
                </Text>

                <Text lh={1.6} mb="md">
                    La Aplicación es una herramienta de gestión y registro de información. <b>Bajo ninguna circunstancia</b> la información proporcionada por PetClan (incluyendo alertas, recordatorios, o cálculos de fechas) debe considerarse como un diagnóstico, tratamiento o prescripción médica.
                </Text>

                <List spacing="sm" icon={<ThemeIcon color="red" size={16} radius="xl"><IconInfoCircle size={10} /></ThemeIcon>}>
                    <List.Item>
                        <b>Consultas Profesionales:</b> Siempre busque el consejo de su médico veterinario calificado ante cualquier duda sobre la salud de su mascota.
                    </List.Item>
                    <List.Item>
                        <b>Emergencias:</b> Si cree que su mascota tiene una emergencia médica, contacte a su veterinario inmediatamente. No confíe en la Aplicación para situaciones de vida o muerte.
                    </List.Item>
                    <List.Item>
                        <b>Variabilidad Biológica:</b> Los recordatorios de desparasitación y vacunación son estimaciones basadas en pautas generales. Cada animal es único y puede requerir protocolos diferentes según su estado de salud, raza, edad y entorno.
                    </List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">3. Responsabilidad del Usuario</Title>
                <Text lh={1.6} mb="md">
                    El Usuario es el único responsable de la veracidad, exactitud y actualización de los datos ingresados en la Aplicación.
                </Text>
                <List spacing="sm" icon={<ThemeIcon color="blue" size={16} radius="xl"><IconCheck size={10} /></ThemeIcon>}>
                    <List.Item>
                        <b>Datos de Salud:</b> Usted es responsable de registrar correctamente las fechas de vacunación, pesos y dosis administradas. Errores en la carga de datos resultarán en recordatorios incorrectos.
                    </List.Item>
                    <List.Item>
                        <b>Seguridad de la Cuenta:</b> Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
                    </List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">4. Limitación de Responsabilidad</Title>
                <Text lh={1.6}>
                    En la máxima medida permitida por la ley aplicable, los desarrolladores y propietarios de PetClan no serán responsables por ningún daño directo, indirecto, incidental, especial o consecuente, incluyendo pero no limitado a:
                </Text>
                <List mt="sm" spacing="xs" type="ordered">
                    <List.Item>Daños a la salud o fallecimiento de mascotas derivados del uso o mal uso de la información de la Aplicación.</List.Item>
                    <List.Item>Pérdida de datos, interrupciones del servicio o fallos técnicos.</List.Item>
                    <List.Item>Costos de servicios veterinarios incurridos o no incurridos basados en los recordatorios de la Aplicación.</List.Item>
                </List>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">5. Propiedad Intelectual</Title>
                <Text lh={1.6}>
                    Todo el contenido, diseño, código fuente y logotipos de PetClan son propiedad intelectual exclusiva de sus desarrolladores, salvo que se indique lo contrario (como bibliotecas de código abierto). Queda prohibida la reproducción, distribución o modificación no autorizada.
                </Text>
            </Box>

            <Divider />

            <Box>
                <Title order={3} mb="sm" c="blue.7">6. Privacidad y Datos</Title>
                <Text lh={1.6}>
                    Respetamos su privacidad. Los datos recopilados se utilizan exclusivamente para el funcionamiento de la Aplicación (gestión de perfiles de mascotas). No vendemos ni compartimos sus datos personales con terceros con fines publicitarios.
                </Text>
            </Box>

            <Divider />

            <Box>
                <Group align="center" mb="sm" gap="xs">
                    <ThemeIcon color="gray" variant="light" size="md">
                        <IconGavel size={18} />
                    </ThemeIcon>
                    <Title order={3}>7. Ley Aplicable y Jurisdicción</Title>
                </Group>
                <Text lh={1.6}>
                    Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina. Cualquier disputa relacionada con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
                </Text>
            </Box>
        </Stack>
    );
}
