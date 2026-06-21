'use client';

import { SimpleGrid, Image, Text, Paper, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

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
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

    const selectedPhoto = selectedIndex !== null ? sortedPhotos[selectedIndex] : null;

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
                            setSelectedIndex(index);
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

            <Modal
                opened={opened}
                onClose={close}
                size="lg"
                centered
                withCloseButton={false}
                padding={0}
                styles={{
                    content: {
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                    },
                    overlay: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    }
                }}
            >
                {selectedPhoto && (
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '70vh',
                        maxHeight: '600px',
                        backgroundColor: '#121212',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
                    }}>
                        {/* Header controls */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '60px',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0 20px',
                            pointerEvents: 'none'
                        }}>
                            {/* Counter */}
                            <Text size="xs" c="white" style={{
                                opacity: 0.8,
                                fontWeight: 500,
                                background: 'rgba(0,0,0,0.4)',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                backdropFilter: 'blur(4px)',
                                pointerEvents: 'auto'
                            }}>
                                {selectedIndex !== null ? sortedPhotos.length - selectedIndex : 0} / {sortedPhotos.length}
                            </Text>

                            {/* Close Button */}
                            <button
                                onClick={close}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    pointerEvents: 'auto',
                                    backdropFilter: 'blur(4px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <IconX size={18} />
                            </button>
                        </div>

                        {/* Image presentation area */}
                        <div style={{
                            flex: 1,
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={selectedPhoto.url}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '40px'
                                    }}
                                >
                                    <img
                                        src={selectedPhoto.url}
                                        alt={t('altFull')}
                                        onClick={() => {
                                            if (selectedIndex !== null && sortedPhotos.length > 0) {
                                                const nextIndex = (selectedIndex - 1 + sortedPhotos.length) % sortedPhotos.length;
                                                setSelectedIndex(nextIndex);
                                            }
                                        }}
                                        draggable={false}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Left/Right Floating Navigation Controls */}
                            {sortedPhotos.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (selectedIndex !== null) {
                                                const prevIndex = (selectedIndex + 1) % sortedPhotos.length;
                                                setSelectedIndex(prevIndex);
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            zIndex: 5,
                                            backdropFilter: 'blur(4px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                            e.currentTarget.style.transform = 'translateX(-2px) scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                                            e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                        }}
                                    >
                                        <IconChevronLeft size={20} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (selectedIndex !== null) {
                                                const nextIndex = (selectedIndex - 1 + sortedPhotos.length) % sortedPhotos.length;
                                                setSelectedIndex(nextIndex);
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            zIndex: 5,
                                            backdropFilter: 'blur(4px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                            e.currentTarget.style.transform = 'translateX(2px) scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                                            e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                        }}
                                    >
                                        <IconChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer Details */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
                            padding: '30px 24px 20px',
                            color: 'white',
                            pointerEvents: 'none',
                            zIndex: 10,
                        }}>
                            <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
                                <Text fw={600} size="sm" style={{ letterSpacing: '0.3px' }}>
                                    {format.dateTime(new Date(selectedPhoto.date), { dateStyle: 'long' })}
                                </Text>
                                {selectedPhoto.description && (
                                    <Text size="xs" c="gray.4" mt={4} style={{ maxWidth: '400px', margin: '4px auto 0', opacity: 0.9 }}>
                                        {selectedPhoto.description}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
