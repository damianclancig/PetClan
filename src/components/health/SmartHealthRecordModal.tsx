'use client';

import { useState, useEffect } from 'react';
import { Modal, Group, Stack, Text, Button, SimpleGrid, Paper, ThemeIcon, TextInput, NumberInput, Select, Textarea, SegmentedControl, Chip } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconVaccine, IconStethoscope, IconScale, IconPill, IconNote, IconChevronRight, IconCheck, IconCalendarEvent, IconAlertCircle, IconBug } from '@tabler/icons-react';

// ...


import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Import locale
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

type RecordType = 'vaccine' | 'deworming' | 'external_deworming' | 'consultation' | 'weight' | 'other';

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
            vaccineType: '', // internal tag for logic
            dewormingType: 'internal' // default
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

            // Calculate status for all potential slots
            const candidateSlots = schedule.filter(slot => {
                const isVac = selectedType === 'vaccine' && !slot.vaccineType.includes('desparasitacion');
                const isDew = selectedType === 'deworming' && slot.vaccineType.includes('desparasitacion');
                return isVac || isDew;
            }).map(slot => ({
                slot,
                ...getVaccineStatus(slot, petBirthDate, existingRecords)
            }));

            // Filter logic:
            // 1. Must be actionable (not completed, not blocked/pending far in future)
            // 2. Prioritize 'due_now' and 'overdue'.
            // 3. User requested "intelligent" -> Show the RECOMMENDED one.

            // Sort by priority: Overdue > Due Now > Upcoming > Current Due
            const priorityMap: Record<string, number> = {
                'overdue': 4,
                'due_now': 3,
                'current_due': 3,
                'due_soon': 2,
                'pending': 1, // Only if very close?
                'completed': 0,
                'missed_replaced': 0
            };

            const actionable = candidateSlots.filter(c => priorityMap[c.status] >= 2);

            // Sort by priority desc (Higher priority first)
            actionable.sort((a, b) => priorityMap[b.status] - priorityMap[a.status]);

            // "Winner Takes All" Logic:
            // If we have distinct Priorities, show ONLY the highest priority group.
            // Example: If we have "Due Now" (3) and "Due Soon" (2), show ONLY "Due Now".
            // Don't distract user with "Upcoming" if there is something "Due Today".

            if (actionable.length > 0) {
                const maxPriority = priorityMap[actionable[0].status];
                // Filter to keep only those with the top priority found
                const topTier = actionable.filter(c => priorityMap[c.status] === maxPriority);

                // If we still have multiple (e.g. multiple "Due Soon"), maybe allow them.
                // But for "Due Now", usually we want the *first* sequential one.
                // Assuming `schedule` was ordered by age, we can sort topTier by minAgeWeeks to be safe.
                topTier.sort((a, b) => a.slot.minAgeWeeks - b.slot.minAgeWeeks);

                // If strictly sequential required (e.g. 15 days before 30 days), take the first one.
                // For now, let's show all top-tier candidates (e.g. maybe Deworming AND Vaccine are both due today).
                setSuggestions(topTier.map(c => c.slot));
            } else {
                setSuggestions([]);
            }
        } else if (selectedType === 'external_deworming') {
            // Synthetic suggestion for External
            setSuggestions([{
                id: 'synthetic_external',
                label: 'Pipeta / Comprimido Mensual',
                ageLabel: 'Mensual',
                minAgeWeeks: 0,
                maxAgeWeeks: 1000,
                vaccineType: ['external'],
                isCore: true
            }]);
        } else {
            setSuggestions([]);
        }
    }, [selectedType, petSpecies, existingRecords, petBirthDate]);

    // External Deworming State
    const [externalMethod, setExternalMethod] = useState<'pipette' | 'tablet' | 'collar'>('pipette');
    const [externalDuration, setExternalDuration] = useState<string>('30');
    const [externalTargets, setExternalTargets] = useState<string[]>(['fleas', 'ticks']);

    // Sync form with external deworming helpers
    // Sync form with external deworming helpers
    useEffect(() => {
        if (selectedType === 'external_deworming') {
            const daysMap: Record<string, number> = { '30': 30, '60': 60, '90': 90 };
            const days = daysMap[externalDuration] || 30;

            const methodLabel = {
                'pipette': 'Pipeta',
                'tablet': 'Comprimido',
                'collar': 'Collar'
            }[externalMethod];

            const targetLabels = {
                'fleas': 'Pulgas',
                'ticks': 'Garrapatas',
                'mosquitoes': 'Mosquitos'
            };

            const selectedTargets = externalTargets.map(t => targetLabels[t as keyof typeof targetLabels]).join(', ');

            // Auto-generate title logic
            let title = `${methodLabel} (${days} días)`;
            if (externalDuration === 'other') title = `${methodLabel} - Manual`;
            if (externalMethod === 'collar') title = `Collar ${externalDuration === 'other' ? '' : '(' + externalDuration + ' días)'}`;

            // Guards to prevent infinite loops
            if (form.values.title !== title) {
                form.setFieldValue('title', title);
            }

            const description = `Protección contra: ${selectedTargets}`;
            if (form.values.description !== description) {
                form.setFieldValue('description', description);
            }

            if (externalDuration !== 'other') {
                const appliedDate = form.values.appliedAt instanceof Date ? form.values.appliedAt : new Date();
                const nextDue = dayjs(appliedDate).add(days, 'day').toDate();

                if (form.values.nextDueAt instanceof Date) {
                    if (form.values.nextDueAt.getTime() !== nextDue.getTime()) {
                        form.setFieldValue('nextDueAt', nextDue);
                    }
                } else {
                    form.setFieldValue('nextDueAt', nextDue);
                }
            }
        }
    }, [externalMethod, externalDuration, externalTargets, selectedType, form.values.appliedAt]);




    const handleTypeSelect = (type: RecordType) => {
        setSelectedType(type);

        if (type === 'external_deworming') {
            form.setValues({
                type: 'deworming',
                dewormingType: 'external',
                title: '', // Auto-generated by effect
                nextDueAt: undefined, // Auto-generated by effect
                description: 'Protección contra pulgas y garrapatas'
            });
        } else if (type === 'deworming') {
            form.setValues({
                type: 'deworming',
                dewormingType: 'internal',
                title: '', // User will likely click suggestion
                nextDueAt: undefined,
                description: ''
            });
        } else {
            form.setFieldValue('type', type === 'other' ? 'consultation' : type);
        }

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

    const toggleTarget = (target: string) => {
        setExternalTargets(prev =>
            prev.includes(target)
                ? prev.filter(t => t !== target)
                : [...prev, target]
        );
    };

    const renderMethodCard = (value: 'pipette' | 'tablet' | 'collar', label: string) => {
        const isSelected = externalMethod === value;
        return (
            <Paper
                component="button"
                type="button"
                onClick={() => setExternalMethod(value)}
                p="xs"
                radius="md"
                withBorder
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? 'var(--mantine-color-blue-6)' : undefined,
                    borderColor: isSelected ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-default-border)',
                    height: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                }}
            >
                <Text size="lg">{value === 'pipette' ? '💧' : value === 'tablet' ? '💊' : '🧣'}</Text>
                <Text size="xs" fw={700} c={isSelected ? 'white' : 'dimmed'} style={{ lineHeight: 1.1 }}>{label}</Text>
            </Paper>
        );
    };

    const renderDurationCard = (value: string, label: string) => {
        const isSelected = externalDuration === value;
        return (
            <Paper
                component="button"
                type="button"
                onClick={() => setExternalDuration(value)}
                p="xs"
                radius="md"
                withBorder
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? 'var(--mantine-color-grape-6)' : undefined,
                    borderColor: isSelected ? 'var(--mantine-color-grape-6)' : 'var(--mantine-color-default-border)',
                    height: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                }}
            >
                <Text size="lg" fw={800} c={isSelected ? 'white' : 'dimmed'}>{value === 'other' ? '📅' : value}</Text>
                <Text size="xs" fw={700} c={isSelected ? 'white' : 'dimmed'} style={{ lineHeight: 1.1 }}>{label}</Text>
            </Paper>
        );
    };

    const renderProtectionCard = (target: string, label: string, color: string) => {
        const isSelected = externalTargets.includes(target);
        return (
            <Paper
                component="button"
                type="button"
                onClick={() => toggleTarget(target)}
                p="xs"
                radius="md"
                withBorder
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? `var(--mantine-color-${color}-6)` : undefined,
                    borderColor: isSelected ? `var(--mantine-color-${color}-6)` : 'var(--mantine-color-default-border)',
                    height: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                }}
            >
                <ThemeIcon
                    size={24}
                    radius="xl"
                    color={isSelected ? 'white' : color}
                    variant={isSelected ? 'transparent' : 'light'}
                >
                    <IconBug size={16} />
                </ThemeIcon>
                <Text size="xs" fw={700} c={isSelected ? 'white' : 'dimmed'} style={{ lineHeight: 1.1 }}>{label}</Text>
            </Paper>
        );
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
                backgroundColor: 'var(--mantine-color-body)',
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
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            {step === 1 ? (
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                    {renderTypeButton('vaccine', 'Vacuna', <IconVaccine size={28} />, 'blue')}
                    {renderTypeButton('deworming', 'Desp. Interna', <IconPill size={28} />, 'green')}
                    {renderTypeButton('external_deworming', 'Desp. Externa', <IconBug size={28} />, 'lime')}
                    {renderTypeButton('consultation', 'Consulta', <IconStethoscope size={28} />, 'teal')}
                    {renderTypeButton('weight', 'Peso', <IconScale size={28} />, 'orange')}
                    {renderTypeButton('other', 'Otro', <IconNote size={28} />, 'gray')}
                </SimpleGrid>
            ) : (
                <Stack>
                    {/* Suggestions Area */}
                    {(selectedType === 'vaccine' || selectedType === 'deworming' || selectedType === 'external_deworming') && suggestions.length > 0 && (
                        <Paper bg="var(--mantine-color-blue-light)" p="md" radius="md">
                            <Group align="center" mb="xs">
                                <IconAlertCircle size={16} color="var(--mantine-color-blue-7)" />
                                <Text size="sm" fw={700} c="blue.8">
                                    {suggestions.length === 1 ? 'Recomendado para hoy:' : 'Opciones recomendadas:'}
                                </Text>
                            </Group>
                            <Group gap="xs">
                                {suggestions.map(slot => (
                                    <MagicParticles key={slot.id}>
                                        <Button
                                            variant="filled"
                                            color="blue"
                                            size="sm"
                                            radius="xl"
                                            leftSection={<IconCheck size={16} />}
                                            onClick={() => handleSuggestionClick(slot)}
                                            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
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
                            {selectedType === 'external_deworming' && (
                                <Paper withBorder p="sm" radius="md">
                                    <Stack gap="sm">
                                        <Text size="sm" fw={600} c="dimmed">Configuración del Producto</Text>

                                        <SimpleGrid cols={3} spacing="xs">
                                            {renderMethodCard('pipette', 'Pipeta')}
                                            {renderMethodCard('tablet', 'Comprimido')}
                                            {renderMethodCard('collar', 'Collar')}
                                        </SimpleGrid>

                                        <Stack gap={4}>
                                            <Text size="xs" fw={500}>Duración</Text>
                                            <SimpleGrid cols={4} spacing="xs">
                                                {renderDurationCard('30', 'Días')}
                                                {renderDurationCard('60', 'Días')}
                                                {renderDurationCard('90', 'Días')}
                                                {renderDurationCard('other', 'Otro')}
                                            </SimpleGrid>
                                        </Stack>

                                        <Stack gap={4}>
                                            <Text size="xs" fw={500}>Protección</Text>
                                            <SimpleGrid cols={3} spacing="xs">
                                                {renderProtectionCard('fleas', 'Pulgas', 'red')}
                                                {renderProtectionCard('ticks', 'Garrapatas', 'orange')}
                                                {renderProtectionCard('mosquitoes', 'Mosquitos', 'teal')}
                                            </SimpleGrid>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )}

                            <TextInput
                                label="Título"
                                placeholder="Ej: Triple Felina"
                                required
                                {...form.getInputProps('title')}
                            />

                            <Group grow>
                                <DateInput
                                    label="Fecha Aplicación"
                                    placeholder="DD/MM/AAAA"
                                    required
                                    maxDate={new Date()}
                                    valueFormat="DD/MM/YYYY"
                                    clearable
                                    locale="es"
                                    popoverProps={{ withinPortal: true, zIndex: 10000 }}
                                    {...form.getInputProps('appliedAt')}
                                />
                                {(selectedType === 'vaccine' || selectedType === 'deworming') && (
                                    <DateInput
                                        label="Vencimiento / Próxima Dosis"
                                        placeholder="Calculado autom."
                                        minDate={new Date()}
                                        valueFormat="DD/MM/YYYY"
                                        clearable
                                        locale="es"
                                        leftSection={<IconCalendarEvent size={16} />}
                                        popoverProps={{ withinPortal: true, zIndex: 10000 }}
                                        {...form.getInputProps('nextDueAt')}
                                    />
                                )}
                            </Group>

                            {selectedType === 'weight' && (
                                <NumberInput
                                    label="Peso (kg)"
                                    placeholder="0.00"
                                    decimalScale={2}
                                    fixedDecimalScale
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
