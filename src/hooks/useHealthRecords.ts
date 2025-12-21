import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IHealthRecord } from '@/models/HealthRecord';

async function fetchHealthRecords(petId: string) {
    if (!petId) return [];
    const res = await fetch(`/api/records?petId=${petId}`);
    if (!res.ok) throw new Error('Error fetching records');
    return res.json();
}

async function createHealthRecord(newRecord: any) {
    const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error creating record');
    }
    return res.json();
}

export function useHealthRecords(petId: string) {
    const queryClient = useQueryClient();

    const recordsQuery = useQuery<IHealthRecord[]>({
        queryKey: ['healthRecords', petId],
        queryFn: () => fetchHealthRecords(petId),
        enabled: !!petId,
    });

    const createRecordMutation = useMutation({
        mutationFn: createHealthRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['healthRecords', petId] });
        },
    });

    return {
        records: recordsQuery.data,
        isLoading: recordsQuery.isLoading,
        isError: recordsQuery.isError,
        createRecord: createRecordMutation.mutateAsync,
        isCreating: createRecordMutation.isPending,
    };
}
