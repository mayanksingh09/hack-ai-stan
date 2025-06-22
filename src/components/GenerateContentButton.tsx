'use client'

import React from 'react'
import { FaMagic, FaSpinner } from 'react-icons/fa'

interface GenerateContentButtonProps {
  onGenerate: () => void
  loading?: boolean
  disabled?: boolean
  platforms: string[]
  className?: string
}

export const GenerateContentButton: React.FC<GenerateContentButtonProps> = ({
  onGenerate,
  loading = false,
  disabled = false,
  platforms,
  className = ''
}) => {
  const platformCount = platforms.length
  const isDisabled = disabled || loading || platformCount === 0

  return (
    <button
      onClick={onGenerate}
      disabled={isDisabled}
      className={`
        relative w-full px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200
        bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
        text-white shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
        flex items-center justify-center gap-3
        ${className}
      `}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" size={16} />
          <span>Generating Content...</span>
        </>
      ) : (
        <>
          <FaMagic size={16} />
          <span>
            Generate Content{platformCount > 1 ? ` (${platformCount} platforms)` : ''}
          </span>
        </>
      )}
    </button>
  )
}

export default GenerateContentButton 