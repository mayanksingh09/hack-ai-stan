'use client'

import React, { useState } from 'react'
import PlatformSelector from '@/components/PlatformSelector'
import ScriptEditor from '@/components/ScriptEditor'
import ThumbnailUploader from '@/components/ThumbnailUploader'
import VideoUploader from '@/components/VideoUploader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FaCheck, FaExclamationTriangle, FaSpinner, FaPlay } from 'react-icons/fa'
import { BiDish } from 'react-icons/bi'
import { useTranscription } from '@/hooks/useTranscription'
import { useContentGeneration } from '@/hooks/useContentGeneration'
import GenerateContentButton from '@/components/GenerateContentButton'
import GeneratedContentCard from '@/components/GeneratedContentCard'

interface ContentDraft {
  platform: string
  platforms: string[]  // For future multi-platform support
  script: string
  thumbnail: File | null
  video: File | null
  videoUrl?: string
}

export default function DashboardPage() {
  const [contentDraft, setContentDraft] = useState<ContentDraft>({
    platform: '',
    platforms: [],
    script: '',
    thumbnail: null,
    video: null,
    videoUrl: undefined
  })
  
  const [errors, setErrors] = useState<string[]>([])

  // Use transcription hook
  const { transcript, loading: transcriptLoading, error: transcriptError } = useTranscription(contentDraft.videoUrl)
  
  // Use content generation hook
  const { generatedContent, generateContent, isGenerating, clearContent } = useContentGeneration()

  // Update script when transcript is received
  React.useEffect(() => {
    if (transcript) {
      // Always update the script with the transcript when it's received
      // This ensures the transcript is always shown to the user
      setContentDraft(prev => ({ ...prev, script: transcript }))
    }
  }, [transcript])

  const handlePlatformChange = (value: string | string[]) => {
    // Handle both single and multiple platform selection
    const platform = Array.isArray(value) ? value[0] || '' : value
    const platforms = Array.isArray(value) ? value : value ? [value] : []
    
    setContentDraft(prev => ({ ...prev, platform, platforms }))
    validateDraft({ ...contentDraft, platform, platforms })
    
    // Clear generated content when platforms change
    clearContent()
  }

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const script = e.target.value
    setContentDraft(prev => ({ ...prev, script }))
    validateDraft({ ...contentDraft, script })
    
    // Clear generated content when script changes significantly
    clearContent()
  }

  const handleThumbnailSelect = (file: File | null) => {
    setContentDraft(prev => ({ ...prev, thumbnail: file }))
    validateDraft({ ...contentDraft, thumbnail: file })
  }

  const handleVideoSelect = (file: File | null, publicUrl?: string) => {
    setContentDraft(prev => ({ ...prev, video: file, videoUrl: publicUrl }))
    validateDraft({ ...contentDraft, video: file, videoUrl: publicUrl })
    
    // Clear generated content when video changes
    clearContent()
  }

  const validateDraft = (draft: ContentDraft) => {
    const newErrors: string[] = []
    
    if (draft.platforms.length === 0) {
      newErrors.push('Please select at least one platform')
    }
    
    if (!draft.script.trim()) {
      newErrors.push('Please write your content script')
    }
    
    if (!draft.thumbnail && !draft.video) {
      newErrors.push('Please upload either a thumbnail image or a video')
    }
    
    // Platform-specific validations
    if (draft.platforms.includes('youtube') && !draft.video) {
      newErrors.push('YouTube content requires a video upload')
    }
    
    if (draft.platforms.includes('instagram') && !draft.thumbnail) {
      newErrors.push('Instagram content requires a thumbnail image')
    }
    
    setErrors(newErrors)
  }

  const isComplete = errors.length === 0 && 
    contentDraft.platforms.length > 0 && 
    contentDraft.script.trim() && 
    (contentDraft.thumbnail || contentDraft.video)

  const handleGenerateContent = () => {
    if (contentDraft.script.trim() && contentDraft.platforms.length > 0) {
      generateContent(contentDraft.platforms, contentDraft.script)
    }
  }

  const hasGeneratedContent = Object.keys(generatedContent).length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <BiDish className="text-white text-4xl" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Social Buddy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your AI-powered content creation assistant. Create engaging social media content across all platforms with intelligent transcription and optimization.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <FaPlay size={12} />
            <span>Upload • Transcribe • Optimize • Publish</span>
          </div>
        </div>

        {/* Primary Status Alert - Show transcription status first, then content status */}
        {transcriptLoading && (
          <Alert className="mb-6 border-blue-200 bg-blue-50/80 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-950/80 shadow-lg">
            <FaSpinner className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Transcribing video... Please wait.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {transcriptError && !transcriptLoading && (
          <Alert className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm dark:border-red-800 dark:bg-red-950/80 shadow-lg">
            <FaExclamationTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <p className="font-medium text-red-800 dark:text-red-200">
                Transcription failed: {transcriptError}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {transcript && !transcriptLoading && !transcriptError && isComplete && (
          <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm dark:border-green-800 dark:bg-green-950/80 shadow-lg">
            <FaCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-200">
                Video transcribed successfully! Content draft is ready for publishing.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {transcript && !transcriptLoading && !transcriptError && !isComplete && (
          <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm dark:border-green-800 dark:bg-green-950/80 shadow-lg">
            <FaCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-200">
                Video transcription completed successfully!
              </p>
            </AlertDescription>
          </Alert>
        )}

        {!transcript && !transcriptLoading && !transcriptError && isComplete && (
          <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm dark:border-green-800 dark:bg-green-950/80 shadow-lg">
            <FaCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-200">
                Content draft is ready for publishing!
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Top Left - Platform Selection */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Choose Your Platform</h2>
            </div>
            <PlatformSelector
              value={contentDraft.platforms}
              onValueChange={handlePlatformChange}
              multiple={true}
            />
          </div>

          {/* Top Right - Video Upload */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Upload Video</h2>
            </div>
            <VideoUploader
              onFileSelect={handleVideoSelect}
              maxSizeInMB={100}
            />
          </div>

          {/* Bottom Left - Script Editor */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Script</h2>
            </div>
            <ScriptEditor
              value={contentDraft.script}
              onChange={handleScriptChange}
              placeholder={transcript ? "Generated transcript (you can edit this)" : "Write your engaging content here..."}
              required
              readOnly={transcriptLoading}
              showEditToggle={!!transcript}
            />
          </div>

          {/* Bottom Right - Thumbnail Upload */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Thumbnail</h2>
            </div>
            <ThumbnailUploader
              onFileSelect={handleThumbnailSelect}
              maxSizeInMB={5}
              videoFile={contentDraft.video}
            />
          </div>
        </div>

        {/* Content Summary */}
        {isComplete && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FaCheck className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Content Ready!</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-white/40 dark:border-slate-700/40">
                <span className="block font-medium text-muted-foreground text-sm mb-1">
                  Platform{contentDraft.platforms.length > 1 ? 's' : ''}
                </span>
                <p className="font-semibold capitalize text-lg">
                  {contentDraft.platforms.length > 0 ? contentDraft.platforms.join(', ') : 'None'}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-white/40 dark:border-slate-700/40">
                <span className="block font-medium text-muted-foreground text-sm mb-1">Script Length</span>
                <p className="font-semibold text-lg">{contentDraft.script.length} chars</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-white/40 dark:border-slate-700/40">
                <span className="block font-medium text-muted-foreground text-sm mb-1">Thumbnail</span>
                <p className="font-semibold text-lg">{contentDraft.thumbnail ? '✓ Ready' : '✗ Missing'}</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-white/40 dark:border-slate-700/40">
                <span className="block font-medium text-muted-foreground text-sm mb-1">Video</span>
                <p className="font-semibold text-lg">{contentDraft.video ? '✓ Ready' : '✗ Missing'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Generate Content Section */}
        {isComplete && (
          <div className="mt-8 max-w-2xl mx-auto">
            <GenerateContentButton
              onGenerate={handleGenerateContent}
              loading={isGenerating}
              disabled={!contentDraft.script.trim() || contentDraft.platforms.length === 0}
              platforms={contentDraft.platforms}
            />
          </div>
        )}

        {/* Generated Content Cards */}
        {hasGeneratedContent && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Generated Content</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contentDraft.platforms.map((platform) => {
                const state = generatedContent[platform]
                if (!state) return null
                
                return (
                  <GeneratedContentCard
                    key={platform}
                    content={state.content || { platform, title: '', tags: [] }}
                    loading={state.loading}
                    error={state.error}
                  />
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
} 