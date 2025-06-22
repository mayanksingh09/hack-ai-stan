'use client'

import React, { useState, useRef, useCallback } from 'react'
import { FaTimes, FaImage } from 'react-icons/fa'
import Image from 'next/image'

interface ThumbnailUploaderProps {
  onFileSelect?: (file: File | null) => void
  className?: string
  maxSizeInMB?: number
  acceptedTypes?: string[]
}

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const DEFAULT_MAX_SIZE_MB = 5

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  onFileSelect,
  className,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Please select a valid image file (${acceptedTypes.map(type => type.split('/')[1]).join(', ')})`
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`
    }
    
    return null
  }, [acceptedTypes, maxSizeInMB])

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    onFileSelect?.(file)
  }, [validateFile, onFileSelect])

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
    setPreview(null)
    setError(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onFileSelect])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={className}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 block">
        Thumbnail Image
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-destructive bg-destructive/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        aria-label="Upload thumbnail image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
      >
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-32 object-cover rounded"
              width={128}
              height={128}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              aria-label="Remove thumbnail"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <FaImage className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drop an image here or click to select
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
          aria-describedby="thumbnail-description"
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
      
      <p id="thumbnail-description" className="text-xs text-muted-foreground mt-2">
        Upload a thumbnail image for your content
      </p>
    </div>
  )
}

export default ThumbnailUploader 