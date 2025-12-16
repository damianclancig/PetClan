import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IPet } from '@/models/Pet';

async function fetchPets() {
    const res = await fetch('/api/pets');
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

export function usePets() {
    const queryClient = useQueryClient();

    const petsQuery = useQuery<IPet[]>({
        queryKey: ['pets'],
        queryFn: fetchPets,
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
        createPet: createPetMutation.mutateAsync, // Exponer como async para manejar promesas en UI
        isCreating: createPetMutation.isPending,
    };
}

export function usePet(id: string) {
    const query = useQuery<IPet>({
        queryKey: ['pet', id],
        queryFn: () => fetchPet(id),
        enabled: !!id,
    });

    return {
        pet: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
