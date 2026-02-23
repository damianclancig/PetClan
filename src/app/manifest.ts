import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'PetClan - Libreta Sanitaria Digital',
        short_name: 'PetClan',
        description: 'Gestiona la salud de tus mascotas de forma fácil y segura.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ca678',
        icons: [
            {
                src: '/assets/logo-icon.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/assets/logo-icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/assets/logo-icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
