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

'use client'

import { Timeline, Text, Group, Button, Badge, Menu, ActionIcon, Modal } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import { formatDate } from '@/lib/dateUtils'
import { useTranslations } from 'next-intl'
import { getPetIdentityColor } from '@/utils/pet-identity'
import { sortHealthRecords } from '@/utils/recordUtils'
import { SmartHealthRecordModal } from './SmartHealthRecordModal'
import { IHealthRecord } from '@/models/HealthRecord'
import { HealthTimelineSkeleton } from '@/components/ui/Skeletons'
import { LinkifiedText } from '@/components/ui/LinkifiedText'
import { IconCirclePlus, IconPencil, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

interface HealthTimelineProps {
  petId: string
  petSpecies?: string
  petBirthDate?: Date
  petDeathDate?: Date | string // Enable death date prop
  limit?: number
  onViewAll?: () => void
  onAddRecord?: () => void
  readOnly?: boolean
}

export function HealthTimeline({
  petId,
  petSpecies,
  petBirthDate,
  petDeathDate,
  limit,
  onViewAll,
  onAddRecord,
  readOnly = false,
}: HealthTimelineProps) {
  const {
    records,
    isLoading,
    createRecord,
    isCreating,
    updateRecord,
    isUpdating,
    deleteRecord,
    isDeleting,
  } = useHealthRecords(petId)
  const [opened, { open, close }] = useDisclosure(false)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [editingRecord, setEditingRecord] = useState<IHealthRecord | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<IHealthRecord | null>(null)
  const [hoveredRecordId, setHoveredRecordId] = useState<string | null>(null)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [menuOpenedRecordId, setMenuOpenedRecordId] = useState<string | null>(null)
  const isTouchDevice = useMediaQuery('(hover: none), (pointer: coarse)')
  const t = useTranslations('Health')
  const tCommon = useTranslations('Common')
  const identityColor = getPetIdentityColor(petId)

  // Sort records using centralized logic (DRY)
  const sortedRecords = sortHealthRecords((records as IHealthRecord[]) || [])

  // Inject "Death" event if exists (most recent usually)
  if (petDeathDate) {
    sortedRecords.unshift({
      _id: 'death-event',
      type: 'death_event' as any,
      title: t('Timeline.deathTitle'),
      description: t('Timeline.deathDesc'),
      appliedAt: petDeathDate,
      petId: petId as any,
      createdBy: 'system' as any,
      createdAt: petDeathDate,
      version: 1,
      isSystemEvent: true,
    } as any)

    // Re-sort to ensure correct order if other records happen to be "future" relative to death (unlikely but possible if scheduled)
    // Actually, sortHealthRecords sorts descending by appliedAt.
    // If we just unshift, it might be out of order if there are future scheduled vaccines.
    // It is safer to push and re-sort, OR rely on it being the "final" event effectively.
    // Let's rely on standard sort to be safe:
    sortedRecords.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  }

  // Inject "Birth" event at the end (oldest)
  if (petBirthDate) {
    sortedRecords.push({
      _id: 'birth-event',
      type: 'birth_event' as any, // Cast to avoid TS issues if strict
      title: t('Timeline.birthTitle'),
      description: t('Timeline.birthDesc'),
      appliedAt: petBirthDate,
      petId: petId as any,
      createdBy: 'system' as any,
      createdAt: petBirthDate,
      version: 1,
    })
    // Ensure birth is last
    sortedRecords.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  }

  if (isLoading) return <HealthTimelineSkeleton />

  const handleAdd = () => {
    if (readOnly) return
    if (onAddRecord) {
      onAddRecord()
    } else {
      open()
    }
  }

  const handleStartEdit = (record: IHealthRecord) => {
    setEditingRecord(record)
    openEdit()
  }

  const handleConfirmDelete = async () => {
    if (!recordToDelete?._id) return
    await deleteRecord(recordToDelete._id.toString())
    if (selectedRecordId === recordToDelete._id.toString()) {
      setSelectedRecordId(null)
    }
    setRecordToDelete(null)
  }

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Text size="lg" fw={500}>
          {t('title')}
        </Text>
        {!readOnly && (
          <Button onClick={handleAdd} size="xs" variant="light" color={identityColor}>
            {t('Timeline.update')}
          </Button>
        )}
      </Group>

      {(!sortedRecords || sortedRecords.length === 0) && <Text c="dimmed">{t('noRecords')}</Text>}

      <Timeline active={-1} bulletSize={32} lineWidth={2} color={identityColor}>
        {(limit ? sortedRecords.slice(0, limit) : sortedRecords).map((record: any) => {
          const isFuture = new Date(record.appliedAt) > new Date()
          const typeColor =
            record.type === 'vaccine' ? 'blue' : record.type === 'deworming' ? 'green' : 'gray'
          const recordId = record._id?.toString()
          const isSystemEvent = record.type === 'birth_event' || record.type === 'death_event'
          const canManageRecord = !readOnly && !isSystemEvent && Boolean(recordId)
          const isRecordActive = Boolean(
            canManageRecord &&
            recordId &&
            (menuOpenedRecordId === recordId ||
              (isTouchDevice ? selectedRecordId === recordId : hoveredRecordId === recordId)),
          )
          const isActionVisible =
            canManageRecord &&
            (menuOpenedRecordId === recordId ||
              (isTouchDevice ? selectedRecordId === recordId : hoveredRecordId === recordId))
          const highlightStyle = {
            backgroundColor: isRecordActive
              ? `var(--mantine-color-${identityColor}-light)`
              : 'transparent',
            border: isRecordActive
              ? `1px solid var(--mantine-color-${identityColor}-3)`
              : '1px solid transparent',
            transition: 'background-color 150ms ease, border-color 150ms ease',
          }

          return (
            <Timeline.Item
              key={record._id?.toString()}
              onMouseEnter={() => {
                if (!isTouchDevice && recordId) {
                  setHoveredRecordId(recordId)
                }
              }}
              onMouseLeave={() => {
                if (!isTouchDevice) {
                  setHoveredRecordId(null)
                }
              }}
              onClick={() => {
                if (isTouchDevice && canManageRecord && recordId) {
                  setSelectedRecordId(recordId)
                }
              }}
              bullet={
                record.type === 'birth_event' ? (
                  <div style={{ fontSize: 16 }}>🎂</div>
                ) : record.type === 'death_event' ? (
                  <div style={{ fontSize: 16 }}>🕊️</div>
                ) : (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: isFuture
                        ? 'var(--bg-surface)'
                        : `var(--mantine-color-${identityColor}-6)`,
                      border: `2px solid var(--mantine-color-${identityColor}-6)`,
                    }}
                  />
                )
              }
              lineVariant={isFuture ? 'dashed' : 'solid'}
            >
              <div style={{ borderRadius: 8, padding: '6px 8px', ...highlightStyle }}>
                <Group justify="space-between" gap="xs" wrap="nowrap">
                  <Text size="sm" fw={600} c={isFuture ? 'dimmed' : undefined} style={{ flex: 1 }}>
                    {record.title}
                  </Text>
                  {canManageRecord && recordId && (
                    <Menu
                      withinPortal
                      position="bottom-end"
                      onOpen={() => setMenuOpenedRecordId(recordId)}
                      onClose={() => setMenuOpenedRecordId(null)}
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color={identityColor}
                          radius="xl"
                          size="sm"
                          style={{
                            opacity: isActionVisible ? 1 : 0,
                            transition: 'opacity 150ms ease',
                            pointerEvents: isActionVisible ? 'auto' : 'none',
                          }}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={t('Timeline.actions')}
                        >
                          <IconCirclePlus size={18} stroke={1.8} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconPencil size={14} />}
                          onClick={() => handleStartEdit(record as IHealthRecord)}
                        >
                          {tCommon('edit')}
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => setRecordToDelete(record as IHealthRecord)}
                        >
                          {t('Timeline.delete')}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Group>
                <LinkifiedText text={record.description} c="dimmed" size="xs" mt={4} />
                {(record.vetName || record.clinicName) && (
                  <Text size="xs" mt={2} c="dimmed">
                    {t('Timeline.vetClinic')}: {record.vetName || record.clinicName}
                  </Text>
                )}
                {record.type === 'weight' && record.weightValue && (
                  <Text size="xs" fw={600} c={identityColor}>
                    {record.weightValue} kg
                  </Text>
                )}
                <Group gap="xs" mt={4}>
                  <Badge size="xs" color={typeColor} variant="subtle">
                    {record.type === 'birth_event' || record.type === 'death_event'
                      ? t('Timeline.milestone')
                      : t(`types.${record.type}`)}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {formatDate(record.appliedAt)}
                  </Text>
                </Group>
              </div>
            </Timeline.Item>
          )
        })}
      </Timeline>

      {limit && sortedRecords.length > limit && onViewAll && (
        <Button variant="subtle" size="sm" fullWidth mt="md" onClick={onViewAll}>
          {t('Timeline.viewAll', { count: sortedRecords.length })}
        </Button>
      )}

      <Modal
        opened={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        title={t('Timeline.confirmDeleteTitle')}
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          {t('Timeline.confirmDeleteMessage')}
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setRecordToDelete(null)}>
            {t('Timeline.confirmDeleteNo')}
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={isDeleting}>
            {t('Timeline.confirmDeleteYes')}
          </Button>
        </Group>
      </Modal>

      {/* Only render internal modal if NO external handler provided */}
      {!onAddRecord && (
        <SmartHealthRecordModal
          opened={opened}
          onClose={close}
          petId={petId}
          petSpecies={petSpecies || 'dog'}
          petBirthDate={petBirthDate || new Date()}
          existingRecords={(records as IHealthRecord[]) || []}
          createRecord={createRecord}
          isCreating={isCreating}
        />
      )}

      <SmartHealthRecordModal
        opened={editOpened && Boolean(editingRecord)}
        onClose={() => {
          closeEdit()
          setEditingRecord(null)
        }}
        mode="edit"
        initialRecord={editingRecord}
        onSubmitRecord={async (data) => {
          if (!editingRecord?._id) return
          await updateRecord(editingRecord._id.toString(), data)
        }}
        isSubmitting={isUpdating}
        petId={petId}
        petSpecies={petSpecies || 'dog'}
        petBirthDate={petBirthDate || new Date()}
        existingRecords={(records as IHealthRecord[]) || []}
        createRecord={createRecord}
        isCreating={isCreating}
      />
    </>
  )
}
