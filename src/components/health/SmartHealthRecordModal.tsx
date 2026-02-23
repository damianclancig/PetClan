'use client';

import { useState, useEffect } from 'react';
import { Modal, Group, Stack, Text, Button, SimpleGrid, Paper, ThemeIcon, TextInput, NumberInput, Select, Textarea, SegmentedControl, Chip, Autocomplete } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconVaccine, IconStethoscope, IconScale, IconPill, IconNote, IconChevronRight, IconCheck, IconCalendarEvent, IconAlertCircle, IconBug, IconDroplet, IconCalendar, IconSparkles, IconShieldCheck } from '@tabler/icons-react';

// ...


import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Import locale
import { VaccineSlot, getVaccinationSchedule, getVaccineStatus, calculateNextDueDate } from '@/utils/vaccinationUtils';
import { IHealthRecord } from '@/models/HealthRecord';
import { MagicParticles } from '@/components/ui/MagicWrappers';
import { CounterInput } from '@/components/ui/CounterInput';

interface SmartHealthRecordModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    petSpecies: string;
    petBirthDate: Date;
    existingRecords: IHealthRecord[];
    createRecord: (data: any) => Promise<void>;
    isCreating: boolean;
    initialConfig?: { type?: RecordType; title?: string; vaccineType?: string };
    onSwitchToWeight?: () => void;
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
    isCreating,
    initialConfig,
    onSwitchToWeight
}: SmartHealthRecordModalProps) {
    const t = useTranslations('SmartRecord');
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
            dewormingType: 'internal', // default
            durationDays: undefined as number | undefined // Para desparasitación externa
        },
        validate: {
            title: (value) => (value.length < 2 ? t('form.validationTitle') : null),
            appliedAt: (value) => (!value ? t('form.validationDate') : null),
        },
    });

    // Reset state on open
    useEffect(() => {
        if (opened) {
            form.reset();

            if (initialConfig) {
                // Skip directly to step 2 if type is provided
                if (initialConfig.type) {
                    setSelectedType(initialConfig.type);
                    setStep(2);
                    form.setValues({
                        type: initialConfig.type as any,
                        title: initialConfig.title || '',
                        vaccineType: initialConfig.vaccineType || '' // e.g. 'rabies'
                    });
                }
            } else {
                setStep(1);
                setSelectedType(null);
            }
        }
    }, [opened, initialConfig]);

    // Calculate suggestions when type selected
    useEffect(() => {
        if (!selectedType || !petSpecies) {
            setSuggestions([]);
            return;
        }

        const schedule = getVaccinationSchedule(petSpecies);
        const records = existingRecords || [];

        // 1. Strict Category Filtering
        const relevantSlots = schedule.filter(slot => {
            const isDeworming = slot.vaccineType.some(t => t.includes('desparasitacion') || t.includes('deworming'));
            const isExternal = slot.vaccineType.some(t => t === 'external' || t === 'pulgas' || t === 'garrapatas' || t.includes('pipeta'));

            if (selectedType === 'vaccine') {
                // Must be a vaccine (not deworming, not external)
                return !isDeworming && !isExternal;
            }

            if (selectedType === 'deworming') {
                // Must be internal deworming
                return isDeworming && !isExternal;
            }

            // External deworming handled separately via synthetic or special UI usually, 
            // but if we used slots for it:
            if (selectedType === 'external_deworming') {
                return isExternal;
            }

            return false;
        });

        // 2. Calculate Status for Relevant Slots
        const candidates = relevantSlots.map(slot => ({
            slot,
            ...getVaccineStatus(slot, petBirthDate, records)
        }));

        // 3. Priority & Filtering Logic
        // We want to show "Due Now", "Overdue", and maybe "Due Soon".
        // We do NOT want to show "Completed" or "Missed/Replaced" (unless debugging).

        const priorityScore = (status: string, isCore: boolean): number => {
            switch (status) {
                case 'overdue': return 4 + (isCore ? 1 : 0);
                case 'due_now': return 4 + (isCore ? 1 : 0); // Equal urgency to overdue
                case 'current_due': return 3 + (isCore ? 1 : 0);
                case 'due_soon': return 2;
                default: return 0;
            }
        };

        const actionable = candidates.filter(c => {
            const score = priorityScore(c.status, c.slot.isCore);
            return score >= 2; // Show Due Soon, Current Due, Due Now, Overdue
        });

        // Sort by Score Descending
        actionable.sort((a, b) => {
            const scoreA = priorityScore(a.status, a.slot.isCore);
            const scoreB = priorityScore(b.status, b.slot.isCore);
            return scoreB - scoreA;
        });

        // 4. Selection Strategy
        // Instead of "Winner Takes All", we show TOP recommendations.
        // If we have multiple high-priority core vaccines (e.g. Polyvalent + Rabies), show BOTH.

        if (actionable.length > 0) {
            const bestScore = priorityScore(actionable[0].status, actionable[0].slot.isCore);
            // Show everything that is within a close range of the best score, 
            // OR explicitly all "Core" vaccines that are due.

            // Heuristic: Show all candidates that are at least "Current Due" (Score >= 3)
            // If nothing is Current Due, show "Due Soon".

            const threshold = bestScore >= 3 ? 3 : 2;
            const finalSuggestions = actionable.filter(c => priorityScore(c.status, c.slot.isCore) >= threshold);

            // Sort by age (legacy order) effectively to keep logical order (e.g. Dose 1 before Dose 2)
            // utilizing the original index in schedule or minAgeWeeks
            finalSuggestions.sort((a, b) => a.slot.minAgeWeeks - b.slot.minAgeWeeks);

            setSuggestions(finalSuggestions.map(c => c.slot));
        } else {
            setSuggestions([]);
        }

    }, [selectedType, petSpecies, existingRecords, petBirthDate]);

    // External Deworming State
    const [externalMethod, setExternalMethod] = useState<'pipette' | 'tablet' | 'collar' | 'other'>('pipette');
    const [customMethodName, setCustomMethodName] = useState<string>(''); // For 'other' method
    const [externalDuration, setExternalDuration] = useState<string>('30');
    const [customDurationDays, setCustomDurationDays] = useState<number | ''>(30); // For 'other' duration
    const [externalTargets, setExternalTargets] = useState<string[]>(['fleas', 'ticks']);

    // Sync form with external deworming helpers
    useEffect(() => {
        if (selectedType === 'external_deworming') {
            const daysMap: Record<string, number> = { '30': 30, '60': 60, '90': 90 };
            // If 'other', use customDurationDays (default 30 if empty/invalid for safety in calc, but UI shows input)
            const days = externalDuration === 'other' ? (typeof customDurationDays === 'number' ? customDurationDays : 30) : (daysMap[externalDuration] || 30);

            // Determine Method Label
            let methodLabel = '';
            if (externalMethod === 'other') {
                methodLabel = customMethodName || t('external.defaultProduct');
            } else {
                methodLabel = ({
                    'pipette': t('external.methodPipette'),
                    'tablet': t('external.methodTablet'),
                    'collar': t('external.methodCollar')
                } as Record<string, string>)[externalMethod];
            }

            const targetLabels: Record<string, string> = {
                'fleas': t('external.targetFleas'),
                'ticks': t('external.targetTicks'),
                'mosquitoes': t('external.targetMosquitoes')
            };

            const selectedTargets = externalTargets.map(t => targetLabels[t as keyof typeof targetLabels]).join(', ');

            // Auto-generate title logic
            let title = t('external.titleTemplate', { method: methodLabel, days });

            // Guards to prevent infinite loops
            if (form.values.title !== title) {
                form.setFieldValue('title', title);
            }

            const description = t('external.descTemplate', { targets: selectedTargets });
            if (form.values.description !== description) {
                form.setFieldValue('description', description);
            }

            // Calculate Next Due Date
            const appliedDate = form.values.appliedAt instanceof Date ? form.values.appliedAt : new Date();
            const nextDue = dayjs(appliedDate).add(days, 'day').toDate();

            // Persist durationDays numericalmente (independiente del idioma)
            if (form.values.durationDays !== days) {
                form.setFieldValue('durationDays', days);
            }

            if (form.values.nextDueAt instanceof Date) {
                if (form.values.nextDueAt.getTime() !== nextDue.getTime()) {
                    form.setFieldValue('nextDueAt', nextDue);
                }
            } else {
                form.setFieldValue('nextDueAt', nextDue);
            }
        }
    }, [externalMethod, customMethodName, externalDuration, customDurationDays, externalTargets, selectedType, form.values.appliedAt]);




    const handleTypeSelect = (type: RecordType) => {
        // Reset form to base state to prevent carry-over from previous edits if any
        form.reset();

        // Intercept Weight Selection if handler provided
        if (type === 'weight' && onSwitchToWeight) {
            onSwitchToWeight();
            return;
        }

        setSelectedType(type);

        // Set specific defaults based on type
        if (type === 'external_deworming') {
            form.setValues({
                type: 'deworming',
                dewormingType: 'external',
                title: '', // Auto-generated by effect
                nextDueAt: undefined, // Auto-generated by effect
                description: t('externalTitleDefault')
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

    const renderMethodCard = (value: 'pipette' | 'tablet' | 'collar' | 'other', label: string) => {
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
                <ThemeIcon variant="transparent" size="lg" color={isSelected ? 'white' : 'blue'}>
                    {value === 'pipette' ? <IconDroplet size={24} /> : value === 'tablet' ? <IconPill size={24} /> : value === 'collar' ? <IconShieldCheck size={24} /> : <IconSparkles size={24} />}
                </ThemeIcon>
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
                <ThemeIcon variant="transparent" size="lg" color={isSelected ? 'white' : 'grape'}>
                    {value === 'other' ? <IconCalendar size={24} /> : <Text fw={800} size="xl" c="inherit">{value}</Text>}
                </ThemeIcon>
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
            title={<Text size="lg" fw={700}>{step === 1 ? t('stepTitle') : t('stepDetails')}</Text>}
            size="lg"
            radius="lg"
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            {step === 1 ? (
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                    {renderTypeButton('vaccine', t('types.vaccine'), <IconVaccine size={28} />, 'blue')}
                    {renderTypeButton('deworming', t('types.deworming'), <IconPill size={28} />, 'green')}
                    {renderTypeButton('external_deworming', t('types.externalDeworming'), <IconBug size={28} />, 'lime')}
                    {renderTypeButton('consultation', t('types.consultation'), <IconStethoscope size={28} />, 'teal')}
                    {renderTypeButton('weight', t('types.weight'), <IconScale size={28} />, 'orange')}
                    {renderTypeButton('other', t('types.other'), <IconNote size={28} />, 'gray')}
                </SimpleGrid>
            ) : (
                <Stack>
                    {/* Suggestions Area - Hidden for External Deworming as per user request */}
                    {(selectedType === 'vaccine' || selectedType === 'deworming') && suggestions.length > 0 && (
                        <Paper bg="var(--mantine-color-blue-light)" p="md" radius="md">
                            <Group align="center" mb="xs">
                                <IconAlertCircle size={16} color="var(--mantine-color-blue-7)" />
                                <Text size="sm" fw={700} c="blue.8">
                                    {suggestions.length === 1 ? t('suggestions.one') : t('suggestions.many')}
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
                                        <Text size="sm" fw={600} c="dimmed">{t('external.productConfig')}</Text>

                                        <SimpleGrid cols={4} spacing="xs">
                                            {renderMethodCard('pipette', t('external.methodPipette'))}
                                            {renderMethodCard('tablet', t('external.methodTablet'))}
                                            {renderMethodCard('collar', t('external.methodCollar'))}
                                            {renderMethodCard('other', t('external.methodOther'))}
                                        </SimpleGrid>

                                        {externalMethod === 'other' && (
                                            <TextInput
                                                label={t('external.productType')}
                                                placeholder={t('external.productTypePlaceholder')}
                                                value={customMethodName}
                                                onChange={(e) => setCustomMethodName(e.currentTarget.value)}
                                                required
                                            />
                                        )}

                                        <Stack gap={4}>
                                            <Text size="xs" fw={500}>{t('external.duration')}</Text>
                                            <SimpleGrid cols={4} spacing="xs">
                                                {renderDurationCard('30', t('external.durationDays'))}
                                                {renderDurationCard('60', t('external.durationDays'))}
                                                {renderDurationCard('90', t('external.durationDays'))}
                                                {renderDurationCard('other', t('external.durationOther'))}
                                            </SimpleGrid>
                                        </Stack>

                                        {externalDuration === 'other' && (
                                            <Stack align="center">
                                                <Text size="sm" fw={500}>{t('external.durationCustom')}</Text>
                                                <CounterInput
                                                    value={customDurationDays}
                                                    onChange={(val) => setCustomDurationDays(val)}
                                                    min={1}
                                                    max={365}
                                                    step={1}
                                                    suffix={t('external.durationDays')}
                                                />
                                            </Stack>
                                        )}

                                        <Stack gap={4}>
                                            <Text size="xs" fw={500}>{t('external.protection')}</Text>
                                            <SimpleGrid cols={3} spacing="xs">
                                                {renderProtectionCard('fleas', t('external.targetFleas'), 'red')}
                                                {renderProtectionCard('ticks', t('external.targetTicks'), 'orange')}
                                                {renderProtectionCard('mosquitoes', t('external.targetMosquitoes'), 'teal')}
                                            </SimpleGrid>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )}

                            <Autocomplete
                                label={t('form.title')}
                                placeholder={t('form.titlePlaceholder')}
                                required
                                data={
                                    selectedType === 'vaccine' ? [
                                        'Polivalente Canina', 'Sextuple', 'Quíntuple',
                                        'Antirrábica', 'Tos de las Perreras (Bordetella)',
                                        'Giardia', 'Triple Felina', 'Leucemia Felina'
                                    ] :
                                        selectedType === 'deworming' ? [
                                            'Desparasitación Interna (Comprimido)',
                                            'Desparasitación Interna (Jarabe)',
                                            'Antiparasitario General'
                                        ] : []
                                }
                                {...form.getInputProps('title')}
                            />

                            <Group grow>
                                <DateInput
                                    label={t('form.appliedAt')}
                                    placeholder={t('form.appliedAtPlaceholder')}
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
                                        label={t('form.nextDue')}
                                        placeholder={t('form.nextDuePlaceholder')}
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
                                    label={t('form.weightKg')}
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
                                    label={t('form.vetClinic')}
                                    placeholder={t('form.optional')}
                                />
                            )}

                            <Textarea
                                label={t('form.notes')}
                                placeholder={t('form.notesPlaceholder')}
                                rows={3}
                                {...form.getInputProps('description')}
                            />

                            <Group justify="space-between" mt="xl">
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => {
                                        setStep(1);
                                        setSelectedType(null);
                                        form.reset();
                                        setSuggestions([]);
                                    }}
                                    leftSection={<IconChevronRight style={{ transform: 'rotate(180deg)' }} />}
                                >
                                    {t('btn.back')}
                                </Button>
                                <Button type="submit" loading={isCreating}>
                                    {t('btn.save')}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            )}
        </Modal>
    );
}
