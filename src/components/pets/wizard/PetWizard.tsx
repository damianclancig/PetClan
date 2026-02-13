'use client';

import { useState, useEffect } from 'react';
import { Stepper, Button, Group, Container, Paper, Transition, Text, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { IconDog, IconCat, IconCheck, IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { Link, useRouter } from '@/i18n/routing';
import IdentityStep from './steps/IdentityStep';
import DetailsStep from './steps/DetailsStep';
import HealthStep from './steps/HealthStep';
import MedicalStep from './steps/MedicalStep';
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
    const router = useRouter();
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

    const methods = useForm<PetWizardValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: '',
            breed: '',
            birthDate: '', // Start empty
            // species, sex, weight: undefined by default to force selection
        },
        mode: 'onChange'
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
        } else if (active === 3) {
            // Medical step is optional, but good practice to trigger validation if we had rules
            valid = true;
        } else {
            valid = true;
        }

        if (valid) {
            setDirection(1);
            // Steps: 0, 1, 2, 3 (Medical), 4 (Success)
            setActive((current) => (current < 4 ? current + 1 : current));
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    // Effect for Success Step (Step 4)
    useEffect(() => {
        if (active === 4) {
            const timer = setTimeout(() => {
                router.push('/dashboard/pets');
            }, 2000); // 2 second delay
            return () => clearTimeout(timer);
        }
    }, [active, router]);

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
        <Container size="sm" mt="xl" px={{ base: 'xs', sm: 'md' }}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => {
                    onSubmit(data);
                    // On successful submit logic from parent should handle state, 
                    // but here we manually advance to success step if onSubmit returns void/promise
                    // Assuming onSubmitSuccess logic is handled by parent or we step up here.
                    // The parent 'onSubmit' just calls the mutation. 
                    // We need to know when to show success.
                    // Actually, isLoading prop suggests parent handles loading.
                    // Let's assume on success parent DOES NOT redirect, but lets us show success step?
                    // Refactoring: The original code showed success at step 3. 
                    // Now step 4 is success.
                    // We should call onSubmit, wait for it, then setActive(4).
                    // BUT: The original nextStep logic simply incremented active.
                    // Let's change button type="submit" to a normal button that calls onSubmit manually?
                    // Or keep 'submit' and handle `onSubmit` prop to set active(4)?
                    // The props say `onSubmit: (values) => void`. 
                    // Let's assume the parent handles the API call. 
                    // If we want to show success step here, we need to know if it passed.
                    // For now, let's keep the flow: Submit -> Parent handles it -> ?
                    // Wait, if parent redirects, we won't see success step.
                    // User Request: "que en el paso 4 del success, que tenga un retardo".
                    // So we must show step 4.
                })}>
                    {/* Progress Indicator */}
                    <Center mb="xl">
                        <Group>
                            {[0, 1, 2, 3, 4].map((step) => (
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

                    <Paper shadow="md" radius="lg" p={{ base: 'sm', sm: 'xl' }} withBorder style={{ overflow: 'hidden', minHeight: 400, display: 'flex', flexDirection: 'column' }}>

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
                                    {active === 3 && <MedicalStep />}
                                    {active === 4 && (
                                        <Center style={{ height: '100%', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
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
                                            <Text c="dimmed" ta="center">Mascota creada correctamente.<br />Redirigiendo...</Text>
                                        </Center>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {active < 4 && (
                            <Group justify="space-between" mt="xl" wrap="nowrap" gap="xs">
                                {active > 0 ? (
                                    <Button variant="subtle" color="gray" onClick={prevStep} leftSection={<IconChevronLeft size={16} />} size="sm">
                                        Atrás
                                    </Button>
                                ) : (
                                    <Button variant="subtle" color="red" component={Link} href="/dashboard/pets" size="sm">
                                        Cancelar
                                    </Button>
                                )}

                                {active < 3 ? (
                                    <Button onClick={nextStep} color="cyan" rightSection={<IconChevronRight size={16} />} size="sm">
                                        Siguiente
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={async () => {
                                            // Manual submit trigger to allow stepping to Success
                                            await handleSubmit(async (data) => {
                                                await onSubmit(data); // Assume this is async/promise
                                                setActive(4); // Advance to success step
                                            })();
                                        }}
                                        loading={isLoading}
                                        color="teal"
                                        size="sm"
                                        rightSection={<IconCheck size={16} />}
                                    >
                                        Crear Mascota
                                    </Button>
                                )}
                            </Group>
                        )}

                    </Paper>
                </form>
            </FormProvider>
        </Container>
    );
}
