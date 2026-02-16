'use client';

import { TextInput, Stack, Text, Avatar, FileButton, ActionIcon } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import { IconPaw, IconCamera, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { SpeciesSelector } from '../../form/SpeciesSelector';

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
        <Stack gap="sm" align="center">
            <Text size="md" fw={700} ta="center" lh={1.1}>
                ¿Quién se une a la familia?
            </Text>

            {/* Photo Avatar */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Avatar
                        src={preview}
                        size={120}
                        radius={120}
                        color="cyan"
                        styles={{
                            root: { border: '3px solid var(--mantine-color-cyan-1)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                        }}
                    >
                        {!preview && (name?.charAt(0)?.toUpperCase() || <IconPaw size={40} />)}
                    </Avatar>

                    <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
                        {(props) => (
                            <ActionIcon
                                {...props}
                                radius="xl"
                                size="md"
                                variant="filled"
                                color="cyan"
                                style={{ position: 'absolute', bottom: 0, right: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                            >
                                <IconCamera size={16} />
                            </ActionIcon>
                        )}
                    </FileButton>

                    {preview && (
                        <ActionIcon
                            radius="xl"
                            size="md"
                            variant="filled"
                            color="red"
                            onClick={() => {
                                setPreview(null);
                                setValue('photoUrl', '');
                            }}
                            style={{ position: 'absolute', bottom: 0, left: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    )}
                </div>
                {!preview && (
                    <Text size="xs" c="dimmed" mt={4}>Toca para agregar foto</Text>
                )}
            </div>

            {/* Name Input - Compacted */}
            <TextInput
                disabled={false} // Mantine bug check
                placeholder="Nombre"
                size="md"
                variant="filled"
                radius="md"
                withAsterisk
                {...register('name')}
                error={errors.name?.message as string}
                style={{ width: '100%', maxWidth: 280 }}
                styles={{ input: { textAlign: 'center', fontWeight: 'bold', fontSize: 18, height: 42, minHeight: 42 } }}
            />

            {/* Species Selector - Visual Cards */}
            <Stack gap="xs" align="center" w="100%">
                <Text size="sm" c="dimmed" fw={600}>ESPECIE</Text>
                <Controller
                    name="species"
                    control={control}
                    render={({ field }) => (
                        <SpeciesSelector
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
}
