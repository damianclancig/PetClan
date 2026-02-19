import { useState } from 'react';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { usePet } from '@/hooks/usePets';
import { notifications } from '@mantine/notifications';

export function useUpdatePetPhoto(petId: string) {
    const [isUploading, setIsUploading] = useState(false);
    const { updatePet } = usePet(petId);

    const updatePhoto = async (file: File) => {
        setIsUploading(true);
        try {
            // 1. Upload to Cloudinary
            const folder = `petclan/profiles/${petId}`;
            const { url, publicId } = await uploadToCloudinary(file, folder);

            // 2. Update Pet Record (triggers history logic in backend)
            await updatePet({
                id: petId,
                data: { photoUrl: url, publicId } // Send publicId too if backend wants it
            });

            // Backend logic at /api/pets/[id] handles the history push if photoUrl changes

            notifications.show({
                title: 'Foto actualizada',
                message: 'La imagen de perfil se ha guardado correctamente.',
                color: 'green',
            });

            return url;

        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar la foto.',
                color: 'red',
            });
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return { updatePhoto, isUploading };
}
