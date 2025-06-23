'use client'

import React from 'react'
import { FaHeart, FaComment, FaShare, FaMusic, FaPlus } from 'react-icons/fa'

interface TikTokPreviewProps {
  title: string
  caption?: string
  tags: string[]
  username?: string
  className?: string
}

const TIKTOK_CAPTION_LIMIT = 2200

export const TikTokPreview: React.FC<TikTokPreviewProps> = ({
  title,
  caption,
  tags,
  username = 'your_username',
  className = ''
}) => {
  // Use caption if provided, otherwise use title as caption
  const mainCaption = caption || title
  const hashtags = tags.map(tag => `#${tag}`).join(' ')
  const fullContent = `${mainCaption}${hashtags ? ' ' + hashtags : ''}`

  const getCaptionStatus = (length: number) => {
    if (length <= 1000) return 'text-green-400'
    if (length <= 1800) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`bg-black text-white rounded-2xl shadow-2xl overflow-hidden max-w-xs relative aspect-[9/16] ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">🎵</div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium">Following</div>
          <div className="text-xs font-medium">For You</div>
          <div className="text-xs font-medium">LIVE</div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-2 bottom-20 z-10 flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
              <FaPlus className="text-white text-xs" />
            </div>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <FaHeart className="text-white text-2xl hover:text-red-500 transition-colors cursor-pointer" />
          </div>
          <span className="text-xs font-medium mt-1">142K</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <FaComment className="text-white text-2xl hover:text-yellow-400 transition-colors cursor-pointer" />
          </div>
          <span className="text-xs font-medium mt-1">1.2K</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <FaShare className="text-white text-xl hover:text-blue-400 transition-colors cursor-pointer" />
          </div>
          <span className="text-xs font-medium mt-1">840</span>
        </div>

        {/* Music Disc */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center animate-spin">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <FaMusic className="text-white text-xs" />
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-6">
        {/* Username */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm">@{username}</span>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <span className="text-xs text-gray-300">Follow</span>
        </div>

        {/* Caption */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed break-words">
            {fullContent}
          </p>
        </div>

        {/* Character Count */}
        <div className="text-xs mb-3">
          <span className={`font-medium ${getCaptionStatus(fullContent.length)}`}>
            {fullContent.length}/{TIKTOK_CAPTION_LIMIT}
          </span>
        </div>

        {/* Music Info */}
        <div className="flex items-center gap-2 mb-2">
          <FaMusic className="text-white text-xs" />
          <span className="text-xs text-gray-300 truncate">
            Original sound - {username}
          </span>
        </div>

        {/* Hashtag Pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-gray-300">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Effects/Filters */}
        <div className="text-xs text-gray-400">
          ✨ Original • 📍 Trending
        </div>
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
      </div>

      {/* TikTok Branding */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
          <span className="text-xs font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
            TikTok
          </span>
        </div>
      </div>

      {/* Neon Accent Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 -z-10"></div>
    </div>
  )
}

export default TikTokPreview 