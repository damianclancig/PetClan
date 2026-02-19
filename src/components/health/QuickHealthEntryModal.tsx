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
