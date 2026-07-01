/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
    lastWeightDate?: string; // ISO String of last weight record
    status: 'active' | 'lost' | 'deceased' | 'archived';
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
