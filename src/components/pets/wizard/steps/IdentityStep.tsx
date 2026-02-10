'use client';

import { TextInput, Group, Stack, Text, SimpleGrid, Paper, ThemeIcon, Avatar, FileButton, ActionIcon, Center } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconDog, IconCat, IconPaw, IconCamera, IconTrash } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';

export default function IdentityStep() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    const species = watch('species');
    const photoUrl = watch('photoUrl');
    const name = watch('name');

    // Local preview state for smoother UX, synced with form
    const [preview, setPreview] = useState<string | null>(photoUrl || null);

    // Sync external changes (if any) back to preview
    useEffect(() => {
        if (photoUrl) setPreview(photoUrl);
    }, [photoUrl]);

    const processImage = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const size = 300; // Higher res for wizard

                canvas.width = size;
                canvas.height = size;

                if (ctx) {
                    const minDim = Math.min(img.width, img.height);
                    const sx = (img.width - minDim) / 2;
                    const sy = (img.height - minDim) / 2;

                    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    setPreview(dataUrl);
                    setValue('photoUrl', dataUrl);
                }
            };
        };
    };

    const handleFileChange = (payload: File | null) => {
        if (payload) processImage(payload);
    };

    return (
        <Stack gap="xl" align="center">
            <Text size="xl" fw={800} ta="center">¿Quién se une a la familia?</Text>

            {/* Photo Avatar */}
            <div style={{ position: 'relative' }}>
                <Avatar
                    src={preview}
                    size={160}
                    radius={160}
                    color="cyan"
                    styles={{
                        root: { border: '4px solid var(--mantine-color-cyan-1)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}
                >
                    {!preview && (name?.charAt(0)?.toUpperCase() || <IconPaw size={60} />)}
                </Avatar>

                <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
                    {(props) => (
                        <ActionIcon
                            {...props}
                            radius="xl"
                            size="lg"
                            variant="filled"
                            color="cyan"
                            style={{ position: 'absolute', bottom: 10, right: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                        >
                            <IconCamera size={20} />
                        </ActionIcon>
                    )}
                </FileButton>

                {preview && (
                    <ActionIcon
                        radius="xl"
                        size="lg"
                        variant="filled"
                        color="red"
                        onClick={() => {
                            setPreview(null);
                            setValue('photoUrl', '');
                        }}
                        style={{ position: 'absolute', bottom: 10, left: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                )}
            </div>

            {/* Name Input - Large */}
            <TextInput
                disabled={false} // Mantine bug check
                placeholder="Nombre de la mascota"
                size="lg"
                variant="filled"
                radius="md"
                withAsterisk
                {...register('name')}
                error={errors.name?.message as string}
                style={{ width: '100%', maxWidth: 400 }}
                styles={{ input: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 } }}
            />

            {/* Species Selector - Visual Cards */}
            <Stack gap="xs" align="center">
                <Text size="sm" c="dimmed" fw={600}>ESPECIE</Text>
                <Controller
                    name="species"
                    control={control}
                    render={({ field }) => (
                        <Group gap="md">
                            {[
                                { value: 'dog', label: 'Perro', icon: <IconDog size={32} /> },
                                { value: 'cat', label: 'Gato', icon: <IconCat size={32} /> },
                                { value: 'other', label: 'Otro', icon: <IconPaw size={32} /> },
                            ].map((item) => {
                                const isSelected = field.value === item.value;
                                return (
                                    <Paper
                                        key={item.value}
                                        component="button"
                                        type="button"
                                        onClick={() => field.onChange(item.value)}
                                        p="md"
                                        radius="lg"
                                        withBorder
                                        style={{
                                            width: 100,
                                            height: 100,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? 'var(--mantine-color-cyan-0)' : 'transparent',
                                            borderColor: isSelected ? 'var(--mantine-color-cyan-5)' : 'var(--mantine-color-gray-3)',
                                            transition: 'all 0.2s',
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <ThemeIcon
                                            size={48}
                                            radius="xl"
                                            variant={isSelected ? 'filled' : 'light'}
                                            color={isSelected ? 'cyan' : 'gray'}
                                        >
                                            {item.icon}
                                        </ThemeIcon>
                                        <Text size="xs" mt="xs" fw={700} c={isSelected ? 'cyan.8' : 'dimmed'}>
                                            {item.label}
                                        </Text>
                                    </Paper>
                                );
                            })}
                        </Group>
                    )}
                />
            </Stack>
        </Stack>
    );
}
