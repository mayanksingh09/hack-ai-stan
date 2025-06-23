'use client'

import React from 'react'
import { FaHeart, FaUsers, FaEye, FaPlay, FaGamepad, FaCrown, FaShare } from 'react-icons/fa'

interface TwitchPreviewProps {
  title: string
  bio?: string
  stream_category?: string
  tags: string[]
  username?: string
  className?: string
}

const TWITCH_TITLE_LIMIT = 140

export const TwitchPreview: React.FC<TwitchPreviewProps> = ({
  title,
  bio,
  stream_category = 'Just Chatting',
  tags,
  username = 'your_username',
  className = ''
}) => {
  const getTitleStatus = (length: number) => {
    if (length <= 60) return 'text-green-400'
    if (length <= 100) return 'text-yellow-400'
    if (length <= TWITCH_TITLE_LIMIT) return 'text-orange-400'
    return 'text-red-400'
  }

  const getTitleTip = (length: number) => {
    if (length <= 60) return 'Great title length for discovery'
    if (length <= 100) return 'Good title length'
    if (length <= TWITCH_TITLE_LIMIT) return 'Title is getting long'
    return 'Title exceeds recommended length'
  }

  const truncatedTitle = title.length > TWITCH_TITLE_LIMIT ? 
    title.substring(0, TWITCH_TITLE_LIMIT) + '...' : title

  return (
    <div className={`bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden max-w-md ${className}`}>
      {/* Stream Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        
        {/* Stream Preview Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30">🎮</div>
        </div>

        {/* Live Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <FaEye className="text-xs" />
            12.5K
          </div>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-purple-600 hover:bg-purple-500 transition-colors rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
            <FaPlay className="text-white text-xl ml-1" />
          </div>
        </div>

        {/* Duration/Quality */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            1080p60
          </div>
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            2:34:15
          </div>
        </div>
      </div>

      {/* Stream Info */}
      <div className="p-4">
        {/* Channel Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Profile Picture */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-sm">
                {username}
              </h3>
              <div className="flex items-center gap-1">
                <FaCrown className="text-purple-400 text-xs" />
                <span className="text-xs text-purple-400">Partner</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <FaUsers className="text-xs" />
                <span>2.4K followers</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            Follow
          </button>
        </div>

        {/* Stream Title */}
        <div className="mb-3">
          <h2 className="text-white font-semibold text-sm leading-tight mb-2">
            {truncatedTitle}
          </h2>
          
          {/* Title Analysis */}
          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">
                Title Analysis
              </span>
              <span className={`text-xs font-medium ${getTitleStatus(title.length)}`}>
                {title.length}/{TWITCH_TITLE_LIMIT}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {getTitleTip(title.length)}
            </div>
            
            {/* Length indicator bar */}
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all ${
                  title.length <= 60 
                    ? 'bg-green-500' 
                    : title.length <= 100 
                      ? 'bg-yellow-500' 
                      : title.length <= TWITCH_TITLE_LIMIT
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((title.length / TWITCH_TITLE_LIMIT) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game/Category */}
        <div className="flex items-center gap-2 mb-3">
          <FaGamepad className="text-purple-400 text-sm" />
          <span className="text-sm text-gray-300">Playing</span>
          <span className="text-sm text-white font-medium">{stream_category}</span>
        </div>

        {/* Channel Description */}
        {bio && (
          <div className="mb-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 transition-colors rounded-full text-gray-300 border border-gray-600"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 border border-gray-600">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Stream Stats */}
        <div className="flex items-center justify-between py-3 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaHeart className="text-red-500" />
              <span>3.2K</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaUsers />
              <span>890 chatting</span>
            </div>
          </div>
          
          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        {/* Stream Actions */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
            Subscribe
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
            Donate
          </button>
        </div>
      </div>

      {/* Twitch Branding */}
      <div className="bg-purple-600 text-white text-center py-2">
        <span className="text-sm font-bold">Twitch</span>
      </div>
    </div>
  )
}

export default TwitchPreview 