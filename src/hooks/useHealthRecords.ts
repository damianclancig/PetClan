import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IHealthRecord } from '@/models/HealthRecord'

async function fetchHealthRecords(petId: string) {
  if (!petId) return []
  const res = await fetch(`/api/records?petId=${petId}`)
  if (!res.ok) throw new Error('Error fetching records')
  return res.json()
}

async function createHealthRecord(newRecord: any) {
  const res = await fetch('/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error creating record')
  }
  return res.json()
}

async function updateHealthRecord(recordId: string, updatedRecord: any) {
  const res = await fetch(`/api/records/${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedRecord),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error updating record')
  }

  return res.json()
}

async function deleteHealthRecord(recordId: string) {
  const res = await fetch(`/api/records/${recordId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error deleting record')
  }

  return res.json()
}

export function useHealthRecords(petId: string) {
  const queryClient = useQueryClient()

  const recordsQuery = useQuery<IHealthRecord[]>({
    queryKey: ['healthRecords', petId],
    queryFn: () => fetchHealthRecords(petId),
    enabled: !!petId,
    retry: false,
  })

  const createRecordMutation = useMutation({
    mutationFn: createHealthRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', petId] })
    },
  })

  const updateRecordMutation = useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: any }) =>
      updateHealthRecord(recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', petId] })
    },
  })

  const deleteRecordMutation = useMutation({
    mutationFn: (recordId: string) => deleteHealthRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', petId] })
    },
  })

  return {
    records: recordsQuery.data,
    isLoading: recordsQuery.isLoading,
    isError: recordsQuery.isError,
    createRecord: createRecordMutation.mutateAsync,
    isCreating: createRecordMutation.isPending,
    updateRecord: (recordId: string, data: any) =>
      updateRecordMutation.mutateAsync({ recordId, data }),
    isUpdating: updateRecordMutation.isPending,
    deleteRecord: deleteRecordMutation.mutateAsync,
    isDeleting: deleteRecordMutation.isPending,
  }
}
