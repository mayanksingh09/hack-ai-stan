'use client'

import React, { useState, useRef, useCallback } from 'react'
import { FaVideo, FaTimes, FaPlay } from 'react-icons/fa'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

interface VideoUploaderProps {
  onFileSelect?: (file: File | null, publicUrl?: string) => void
  onUploadProgress?: (progress: number) => void
  className?: string
  maxSizeInMB?: number
  acceptedTypes?: string[]
}

const DEFAULT_ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
const DEFAULT_MAX_SIZE_MB = 100

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onFileSelect,
  onUploadProgress,
  className,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadControllerRef = useRef<AbortController | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Please select a valid video file (${acceptedTypes.map(type => type.split('/')[1]).join(', ')})`
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`
    }
    
    return null
  }, [acceptedTypes, maxSizeInMB])

  const uploadToSupabase = useCallback(async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    uploadControllerRef.current = new AbortController()
    
    try {
      // Get environment variables
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'hack-ai-public-storage-bucket'
      const s3Endpoint = process.env.NEXT_PUBLIC_SUPABASE_S3_ENDPOINT
      
      console.log('Upload config:', { bucketName, s3Endpoint })
      
      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const uniqueFilename = `${uuidv4()}.${fileExtension}`
      const filePath = `videos/${uniqueFilename}`
      
      console.log('File path:', filePath)
      
      // Upload to Supabase storage with progress tracking
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        throw error
      }
      
      // Construct public URL using the specified format: SUPABASE_S3_ENDPOINT/SUPABASE_STORAGE_BUCKET/videos
      const publicUrl = s3Endpoint 
        ? `${s3Endpoint}/${bucketName}/${filePath}`
        : supabase.storage.from(bucketName).getPublicUrl(filePath).data.publicUrl

      console.log('publicUrl', publicUrl)
      
      setUploadProgress(100)
      setIsUploading(false)
      onUploadProgress?.(100)
      
      // Call onFileSelect with both file and public URL
      onFileSelect?.(file, publicUrl)
      
    } catch (error: unknown) {
      if (uploadControllerRef.current?.signal.aborted) {
        // Upload was cancelled
        return
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.'
      console.error('Upload failed:', error)
      setError(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onFileSelect, onUploadProgress])

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)
    uploadToSupabase(file)
  }, [validateFile, uploadToSupabase])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleRemove = useCallback(() => {
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort()
    }
    setSelectedFile(null)
    setError(null)
    setUploadProgress(0)
    setIsUploading(false)
    onFileSelect?.(null, undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onFileSelect])

  const handleCancel = useCallback(async () => {
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort()
      setIsUploading(false)
      setUploadProgress(0)
      setError(null)
      
      // Note: Supabase doesn't provide a direct way to cancel in-progress uploads
      // The upload will continue but we ignore the result
    }
  }, [])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 block">
        Video Upload
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          !selectedFile ? 'cursor-pointer' : ''
        } ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-destructive bg-destructive/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!selectedFile ? openFileDialog : undefined}
        role={!selectedFile ? "button" : undefined}
        tabIndex={!selectedFile ? 0 : undefined}
        aria-label={!selectedFile ? "Upload video file" : undefined}
        onKeyDown={!selectedFile ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        } : undefined}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaPlay className="w-6 h-6 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove video"
              >
                <FaTimes size={16} />
              </button>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Cancel Upload
                </button>
              </div>
            )}
            
            {!isUploading && uploadProgress === 100 && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Upload completed successfully
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <FaVideo className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drop a video here or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')} (max {maxSizeInMB}MB)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-describedby="video-description"
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
      
      <p id="video-description" className="text-xs text-muted-foreground mt-2">
        Upload a video file for your content
      </p>
    </div>
  )
}

export default VideoUploader 