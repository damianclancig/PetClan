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

'use client';

import { useHealthRecords } from '@/hooks/useHealthRecords';
import { SmartHealthRecordModal } from '@/components/health/SmartHealthRecordModal';
import { LoadingOverlay } from '@mantine/core';

interface QuickHealthEntryModalProps {
    opened: boolean;
    onClose: () => void;
    petId: string;
    petSpecies: string;
    petBirthDate: Date;
    refreshDashboard?: () => void;
}

export function QuickHealthEntryModal({
    opened,
    onClose,
    petId,
    petSpecies,
    petBirthDate,
    refreshDashboard
}: QuickHealthEntryModalProps) {
    const { records, createRecord, isCreating, isLoading } = useHealthRecords(petId);

    const handleCreate = async (data: any) => {
        await createRecord({ ...data, petId }); // Ensure petId is passed
        if (refreshDashboard) {
            refreshDashboard();
        }
    };

    return (
        <>
            {isLoading && !records && (
                <LoadingOverlay
                    visible={true}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2, fixed: true }}
                />
            )}
            <SmartHealthRecordModal
                opened={opened}
                onClose={onClose}
                petId={petId}
                petSpecies={petSpecies}
                petBirthDate={petBirthDate}
                existingRecords={records || []}
                createRecord={handleCreate}
                isCreating={isCreating}
            // initialConfig={{ type: 'vaccine' }} // Removed to force type selection
            />
        </>
    );
}
