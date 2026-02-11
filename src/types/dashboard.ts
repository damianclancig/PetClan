
// DTOs for Dashboard - No server dependencies

export interface DashboardPet {
    _id: string;
    name: string;
    species: 'dog' | 'cat' | 'other';
    photoUrl?: string; // Base64 or URL
    birthDate: string; // ISO String for serialization safety
    weight: number;
    // Computed fields for UI convenience
    ageLabel: string;
    identityColor: string;
}

export interface DashboardAlert {
    id: string;
    type: 'health' | 'system';
    title: string;
    message: string;
    link: string;
    severity: 'critical' | 'warning' | 'success';
    date: string; // ISO String
}

export interface DashboardData {
    pets: DashboardPet[];
    alerts: DashboardAlert[];
    userName: string;
}
