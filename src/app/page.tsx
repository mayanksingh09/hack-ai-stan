'use client'

import React, { useState } from 'react'
import PlatformSelector from '@/components/PlatformSelector'
import ScriptEditor from '@/components/ScriptEditor'
import ThumbnailUploader from '@/components/ThumbnailUploader'
import VideoUploader from '@/components/VideoUploader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa'

interface ContentDraft {
  platform: string
  script: string
  thumbnail: File | null
  video: File | null
  videoUrl?: string
}

export default function DashboardPage() {
  const [contentDraft, setContentDraft] = useState<ContentDraft>({
    platform: '',
    script: '',
    thumbnail: null,
    video: null,
    videoUrl: undefined
  })
  
  const [errors, setErrors] = useState<string[]>([])

  const handlePlatformChange = (platform: string) => {
    setContentDraft(prev => ({ ...prev, platform }))
    validateDraft({ ...contentDraft, platform })
  }

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const script = e.target.value
    setContentDraft(prev => ({ ...prev, script }))
    validateDraft({ ...contentDraft, script })
  }

  const handleThumbnailSelect = (file: File | null) => {
    setContentDraft(prev => ({ ...prev, thumbnail: file }))
    validateDraft({ ...contentDraft, thumbnail: file })
  }

  const handleVideoSelect = (file: File | null, publicUrl?: string) => {
    setContentDraft(prev => ({ ...prev, video: file, videoUrl: publicUrl }))
    validateDraft({ ...contentDraft, video: file, videoUrl: publicUrl })
  }



  const validateDraft = (draft: ContentDraft) => {
    const newErrors: string[] = []
    
    if (!draft.platform) {
      newErrors.push('Please select a platform')
    }
    
    if (!draft.script.trim()) {
      newErrors.push('Please write your content script')
    }
    
    if (!draft.thumbnail && !draft.video) {
      newErrors.push('Please upload either a thumbnail image or a video')
    }
    
    // Platform-specific validations
    if (draft.platform === 'youtube' && !draft.video) {
      newErrors.push('YouTube content requires a video upload')
    }
    
    if (draft.platform === 'instagram' && !draft.thumbnail) {
      newErrors.push('Instagram content requires a thumbnail image')
    }
    
    setErrors(newErrors)
  }

  const isComplete = errors.length === 0 && 
    contentDraft.platform && 
    contentDraft.script.trim() && 
    (contentDraft.thumbnail || contentDraft.video)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Social Content Dashboard
          </h1>
          <p className="text-muted-foreground">
            Create and manage your social media content across platforms
          </p>
        </div>

        {/* Status Alert */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <FaExclamationTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Please complete the following:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isComplete && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <FaCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-200">
                Content draft is ready for publishing!
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Platform & Script */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selection */}
            <div className="bg-card border border-border rounded-lg p-6">
              <PlatformSelector
                value={contentDraft.platform}
                onValueChange={handlePlatformChange}
              />
            </div>

            {/* Script Editor */}
            <div className="bg-card border border-border rounded-lg p-6">
              <ScriptEditor
                value={contentDraft.script}
                onChange={handleScriptChange}
                placeholder="Write your engaging content here..."
                required
              />
            </div>
          </div>

          {/* Right Column - Media Uploads */}
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-card border border-border rounded-lg p-6">
              <ThumbnailUploader
                onFileSelect={handleThumbnailSelect}
                maxSizeInMB={5}
              />
            </div>

            {/* Video Upload */}
            <div className="bg-card border border-border rounded-lg p-6">
              <VideoUploader
                onFileSelect={handleVideoSelect}
                maxSizeInMB={100}
              />
            </div>
          </div>
        </div>

        {/* Content Summary */}
        {isComplete && (
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Content Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Platform:</span>
                <p className="capitalize">{contentDraft.platform}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Script Length:</span>
                <p>{contentDraft.script.length} characters</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Thumbnail:</span>
                <p>{contentDraft.thumbnail ? '✓ Uploaded' : '✗ Not uploaded'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Video:</span>
                <p>{contentDraft.video ? '✓ Uploaded' : '✗ Not uploaded'}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
} 