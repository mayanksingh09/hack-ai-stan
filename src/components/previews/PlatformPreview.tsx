'use client'

import React from 'react'
import { YouTubePreview } from './YouTubePreview'
import { InstagramPreview } from './InstagramPreview'
import { XTwitterPreview } from './XTwitterPreview'
import { LinkedInPreview } from './LinkedInPreview'
import { FacebookPreview } from './FacebookPreview'
import { TikTokPreview } from './TikTokPreview'
import { TwitchPreview } from './TwitchPreview'

interface GeneratedContent {
  title: string
  tags: string[]
  description?: string
  caption?: string
  post_body?: string
  headline?: string
  bio?: string
  username?: string
  profile_name?: string
  about_section?: string
  connection_message?: string
  stream_category?: string
}

interface PlatformPreviewProps {
  platform: string
  content: GeneratedContent
  className?: string
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  platform,
  content,
  className = ''
}) => {
  const normalizedPlatform = platform.toLowerCase()

  try {
    switch (normalizedPlatform) {
      case 'youtube':
        return (
          <YouTubePreview
            title={content.title}
            description={content.description}
            tags={content.tags}
            className={className}
          />
        )

      case 'instagram':
        return (
          <InstagramPreview
            title={content.title}
            caption={content.caption}
            tags={content.tags}
            username={content.username}
            profile_name={content.profile_name}
            className={className}
          />
        )

      case 'x_twitter':
      case 'twitter':
      case 'x':
        return (
          <XTwitterPreview
            title={content.title}
            post_body={content.post_body}
            tags={content.tags}
            username={content.username}
            profile_name={content.profile_name}
            className={className}
          />
        )

      case 'linkedin':
        return (
          <LinkedInPreview
            title={content.title}
            post_body={content.post_body}
            headline={content.headline}
            about_section={content.about_section}
            tags={content.tags}
            profile_name={content.profile_name}
            className={className}
          />
        )

      case 'facebook':
        return (
          <FacebookPreview
            title={content.title}
            post_body={content.post_body}
            headline={content.headline}
            tags={content.tags}
            profile_name={content.profile_name}
            className={className}
          />
        )

      case 'tiktok':
      case 'tik_tok':
        return (
          <TikTokPreview
            title={content.title}
            caption={content.caption}
            tags={content.tags}
            username={content.username}
            className={className}
          />
        )

      case 'twitch':
        return (
          <TwitchPreview
            title={content.title}
            bio={content.bio}
            stream_category={content.stream_category}
            tags={content.tags}
            username={content.username}
            className={className}
          />
        )

      default:
        return <GenericPreview content={content} platform={platform} className={className} />
    }
  } catch (error) {
    console.error(`Error rendering preview for platform ${platform}:`, error)
    return <ErrorPreview platform={platform} error={error} className={className} />
  }
}

// Generic fallback preview for unsupported platforms
const GenericPreview: React.FC<{
  content: GeneratedContent
  platform: string
  className?: string
}> = ({ content, platform, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {platform.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {platform} Preview
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Generic preview - platform not fully supported
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
          {content.title}
        </h2>
        
        {content.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {content.description}
          </p>
        )}

        {content.post_body && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {content.post_body}
          </p>
        )}

        {content.caption && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {content.caption}
          </p>
        )}

        {content.bio && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Bio:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {content.bio}
            </p>
          </div>
        )}

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add support for {platform} to see platform-specific preview
        </p>
      </div>
    </div>
  )
}

// Error fallback preview
const ErrorPreview: React.FC<{
  platform: string
  error: unknown
  className?: string
}> = ({ platform, error, className = '' }) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
        <h3 className="font-semibold text-red-800 dark:text-red-200 text-sm">
          Preview Error
        </h3>
      </div>
      
      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
        Failed to render preview for platform: <strong>{platform}</strong>
      </p>
      
      <p className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded px-2 py-1">
        {errorMessage}
      </p>
      
      <div className="mt-3 text-xs text-red-600 dark:text-red-400">
        <p>Please try:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          <li>Refreshing the page</li>
          <li>Checking your content data</li>
          <li>Contacting support if the issue persists</li>
        </ul>
      </div>
    </div>
  )
}

export default PlatformPreview 