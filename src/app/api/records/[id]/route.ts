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

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import HealthRecord from '@/models/HealthRecord'
import Pet from '@/models/Pet'
import User from '@/models/User'

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) return null

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  return user
}

async function canManageRecord(recordId: string, userId: string) {
  const record = await HealthRecord.findById(recordId)

  if (!record) {
    return { error: NextResponse.json({ error: 'Record not found' }, { status: 404 }) }
  }

  const pet = await Pet.findById(record.petId)
  if (!pet) {
    return { error: NextResponse.json({ error: 'Pet not found' }, { status: 404 }) }
  }

  const isOwner = pet.owners.some((ownerId: any) => ownerId.toString() === userId.toString())
  if (!isOwner) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { record }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const access = await canManageRecord(id, user._id.toString())
    if (access.error) return access.error

    const { record } = access

    const updateData = {
      ...body,
      petId: record.petId,
      createdBy: record.createdBy,
      version: (record.version || 1) + 1,
      updatedAt: new Date(),
    }

    const updatedRecord = await HealthRecord.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedRecord) {
      return NextResponse.json({ error: 'Error updating record' }, { status: 500 })
    }

    if (updatedRecord.type === 'weight' && typeof updatedRecord.weightValue === 'number') {
      await Pet.findByIdAndUpdate(updatedRecord.petId, {
        weight: updatedRecord.weightValue,
        lastWeightUpdate: new Date(),
      })
    }

    return NextResponse.json(updatedRecord)
  } catch (error: any) {
    console.error('Error updating health record:', error)
    return NextResponse.json({ error: error.message || 'Error updating record' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const access = await canManageRecord(id, user._id.toString())
    if (access.error) return access.error

    const deletedRecord = await HealthRecord.findByIdAndDelete(id)

    if (!deletedRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error deleting health record:', error)
    return NextResponse.json({ error: error.message || 'Error deleting record' }, { status: 500 })
  }
}
