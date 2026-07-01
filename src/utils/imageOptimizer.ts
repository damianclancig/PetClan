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

import imageCompression from 'browser-image-compression'

interface CompressOptions {
  maxWidth?: number
  quality?: number
  maxSizeMB?: number
}

export async function compressImage(
  file: File,
  options: CompressOptions = { maxWidth: 1920, quality: 0.8, maxSizeMB: 2 },
): Promise<File> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: options.maxWidth ?? 1920,
    initialQuality: options.quality ?? 0.8,
    maxSizeMB: options.maxSizeMB ?? 2,
    fileType: 'image/webp',
    useWebWorker: true,
  })

  const webpName = file.name.replace(/\.(png|jpe?g|webp)$/i, '.webp')
  return new File([compressed], webpName, {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}

export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
