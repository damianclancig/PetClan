'use client';

import { SimpleGrid, Image, Text, Paper, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';

interface Photo {
    url: string;
    date: Date;
    description?: string;
}

interface PetPhotoGalleryProps {
    photos: Photo[];
}

export function PetPhotoGallery({ photos }: PetPhotoGalleryProps) {
    const t = useTranslations('PetDetail.Gallery');
    const format = useFormatter();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    if (!photos || photos.length === 0) {
        return (
            <Text c="dimmed" ta="center" py="xl">
                {t('empty')}
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
                            alt={t('altThumb')}
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
                                {format.dateTime(new Date(photo.date), { year: 'numeric', month: 'short', day: '2-digit' })}
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
                            alt={t('altFull')}
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
                                {format.dateTime(new Date(selectedPhoto.date), { dateStyle: 'long' })}
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
