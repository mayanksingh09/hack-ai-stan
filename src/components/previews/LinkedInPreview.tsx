'use client'

import React, { useState } from 'react'
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaLinkedin } from 'react-icons/fa'

interface LinkedInPreviewProps {
  title: string
  post_body?: string
  headline?: string
  about_section?: string
  tags: string[]
  username?: string
  profile_name?: string
  className?: string
}

const LINKEDIN_POST_LIMIT = 3000
const LINKEDIN_POST_PREVIEW_LIMIT = 200

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  title,
  post_body,
  headline,
  about_section,
  tags,
  profile_name = 'Your Profile',
  className = ''
}) => {
  const [showFullPost, setShowFullPost] = useState(false)

  // Use post_body if provided, otherwise use title
  const mainContent = post_body || title
  const hashtags = tags.map(tag => `#${tag}`).join(' ')
  const fullContent = `${mainContent}${hashtags ? '\n\n' + hashtags : ''}`

  const truncateContent = (text: string, limit: number) => {
    if (text.length <= limit) return text
    return text.substring(0, limit) + '...'
  }

  const getContentStatus = (length: number) => {
    if (length <= 1000) return 'text-green-600'
    if (length <= 2000) return 'text-yellow-600'
    return 'text-red-600'
  }

  const displayContent = showFullPost 
    ? fullContent 
    : truncateContent(fullContent, LINKEDIN_POST_PREVIEW_LIMIT)

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {profile_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {profile_name}
              </h3>
              {headline && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
                  {headline}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">2h</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">🌐</span>
              </div>
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1">
              <FaEllipsisH size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Main Post Text */}
        <div className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3 whitespace-pre-line">
          {displayContent}
          {fullContent.length > LINKEDIN_POST_PREVIEW_LIMIT && (
            <button
              onClick={() => setShowFullPost(!showFullPost)}
              className="text-blue-600 dark:text-blue-400 ml-1 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {showFullPost ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        {/* Character Count */}
        <div className="text-xs mb-3">
          <span className={`font-medium ${getContentStatus(fullContent.length)}`}>
            Post: {fullContent.length}/{LINKEDIN_POST_LIMIT}
          </span>
        </div>

        {/* About Section Preview */}
        {about_section && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <FaLinkedin className="text-blue-600 text-sm" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">About</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {truncateContent(about_section, 120)}
            </p>
          </div>
        )}

        {/* Engagement Bar */}
        <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <FaThumbsUp className="text-white text-xs" />
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">❤</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">247 reactions</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span>18 comments</span>
            <span>12 reposts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around pt-2 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <FaThumbsUp size={16} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <FaComment size={16} />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <FaShare size={16} />
            <span className="text-sm font-medium">Repost</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span className="text-sm font-medium">Send</span>
          </button>
        </div>
      </div>

      {/* LinkedIn Branding */}
      <div className="bg-blue-600 text-white text-center py-1">
        <span className="text-xs font-bold">LinkedIn</span>
      </div>
    </div>
  )
}

export default LinkedInPreview 