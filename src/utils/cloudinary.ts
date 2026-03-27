import { compressImage, generateFileHash } from './imageOptimizer'

export async function uploadToCloudinary(
  file: File,
  folder: string = 'petclan/profiles',
): Promise<{ url: string; publicId: string }> {
  // 0. Optimize and Hash
  const compressedFile = await compressImage(file)
  const fileHash = await generateFileHash(compressedFile)

  // 1. Get signature
  const timestamp = Math.round(new Date().getTime() / 1000)
  const paramsToSign = {
    folder,
    timestamp,
    public_id: fileHash,
    overwrite: 'false', // String 'false' for cloudinary API
    transformation: 'q_auto,f_auto', // Apply incoming transformation
  }

  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paramsToSign }),
  })

  if (!signRes.ok) throw new Error('Error firmando la subida')
  const { signature } = await signRes.json()

  // 2. Upload
  const formData = new FormData()
  formData.append('file', compressedFile)
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '')
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('folder', folder)
  formData.append('public_id', fileHash)
  // formData.append('overwrite', 'false'); // Cloudinary might ignore if not signed, but we signed it.
  // formData.append('transformation', 'q_auto,f_auto'); // Signed transformation

  // Note: parameters in formData must match signed parameters exactly
  Object.keys(paramsToSign).forEach((key) => {
    if (key !== 'folder' && key !== 'timestamp' && key !== 'public_id') {
      // folder, timestamp, public_id are already appended or special
      // Actually, checking documentation: all signed params must be present.
      // We manually appended most. Overwrite and transformation need to be there.
    }
  })
  // Simplified: Just append what we signed.
  formData.append('overwrite', 'false')
  formData.append('transformation', 'q_auto,f_auto')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!uploadRes.ok) {
    const responseText = await uploadRes.text()
    let errorData: any = null

    try {
      errorData = JSON.parse(responseText)
    } catch {
      // Keep raw text fallback below.
    }

    if (errorData.error?.message?.includes('already exists')) {
      return {
        url: `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${folder}/${fileHash}`,
        publicId: `${folder}/${fileHash}`,
      }
    }

    const fallbackError = responseText || `Error subiendo imagen a Cloudinary (${uploadRes.status})`
    throw new Error(errorData?.error?.message || fallbackError)
  }

  const data = await uploadRes.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
