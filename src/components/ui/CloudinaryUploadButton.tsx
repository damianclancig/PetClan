'use client';

import { useState } from 'react';
import { Button, FileButton, Group, Text, Loader, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { IconUpload, IconCheck, IconX, IconPhoto } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { uploadToCloudinary } from '@/utils/cloudinary';

interface CloudinaryUploadButtonProps {
    onUploadComplete: (result: { url: string; publicId: string }) => void;
    folder?: string;
    label?: string;
    compact?: boolean;
    renderTrigger?: (props: { onClick: () => void; loading: boolean }) => React.ReactNode;
}

export function CloudinaryUploadButton({
    onUploadComplete,
    folder = 'petclan/profiles',
    label = 'Subir Foto',
    compact = false,
    renderTrigger
}: CloudinaryUploadButtonProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (file: File | null) => {
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            const { url, publicId } = await uploadToCloudinary(file, folder);

            notifications.show({
                title: 'Foto subida',
                message: 'La imagen se ha guardado correctamente.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            onUploadComplete({ url, publicId });

        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo subir la imagen. Verifica tu conexión.',
                color: 'red',
                icon: <IconX size={16} />,
            });
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    if (renderTrigger) {
        return (
            <FileButton onChange={handleFileChange} accept="image/png,image/jpeg,image/webp">
                {(props) => renderTrigger({ onClick: props.onClick, loading: uploading })}
            </FileButton>
        );
    }

    if (uploading) {
        return compact ? (
            <Loader size="xs" />
        ) : (
            <Button disabled loading leftSection={<IconUpload size={18} />}>
                Subiendo...
            </Button>
        );
    }

    return (
        <FileButton onChange={handleFileChange} accept="image/png,image/jpeg,image/webp">
            {(props) => (
                <Button
                    {...props}
                    variant={compact ? "light" : "filled"}
                    size={compact ? "xs" : "sm"}
                    leftSection={!compact && <IconPhoto size={18} />}
                >
                    {label}
                </Button>
            )}
        </FileButton>
    );
}
