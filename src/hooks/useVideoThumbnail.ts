'use client'

import { useState, useCallback } from 'react'
import { extractVideoFirstFrame, blobToFile } from '@/lib/utils'

interface UseVideoThumbnailReturn {
  generateThumbnail: (videoFile: File, quality?: number) => Promise<File | null>
  isGenerating: boolean
  error: string | null
  clearError: () => void
}

export const useVideoThumbnail = (): UseVideoThumbnailReturn => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateThumbnail = useCallback(async (
    videoFile: File, 
    quality: number = 0.9
  ): Promise<File | null> => {
    if (!videoFile) {
      setError('No video file provided')
      return null
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Extract first frame from video
      const frameBlob = await extractVideoFirstFrame(videoFile, quality)
      
      // Convert blob to file
      const filename = videoFile.name.replace(/\.[^/.]+$/, '') + '_thumbnail.jpg'
      const thumbnailFile = blobToFile(frameBlob, filename, 'image/jpeg')
      
      return thumbnailFile
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail from video'
      setError(errorMessage)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    generateThumbnail,
    isGenerating,
    error,
    clearError
  }
} 