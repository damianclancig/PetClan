'use client';

import { useState, useEffect } from 'react';
import { Modal, Group, Stack, Text, Button, SimpleGrid, Paper, ThemeIcon, TextInput, NumberInput, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconVaccine, IconStethoscope, IconScale, IconPill, IconNote, IconChevronRight, IconCheck, IconCalendarEvent, IconAlertCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { VaccineSlot, getVaccinationSchedule, getVaccineStatus, calculateNextDueDate } from '@/utils/vaccinationUtils';
import { IHealthRecord } from '@/models/HealthRecord';
import { MagicParticles } from '@/components/ui/MagicWrappers';

interface SmartHealthRecordModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    petSpecies: string;
    petBirthDate: Date;
    existingRecords: IHealthRecord[];
    createRecord: (data: any) => Promise<void>;
    isCreating: boolean;
}

type RecordType = 'vaccine' | 'deworming' | 'consultation' | 'weight' | 'other';

export function SmartHealthRecordModal({
    opened,
    onClose,
    petId,
    petSpecies,
    petBirthDate,
    existingRecords,
    createRecord,
    isCreating
}: SmartHealthRecordModalProps) {
    const t = useTranslations('Health'); // Assuming generic keys for now or fallback
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedType, setSelectedType] = useState<RecordType | null>(null);
    const [suggestions, setSuggestions] = useState<VaccineSlot[]>([]);

    const form = useForm({
        initialValues: {
            title: '',
            type: 'vaccine', // default
            appliedAt: new Date(),
            nextDueAt: undefined as Date | undefined,
            description: '',
            weightValue: undefined as number | undefined,
            vaccineType: '' // internal tag for logic
        },
        validate: {
            title: (value) => (value.length < 2 ? 'Titulo requerido' : null),
            appliedAt: (value) => (!value ? 'Fecha requerida' : null),
        },
    });

    // Reset state on open
    useEffect(() => {
        if (opened) {
            setStep(1);
            setSelectedType(null);
            form.reset();
        }
    }, [opened]);

    // Calculate suggestions when type selected
    useEffect(() => {
        if ((selectedType === 'vaccine' || selectedType === 'deworming') && petSpecies) {
            const schedule = getVaccinationSchedule(petSpecies);

            // Filter relevant slots (e.g. pending or overdue)
            // Or just show upcoming ones?
            // "Smart" suggestion: Show "Due Soon" and "Overdue" first.
            const candidates = schedule.filter(slot => {
                const isVac = selectedType === 'vaccine' && !slot.vaccineType.includes('desparasitacion');
                const isDew = selectedType === 'deworming' && slot.vaccineType.includes('desparasitacion');
                if (!isVac && !isDew) return false;

                const status = getVaccineStatus(slot, petBirthDate, existingRecords).status;
                return status === 'pending' || status === 'due_soon' || status === 'overdue' || status === 'current_due';
            });

            setSuggestions(candidates);
        } else {
            setSuggestions([]);
        }
    }, [selectedType, petSpecies, existingRecords]);

    const handleTypeSelect = (type: RecordType) => {
        setSelectedType(type);
        form.setFieldValue('type', type === 'other' ? 'consultation' : type); // Map 'other' to consultation generic or keep distinct if backend supports
        setStep(2);

        // Auto-title for weight
        if (type === 'weight') {
            form.setFieldValue('title', 'Control de Peso');
        }
    };

    const handleSuggestionClick = (slot: VaccineSlot) => {
        form.setValues({
            title: slot.label,
            vaccineType: slot.vaccineType[0], // Store primary tag
            description: `Aplicación de ${slot.label}`,
            nextDueAt: calculateNextDueDate(slot, new Date())
        });
    };

    const handleSubmit = async (values: typeof form.values) => {
        await createRecord({ ...values, petId });
        onClose();
    };

    const renderTypeButton = (type: RecordType, label: string, icon: React.ReactNode, color: string) => (
        <Paper
            component="button"
            onClick={() => handleTypeSelect(type)}
            p="xl"
            radius="md"
            withBorder
            style={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: 'var/(--mantine-color-body)',
                border: '1px solid var(--mantine-color-default-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
            }}
        // Add hover effects via CSS or sx usually, inline strict for now
        >
            <ThemeIcon size={50} radius="xl" color={color} variant="light">
                {icon}
            </ThemeIcon>
            <Text fw={600}>{label}</Text>
        </Paper>
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text size="lg" fw={700}>{step === 1 ? "¿Qué registramos hoy?" : "Detalles del Registro"}</Text>}
            size="lg"
            radius="lg"
        >
            {step === 1 ? (
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                    {renderTypeButton('vaccine', 'Vacuna', <IconVaccine size={28} />, 'blue')}
                    {renderTypeButton('deworming', 'Desparasitación', <IconPill size={28} />, 'green')}
                    {renderTypeButton('consultation', 'Consulta', <IconStethoscope size={28} />, 'teal')}
                    {renderTypeButton('weight', 'Peso', <IconScale size={28} />, 'orange')}
                    {renderTypeButton('other', 'Otro', <IconNote size={28} />, 'gray')}
                </SimpleGrid>
            ) : (
                <Stack>
                    {/* Suggestions Area */}
                    {(selectedType === 'vaccine' || selectedType === 'deworming') && suggestions.length > 0 && (
                        <Paper bg="var(--mantine-color-blue-light)" p="md" radius="md">
                            <Group align="center" mb="xs">
                                <IconAlertCircle size={16} />
                                <Text size="sm" fw={600}>Sugerencias para {petSpecies === 'Cat' ? 'Gato' : 'Mascota'}</Text>
                            </Group>
                            <Group gap="xs">
                                {suggestions.map(slot => (
                                    <MagicParticles key={slot.id}>
                                        <Button
                                            variant="white"
                                            size="xs"
                                            leftSection={<IconCheck size={14} />}
                                            onClick={() => handleSuggestionClick(slot)}
                                            style={{ border: '1px solid #dee2e6' }}
                                        >
                                            {slot.label}
                                        </Button>
                                    </MagicParticles>
                                ))}
                            </Group>
                        </Paper>
                    )}

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Título"
                                placeholder="Ej: Triple Felina"
                                required
                                {...form.getInputProps('title')}
                            />

                            <Group grow>
                                <DateInput
                                    label="Fecha Aplicación"
                                    placeholder="Hoy"
                                    required
                                    maxDate={new Date()}
                                    {...form.getInputProps('appliedAt')}
                                />
                                {(selectedType === 'vaccine' || selectedType === 'deworming') && (
                                    <DateInput
                                        label="Vencimiento / Próxima Dosis"
                                        placeholder="Calculado autom."
                                        minDate={new Date()}
                                        leftSection={<IconCalendarEvent size={16} />}
                                        {...form.getInputProps('nextDueAt')}
                                    />
                                )}
                            </Group>

                            {selectedType === 'weight' && (
                                <NumberInput
                                    label="Peso (kg)"
                                    placeholder="0.00"
                                    precision={2}
                                    min={0}
                                    step={0.1}
                                    required
                                    {...form.getInputProps('weightValue')}
                                />
                            )}

                            {(selectedType === 'consultation' || selectedType === 'other') && (
                                <TextInput
                                    label="Veterinario / Clínica"
                                    placeholder="Opcional"
                                />
                            )}

                            <Textarea
                                label="Notas / Observaciones"
                                placeholder="Detalles adicionales..."
                                rows={3}
                                {...form.getInputProps('description')}
                            />

                            <Group justify="space-between" mt="xl">
                                <Button variant="subtle" color="gray" onClick={() => setStep(1)} leftSection={<IconChevronRight style={{ transform: 'rotate(180deg)' }} />}>
                                    Volver
                                </Button>
                                <Button type="submit" loading={isCreating}>
                                    Guardar Registro
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            )}
        </Modal>
    );
}
