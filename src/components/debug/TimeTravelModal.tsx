/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Modal, NumberInput, Button, Group, Stack, Text } from '@mantine/core';
import { isDev } from '@/utils/env';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconHistory } from '@tabler/icons-react';

interface TimeTravelModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
}

export function TimeTravelModal({ opened, onClose, petId }: TimeTravelModalProps) {
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState<number | string>(7);

    if (!isDev) return null;

    const handleTravel = async () => {
        if (!days) return;

        setLoading(true);
        try {
            const res = await fetch('/api/debug/time-travel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    petId,
                    days: Number(days),
                }),
            });

            if (!res.ok) throw new Error('Time travel failed');

            notifications.show({
                title: 'Tiempo Simulado',
                message: `Se han simulado ${days} días. Recargando...`,
                color: 'blue',
            });

            window.location.reload();
            onClose();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Falló la simulación.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Simular Paso del Tiempo ⏳" centered>
            <Stack>
                <Text size="sm" c="dimmed">
                    Esta herramienta es para desarrollo. Avanzará la edad de la mascota y moverá todos los registros médicos al pasado para simular que ha pasado el tiempo.
                </Text>
                <NumberInput
                    label="Días a avanzar"
                    placeholder="Ej: 30"
                    value={days}
                    onChange={setDays}
                    min={1}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setDays(7)}>+1 Sem</Button>
                    <Button variant="default" onClick={() => setDays(30)}>+1 Mes</Button>
                    <Button onClick={handleTravel} loading={loading} color="orange" leftSection={<IconHistory size={16} />}>Simular</Button>
                </Group>

                <Group justify="flex-end">
                    <Button fullWidth onClick={handleTravel} loading={loading} color="orange" leftSection={<IconHistory size={16} />}>
                        Simular Crecimiento
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
