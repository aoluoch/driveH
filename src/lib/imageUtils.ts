/**
 * Compresses an image File using canvas-based JPEG encoding.
 *
 * Strategy:
 *  1. If the file is already within targetSizeKB, return it unchanged.
 *  2. Downscale extremely large dimensions (>= maxDimension) to reduce pixel count.
 *  3. Encode as JPEG starting at quality 0.85, stepping down by 0.1 until the
 *     output is <= targetSizeKB or quality reaches the floor (0.5).
 *
 * Falls back to the original file if the browser canvas API is unavailable or
 * an unexpected error occurs, so uploads never break silently.
 */
export async function compressImage(
  file: File,
  targetSizeKB = 1024,
  maxDimension = 2400,
): Promise<File> {
  if (file.size <= targetSizeKB * 1024) return file

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      if (width > maxDimension || height > maxDimension) {
        const scale = Math.min(maxDimension / width, maxDimension / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)

      const baseName = file.name.replace(/\.[^.]+$/, '')
      const outputName = `${baseName}.jpg`

      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            const compressed = new File([blob], outputName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            if (blob.size <= targetSizeKB * 1024 || quality <= 0.5) {
              resolve(compressed)
            } else {
              tryCompress(Math.max(quality - 0.1, 0.5))
            }
          },
          'image/jpeg',
          quality,
        )
      }

      tryCompress(0.85)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}
