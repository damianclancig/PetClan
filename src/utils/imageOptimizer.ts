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
