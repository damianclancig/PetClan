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

import { notFound } from 'next/navigation';
import { PublicPetService } from '@/services/PublicPetService';
import PublicPetProfile from '@/components/public-pet/PublicPetProfile';

export const dynamic = 'force-dynamic';

export default async function PublicPetPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const { id } = await params;
    const data = await PublicPetService.getPublicPetProfile(id);

    if (!data) {
        notFound();
    }

    return (
        <PublicPetProfile
            pet={data.pet}
            owners={data.owners}
            vaccineStatus={data.vaccineStatus}
            healthRecords={data.healthRecords}
        />
    );
}
