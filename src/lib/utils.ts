import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract the first frame from a video file as an image blob
 * @param videoFile - The video file to extract frame from
 * @param quality - JPEG quality (0-1), default 0.9
 * @returns Promise<Blob> - The extracted frame as an image blob
 */
export const extractVideoFirstFrame = async (
  videoFile: File,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    })

    video.addEventListener('loadeddata', () => {
      // Seek to the first frame (time = 0)
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      try {
        // Draw the current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create image blob from video frame'))
            }
            
            // Cleanup
            video.src = ''
            video.load()
          },
          'image/jpeg',
          quality
        )
      } catch (error) {
        reject(new Error(`Failed to extract frame: ${error}`))
      }
    })

    video.addEventListener('error', (e) => {
      reject(new Error(`Video loading error: ${e}`))
    })

    // Set video source and load
    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}

/**
 * Convert a blob to a File object
 * @param blob - The blob to convert
 * @param filename - The desired filename
 * @param mimeType - The MIME type
 * @returns File object
 */
export const blobToFile = (blob: Blob, filename: string, mimeType: string = 'image/jpeg'): File => {
  return new File([blob], filename, { type: mimeType })
}
