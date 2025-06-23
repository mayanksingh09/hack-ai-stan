'use client'

import React, { useState } from 'react'
import { FaHeart, FaComment, FaShare, FaBookmark, FaEllipsisH } from 'react-icons/fa'

interface InstagramPreviewProps {
  title: string // Used as initial caption text
  caption?: string
  tags: string[]
  username?: string
  profile_name?: string
  className?: string
}

const INSTAGRAM_CAPTION_LIMIT = 2200
const INSTAGRAM_CAPTION_PREVIEW_LIMIT = 125

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  title,
  caption,
  tags,
  username = 'your_username',
  profile_name = 'Your Profile',
  className = ''
}) => {
  const [showFullCaption, setShowFullCaption] = useState(false)

  // Use caption if provided, otherwise use title as caption
  const mainCaption = caption || title
  const hashtags = tags.map(tag => `#${tag}`).join(' ')
  const fullContent = `${mainCaption}${hashtags ? ' ' + hashtags : ''}`

  const truncateCaption = (text: string, limit: number) => {
    if (text.length <= limit) return text
    return text.substring(0, limit) + '...'
  }

  const getCaptionStatus = (length: number) => {
    if (length <= 500) return 'text-green-600'
    if (length <= 1500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const displayCaption = showFullCaption 
    ? fullContent 
    : truncateCaption(fullContent, INSTAGRAM_CAPTION_PREVIEW_LIMIT)

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Username */}
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              {username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile_name}
            </p>
          </div>
        </div>

        {/* Options */}
        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <FaEllipsisH />
        </button>
      </div>

      {/* Image Placeholder */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-400/20"></div>
        <div className="text-6xl text-gray-400 dark:text-gray-600 z-10">📷</div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          1/3
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <button className="text-gray-900 dark:text-white hover:text-red-500 transition-colors">
            <FaHeart size={24} />
          </button>
          <button className="text-gray-900 dark:text-white hover:text-blue-500 transition-colors">
            <FaComment size={24} />
          </button>
          <button className="text-gray-900 dark:text-white hover:text-gray-600 transition-colors">
            <FaShare size={24} />
          </button>
        </div>
        <button className="text-gray-900 dark:text-white hover:text-gray-600 transition-colors">
          <FaBookmark size={20} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-3 pb-1">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">
          2,847 likes
        </p>
      </div>

      {/* Caption */}
      <div className="px-3 pb-2">
        <div className="text-sm text-gray-900 dark:text-white">
          <span className="font-semibold">{username}</span>{' '}
          <span className="break-words">
            {displayCaption}
            {fullContent.length > INSTAGRAM_CAPTION_PREVIEW_LIMIT && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-gray-500 dark:text-gray-400 ml-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showFullCaption ? 'less' : 'more'}
              </button>
            )}
          </span>
        </div>

        {/* Character Count */}
        <div className="text-xs mt-1">
          <span className={`font-medium ${getCaptionStatus(fullContent.length)}`}>
            Caption: {fullContent.length}/{INSTAGRAM_CAPTION_LIMIT}
          </span>
        </div>
      </div>

      {/* Comments Preview */}
      <div className="px-3 pb-2">
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          View all 24 comments
        </button>
        <div className="mt-1 text-sm text-gray-900 dark:text-white">
          <span className="font-semibold">friend_username</span>{' '}
          <span>Amazing post! 🔥</span>
        </div>
      </div>

      {/* Time */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
          2 HOURS AGO
        </p>
      </div>

      {/* Add Comment */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-white border-none outline-none"
            disabled
          />
          <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
            Post
          </button>
        </div>
      </div>

      {/* Instagram Branding */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-center py-1">
        <span className="text-xs font-bold">Instagram</span>
      </div>
    </div>
  )
}

export default InstagramPreview 