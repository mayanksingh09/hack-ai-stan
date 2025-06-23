'use client'

import React, { useState } from 'react'
import { FaPlay, FaEye, FaThumbsUp, FaShare } from 'react-icons/fa'

interface YouTubePreviewProps {
  title: string
  description?: string
  tags: string[]
  className?: string
}

const YOUTUBE_TITLE_LIMIT = 100
const YOUTUBE_DESCRIPTION_LIMIT = 5000
const YOUTUBE_DESCRIPTION_PREVIEW_LIMIT = 157

export const YouTubePreview: React.FC<YouTubePreviewProps> = ({
  title,
  description = '',
  tags,
  className = ''
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const truncateTitle = (text: string, limit: number) => {
    if (text.length <= limit) return text
    return text.substring(0, limit - 3) + '...'
  }

  const truncateDescription = (text: string, limit: number) => {
    if (text.length <= limit) return text
    return text.substring(0, limit) + '...'
  }

  const getTitleStatus = (length: number) => {
    if (length <= 60) return 'text-green-600'
    if (length <= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDescriptionStatus = (length: number) => {
    if (length <= 1000) return 'text-green-600'
    if (length <= 3000) return 'text-yellow-600'
    return 'text-red-600'
  }

  const displayDescription = showFullDescription 
    ? description 
    : truncateDescription(description, YOUTUBE_DESCRIPTION_PREVIEW_LIMIT)

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-md ${className}`}>
      {/* Video Thumbnail Placeholder */}
      <div className="relative bg-black aspect-video flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-80"></div>
        <FaPlay className="text-white text-4xl opacity-80 z-10" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
          10:24
        </div>
      </div>

      {/* Video Info */}
      <div className="p-3">
        {/* Channel Row */}
        <div className="flex items-start gap-3 mb-2">
          {/* Channel Avatar Placeholder */}
          <div className="flex-shrink-0 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">YT</span>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-medium text-sm leading-5 mb-1 text-gray-900 dark:text-white line-clamp-2">
              {truncateTitle(title, YOUTUBE_TITLE_LIMIT)}
            </h3>

            {/* Channel Name & Stats */}
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Your Channel</span>
              <span className="mx-1">•</span>
              <span>1.2K views</span>
              <span className="mx-1">•</span>
              <span>2 hours ago</span>
            </div>
          </div>

          {/* Options Menu */}
          <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            <div className="w-4 h-1 bg-current rounded-full mb-1"></div>
            <div className="w-4 h-1 bg-current rounded-full mb-1"></div>
            <div className="w-4 h-1 bg-current rounded-full"></div>
          </div>
        </div>

        {/* Character Count for Title */}
        <div className="text-xs mb-2">
          <span className={`font-medium ${getTitleStatus(title.length)}`}>
            Title: {title.length}/{YOUTUBE_TITLE_LIMIT}
          </span>
        </div>

        {/* Description */}
        {description && (
          <div className="mb-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              {displayDescription}
              {description.length > YOUTUBE_DESCRIPTION_PREVIEW_LIMIT && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 dark:text-blue-400 ml-1 hover:underline font-medium"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            
            {/* Character Count for Description */}
            <div className="text-xs">
              <span className={`font-medium ${getDescriptionStatus(description.length)}`}>
                Description: {description.length}/{YOUTUBE_DESCRIPTION_LIMIT}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                  +{tags.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">
              <FaThumbsUp className="text-sm" />
              <span className="text-xs">142</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              <FaShare className="text-sm" />
              <span className="text-xs">Share</span>
            </button>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
            <FaEye className="text-sm" />
            <span>1.2K</span>
          </div>
        </div>
      </div>

      {/* YouTube Branding */}
      <div className="bg-red-600 text-white text-center py-1">
        <span className="text-xs font-bold">YouTube</span>
      </div>
    </div>
  )
}

export default YouTubePreview 