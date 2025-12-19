import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IPet } from '@/models/Pet';

async function fetchPets(status?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const res = await fetch(`/api/pets?${params.toString()}`);
    if (!res.ok) throw new Error('Error fetching pets');
    return res.json();
}

async function createPet(newPet: any) {
    const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
    });
    if (!res.ok) throw new Error('Error creating pet');
    return res.json();
}

async function fetchPet(id: string) {
    const res = await fetch(`/api/pets/${id}`);
    if (!res.ok) throw new Error('Error fetching pet');
    return res.json();
}

async function updatePet({ id, data }: { id: string; data: any }) {
    const res = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating pet');
    return res.json();
}
async function deletePet(id: string) {
    const res = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error deleting pet');
    return res.json();
}

export function usePets(status?: string) {
    // ... (unchanged)
    const queryClient = useQueryClient();

    const petsQuery = useQuery<IPet[]>({
        queryKey: ['pets', status],
        queryFn: () => fetchPets(status),
    });

    const createPetMutation = useMutation({
        mutationFn: createPet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    return {
        pets: petsQuery.data,
        isLoading: petsQuery.isLoading,
        isError: petsQuery.isError,
        createPet: createPetMutation.mutateAsync,
        isCreating: createPetMutation.isPending,
    };
}

export function usePet(id: string) {
    const queryClient = useQueryClient();

    const query = useQuery<IPet>({
        queryKey: ['pet', id],
        queryFn: () => fetchPet(id),
        enabled: !!id,
    });

    const updatePetMutation = useMutation({
        mutationFn: updatePet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pet', id] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const deletePetMutation = useMutation({
        mutationFn: () => deletePet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            // Cannot invalidate 'pet' because it's gone or archived, but 'pets' list needs refresh
        },
    });

    return {
        pet: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        updatePet: updatePetMutation.mutateAsync,
        isUpdating: updatePetMutation.isPending,
        deletePet: deletePetMutation.mutateAsync,
        isDeleting: deletePetMutation.isPending,
    };
}
