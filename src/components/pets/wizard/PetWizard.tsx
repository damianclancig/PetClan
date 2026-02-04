'use client';

import { useState } from 'react';
import { Stepper, Button, Group, Container, Paper, Transition, Text, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { IconDog, IconCat, IconCheck, IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import IdentityStep from './steps/IdentityStep';
import DetailsStep from './steps/DetailsStep';
import HealthStep from './steps/HealthStep';
import { motion, AnimatePresence } from 'framer-motion';

// Schema Validation (Unified)
const petSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    species: z.enum(['dog', 'cat', 'other']),
    breed: z.string().min(2, 'La raza es obligatoria'),
    birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: 'Fecha inválida',
    }),
    sex: z.enum(['male', 'female']),
    weight: z.number().min(0.1, 'Peso inválido'),
    chipId: z.string().optional(),
    photoUrl: z.string().optional(),
    characteristics: z.string().optional(),
    diseases: z.string().optional(),
    treatments: z.string().optional(),
    notes: z.string().optional(),
});

type PetWizardValues = z.infer<typeof petSchema>;

interface PetWizardProps {
    onSubmit: (values: PetWizardValues) => void;
    isLoading: boolean;
}

export function PetWizard({ onSubmit, isLoading }: PetWizardProps) {
    const t = useTranslations('NewPet');
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

    const methods = useForm<PetWizardValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            species: 'dog',
            sex: 'male',
            weight: 5.0,
            birthDate: new Date().toISOString(), // Initial value needed for date input? Actually DateInput controlled handles it.
            // Better typically to start empty or valid? schema requires string.
            // We'll let DetailStep handle the initial render logic.
        },
        mode: 'onChange' // Validate on change to enable/disable next button dynamically?
    });

    const { trigger, handleSubmit } = methods;

    const nextStep = async () => {
        let valid = false;

        // Validate specific fields per step
        if (active === 0) {
            valid = await trigger(['name', 'species', 'photoUrl']);
        } else if (active === 1) {
            valid = await trigger(['breed', 'sex', 'birthDate']);
        } else if (active === 2) {
            valid = await trigger(['weight']);
        } else {
            valid = true;
        }

        if (valid) {
            setDirection(1);
            setActive((current) => (current < 3 ? current + 1 : current));
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    // Animation Variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <Container size="sm" mt="xl">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Progress Indicator (Circular or Linear?) - Let's use simple Stepper for clarity but hidden/minimal */}
                    <Center mb="xl">
                        <Group>
                            {[0, 1, 2, 3].map((step) => (
                                <ThemeIcon
                                    key={step}
                                    radius="xl"
                                    size="xs"
                                    color={active >= step ? 'cyan' : 'gray.3'}
                                    variant={active === step ? 'filled' : 'light'}
                                >
                                    {active > step ? <IconCheck size={10} /> : <Text size="xs">{step + 1}</Text>}
                                </ThemeIcon>
                            ))}
                        </Group>
                    </Center>

                    <Paper shadow="md" radius="lg" p="xl" withBorder style={{ overflow: 'hidden', minHeight: 450, display: 'flex', flexDirection: 'column' }}>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <AnimatePresence mode='wait' custom={direction}>
                                <motion.div
                                    key={active}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    {active === 0 && <IdentityStep />}
                                    {active === 1 && <DetailsStep />}
                                    {active === 2 && <HealthStep />}
                                    {/* Summary Step if needed, or Health is last? Plan said Step 3/4. Lets do Health + Notes in step 2/3? Plan said 4 steps. Step 3 Medical. Step 4 Review. */}
                                    {/* Let's merge Health and Review/Submit for simplicity if user wants fast flow, or add Review step. Project plan said 4 steps. */}
                                    {active === 3 && (
                                        <Center style={{ height: '100%', flexDirection: 'column', gap: 20 }}>
                                            <RingProgress
                                                sections={[{ value: 100, color: 'teal' }]}
                                                roundCaps
                                                thickness={8}
                                                size={150}
                                                label={
                                                    <Center>
                                                        <ThemeIcon color="teal" variant="light" radius="xl" size="xl">
                                                            <IconCheck size={40} />
                                                        </ThemeIcon>
                                                    </Center>
                                                }
                                            />
                                            <Text size="xl" fw={700}>¡Todo listo!</Text>
                                            <Text c="dimmed" ta="center">Ya tenemos los datos de {methods.getValues().name}.<br />¿Le damos la bienvenida?</Text>
                                        </Center>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <Group justify="space-between" mt="xl">
                            {active > 0 ? (
                                <Button variant="subtle" color="gray" onClick={prevStep} leftSection={<IconChevronLeft size={16} />}>
                                    Atrás
                                </Button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            {active < 3 ? (
                                <Button onClick={nextStep} color="cyan" rightSection={<IconChevronRight size={16} />}>
                                    Siguiente
                                </Button>
                            ) : (
                                <Button type="submit" loading={isLoading} color="teal" size="md" rightSection={<IconCheck size={16} />}>
                                    Crear Mascota
                                </Button>
                            )}
                        </Group>

                    </Paper>
                </form>
            </FormProvider>
        </Container>
    );
}
