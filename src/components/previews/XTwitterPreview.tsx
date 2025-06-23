'use client'

import React from 'react'
import { FaRetweet, FaHeart, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa'

interface XTwitterPreviewProps {
  title: string // Used as post body if post_body not provided
  post_body?: string
  tags: string[]
  username?: string
  profile_name?: string
  className?: string
}

const TWITTER_CHARACTER_LIMIT = 280

export const XTwitterPreview: React.FC<XTwitterPreviewProps> = ({
  title,
  post_body,
  tags,
  username = 'your_username',
  profile_name = 'Your Profile',
  className = ''
}) => {
  // Use post_body if provided, otherwise use title
  const mainContent = post_body || title
  const hashtags = tags.map(tag => `#${tag}`).join(' ')
  const fullContent = `${mainContent}${hashtags ? ' ' + hashtags : ''}`

  const getCharacterCountStatus = (length: number) => {
    if (length <= 200) return 'text-green-600'
    if (length <= 260) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressRingColor = (length: number) => {
    if (length <= 200) return 'stroke-green-500'
    if (length <= 260) return 'stroke-yellow-500'
    return 'stroke-red-500'
  }

  const progressPercentage = Math.min((fullContent.length / TWITTER_CHARACTER_LIMIT) * 100, 100)
  const circumference = 2 * Math.PI * 8 // radius of 8
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-1 mb-2">
            <span className="font-bold text-gray-900 dark:text-white text-sm truncate">
              {profile_name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              @{username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">2h</span>
            <div className="ml-auto">
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1">
                <FaEllipsisH size={16} />
              </button>
            </div>
          </div>

          {/* Tweet Text */}
          <div className="text-gray-900 dark:text-white text-sm leading-5 mb-3 break-words">
            {fullContent}
          </div>

          {/* Character Count Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5">
                <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-300 dark:text-gray-600"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={getProgressRingColor(fullContent.length)}
                    strokeLinecap="round"
                  />
                </svg>
                {fullContent.length > 260 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-red-600 font-bold">
                      {TWITTER_CHARACTER_LIMIT - fullContent.length}
                    </span>
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${getCharacterCountStatus(fullContent.length)}`}>
                {fullContent.length}/{TWITTER_CHARACTER_LIMIT}
              </span>
            </div>
          </div>

          {/* Tweet Actions */}
          <div className="flex items-center justify-between max-w-xs">
            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <FaComment size={14} />
              </div>
              <span className="text-xs">24</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                <FaRetweet size={14} />
              </div>
              <span className="text-xs">12</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
                <FaHeart size={14} />
              </div>
              <span className="text-xs">142</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <FaShare size={14} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Warning for character limit exceeded */}
      {fullContent.length > TWITTER_CHARACTER_LIMIT && (
        <div className="px-4 pb-3">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                Tweet exceeds character limit by {fullContent.length - TWITTER_CHARACTER_LIMIT} characters
              </span>
            </div>
          </div>
        </div>
      )}

      {/* X (Twitter) Branding */}
      <div className="bg-black text-white text-center py-1">
        <span className="text-xs font-bold">𝕏</span>
      </div>
    </div>
  )
}

export default XTwitterPreview 