export const PET_IDENTITY_COLORS = [
    'teal',
    'yellow',
    'violet',
    'green',
    'orange',
    'cyan',
    'indigo',
    'grape',
    'lime',
];

export function getPetIdentityColor(id: string): string {
    if (!id) return 'teal';

    // Simple hashing consistent across re-renders
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % PET_IDENTITY_COLORS.length;
    return PET_IDENTITY_COLORS[index];
}
