'use client';

import { SimpleGrid, Image, Text, Paper, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface Photo {
    url: string;
    date: Date;
    description?: string;
}

interface PetPhotoGalleryProps {
    photos: Photo[];
}

export function PetPhotoGallery({ photos }: PetPhotoGalleryProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    if (!photos || photos.length === 0) {
        return (
            <Text c="dimmed" ta="center" py="xl">
                Aún no hay fotos en el historial. ¡Sube algunas para ver su crecimiento! 📸
            </Text>
        );
    }

    // Sort valid photos by date desc
    const sortedPhotos = [...photos]
        .filter(p => p.url)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {sortedPhotos.map((photo, index) => (
                    <Paper
                        key={index}
                        radius="md"
                        withBorder
                        style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                        onClick={() => {
                            setSelectedPhoto(photo);
                            open();
                        }}
                    >
                        <Image
                            src={photo.url}
                            h={160}
                            fit="cover"
                            alt="Foto de mascota"
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.6)',
                            padding: '4px 8px'
                        }}>
                            <Text size="xs" c="white" ta="center">
                                {dayjs(photo.date).format('DD MMM YYYY')}
                            </Text>
                        </div>
                    </Paper>
                ))}
            </SimpleGrid>

            <Modal opened={opened} onClose={close} size="lg" centered withCloseButton={false} padding={0}>
                {selectedPhoto && (
                    <div style={{ position: 'relative' }}>
                        <Image
                            src={selectedPhoto.url}
                            fit="contain"
                            w="100%"
                            alt="Visualización de foto"
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.7)',
                            padding: '12px',
                            color: 'white'
                        }}>
                            <Text ta="center" fw={500}>
                                {dayjs(selectedPhoto.date).format('DD [de] MMMM [de] YYYY')}
                            </Text>
                            {selectedPhoto.description && (
                                <Text size="sm" ta="center" c="dimmed">
                                    {selectedPhoto.description}
                                </Text>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
