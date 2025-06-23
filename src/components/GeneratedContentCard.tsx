'use client'

import React, { useState } from 'react'
import { FaCopy, FaCheck, FaExclamationTriangle, FaTimes, FaSpinner, FaEye, FaList } from 'react-icons/fa'
import { PLATFORMS } from '@/lib/constants/platforms'
import { PlatformPreview } from '@/components/previews'

export interface GeneratedContent {
  platform: string
  title: string
  tags: string[]
  // Platform-specific content fields
  description?: string // YouTube
  caption?: string // Instagram, TikTok
  post_body?: string // Facebook, LinkedIn, X/Twitter
  headline?: string // LinkedIn, Facebook
  bio?: string // all platforms
  username?: string // all platforms
  profile_name?: string // all platforms
  about_section?: string // LinkedIn
  connection_message?: string // LinkedIn
  stream_category?: string // Twitch
  validation?: {
    status: 'valid' | 'warning' | 'error'
    score?: number
    issues?: Array<{ field: string; message: string }>
    suggestions?: string[]
  }
}

interface GeneratedContentCardProps {
  content: GeneratedContent
  loading?: boolean
  error?: string
  className?: string
}

export const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({
  content,
  loading = false,
  error,
  className = ''
}) => {
  const [titleCopied, setTitleCopied] = useState(false)
  const [tagsCopied, setTagsCopied] = useState(false)
  const [platformContentCopied, setPlatformContentCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'details' | 'preview'>('details')

  const platform = PLATFORMS.find(p => p.id === content.platform)
  const IconComponent = platform?.icon

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Platform-specific content formatting for copy functionality
  const formatContentForPlatform = (content: GeneratedContent): string => {
    const hashtags = content.tags.map(tag => `#${tag}`).join(' ')
    
    switch (content.platform.toLowerCase()) {
      case 'youtube':
        let youtubeContent = content.title
        if (content.description) {
          youtubeContent += `\n\n${content.description}`
        }
        if (hashtags) {
          youtubeContent += `\n\n${hashtags}`
        }
        return youtubeContent.trim()
      
      case 'instagram':
        const caption = content.caption || content.title
        return `${caption}\n\n${hashtags}`.trim()
      
      case 'x_twitter':
      case 'twitter':
      case 'x':
        const twitterContent = content.post_body || content.title
        return `${twitterContent} ${hashtags}`.trim()
      
      case 'linkedin':
        const linkedinContent = content.post_body || content.title
        let linkedinPost = linkedinContent
        if (content.headline) {
          linkedinPost += `\n\n${content.headline}`
        }
        if (hashtags) {
          linkedinPost += `\n\n${hashtags}`
        }
        return linkedinPost.trim()
      
      case 'facebook':
        const facebookContent = content.post_body || content.title
        return `${facebookContent}\n\n${hashtags}`.trim()
      
      case 'tiktok':
      case 'tik_tok':
        const tiktokCaption = content.caption || content.title
        return `${tiktokCaption} ${hashtags}`.trim()
      
      case 'twitch':
        let twitchContent = content.title
        if (content.bio) {
          twitchContent += `\n\n${content.bio}`
        }
        if (content.stream_category) {
          twitchContent += `\n\nCategory: ${content.stream_category}`
        }
        if (hashtags) {
          twitchContent += `\n\n${hashtags}`
        }
        return twitchContent.trim()
      
      default:
        return `${content.title}\n\n${hashtags}`.trim()
    }
  }

  const getValidationColor = (status?: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getValidationIcon = (status?: string) => {
    switch (status) {
      case 'valid': return <FaCheck size={14} />
      case 'warning': return <FaExclamationTriangle size={14} />
      case 'error': return <FaTimes size={14} />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl p-6 shadow-lg ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          {IconComponent && <IconComponent size={20} className="text-muted-foreground" />}
          <h3 className="font-semibold text-lg capitalize">{content.platform}</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-blue-600" size={24} />
          <span className="ml-3 text-muted-foreground">Generating content...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          {IconComponent && <IconComponent size={20} className="text-red-600" />}
          <h3 className="font-semibold text-lg capitalize">{content.platform}</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <FaTimes size={16} />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent size={20} className="text-foreground" />}
          <h3 className="font-semibold text-lg capitalize">{content.platform}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Copy for Platform Button */}
          <button
            onClick={() => copyToClipboard(formatContentForPlatform(content), setPlatformContentCopied)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            {platformContentCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
            {platformContentCopied ? 'Copied!' : `Copy for ${platform?.label || content.platform}`}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('details')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'details'
                  ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FaList size={12} />
              Details
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FaEye size={12} />
              Preview
            </button>
          </div>

          {/* Validation Badge */}
          {content.validation && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getValidationColor(content.validation.status)}`}>
              {getValidationIcon(content.validation.status)}
              <span>
                {content.validation.status === 'valid' && 'Valid'}
                {content.validation.status === 'warning' && 'Needs Review'}
                {content.validation.status === 'error' && 'Issues Found'}
                {content.validation.score && ` (${content.validation.score}%)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'details' ? (
        <div>
          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <button
                onClick={() => copyToClipboard(content.title, setTitleCopied)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
              >
                {titleCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                {titleCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm">
              {content.title}
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">Tags</label>
              <button
                onClick={() => copyToClipboard(content.tags.join(' '), setTagsCopied)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
              >
                {tagsCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                {tagsCopied ? 'Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Validation Details */}
          {content.validation && (content.validation.issues?.length || content.validation.suggestions?.length) && (
            <div className="border-t border-border pt-4">
              {content.validation.issues && content.validation.issues.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                    <FaExclamationTriangle size={12} />
                    Issues
                  </h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {content.validation.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.validation.suggestions && content.validation.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-2">Suggestions</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {content.validation.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          {/* Platform Preview Mode */}
          <PlatformPreview
            platform={content.platform}
            content={content}
            className="w-full max-w-lg"
          />
        </div>
      )}
    </div>
  )
}

export default GeneratedContentCard 