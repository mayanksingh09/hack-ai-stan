'use client'

import React from 'react'
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaHeart, FaLaugh } from 'react-icons/fa'

interface FacebookPreviewProps {
  title: string
  post_body?: string
  headline?: string
  tags: string[]
  username?: string
  profile_name?: string
  className?: string
}

const FACEBOOK_OPTIMAL_LENGTH = 80
const FACEBOOK_MAX_TAGS = 5

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  title,
  post_body,
  headline,
  tags,
  profile_name = 'Your Profile',
  className = ''
}) => {
  // Use post_body if provided, otherwise use title
  const mainContent = post_body || title
  
  // Limit hashtags to 3-5 for optimal Facebook engagement
  const limitedTags = tags.slice(0, FACEBOOK_MAX_TAGS)
  const hashtags = limitedTags.map(tag => `#${tag}`).join(' ')
  const fullContent = `${mainContent}${hashtags ? ' ' + hashtags : ''}`

  const getContentStatus = (length: number) => {
    if (length <= FACEBOOK_OPTIMAL_LENGTH) return 'text-green-600'
    if (length <= 160) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEngagementTip = (length: number) => {
    if (length <= FACEBOOK_OPTIMAL_LENGTH) return 'Optimal length for engagement'
    if (length <= 160) return 'Good length, could be shorter'
    return 'Consider shortening for better engagement'
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {profile_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {profile_name}
              </h3>
              {headline && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {headline}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">2h</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <div className="w-3 h-3 text-gray-500 dark:text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                  </svg>
                </div>
              </div>
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full transition-colors">
              <FaEllipsisH size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
          {fullContent}
        </div>

        {/* Engagement Optimization Indicator */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Content Analysis
            </span>
            <span className={`text-xs font-medium ${getContentStatus(fullContent.length)}`}>
              {fullContent.length} chars
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {getEngagementTip(fullContent.length)}
          </div>
          
          {/* Length indicator bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                fullContent.length <= FACEBOOK_OPTIMAL_LENGTH 
                  ? 'bg-green-500' 
                  : fullContent.length <= 160 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((fullContent.length / 200) * 100, 100)}%` 
              }}
            ></div>
          </div>
          
          {tags.length > FACEBOOK_MAX_TAGS && (
            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 dark:text-orange-400">
              <span>⚠️</span>
              <span>Using {tags.length} hashtags. Consider using {FACEBOOK_MAX_TAGS} or fewer for better reach.</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 aspect-video flex items-center justify-center mx-4 rounded-lg mb-3">
        <div className="text-4xl text-blue-400 dark:text-blue-500">📸</div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Photo
        </div>
      </div>

      {/* Engagement Bar */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <FaThumbsUp className="text-white text-xs" />
              </div>
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-xs" />
              </div>
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <FaLaugh className="text-white text-xs" />
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">142 reactions</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span>28 comments</span>
            <span>15 shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around pt-2 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-1 justify-center">
            <FaThumbsUp size={16} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-1 justify-center">
            <FaComment size={16} />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-1 justify-center">
            <FaShare size={16} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Facebook Branding */}
      <div className="bg-blue-600 text-white text-center py-1">
        <span className="text-xs font-bold">Facebook</span>
      </div>
    </div>
  )
}

export default FacebookPreview 