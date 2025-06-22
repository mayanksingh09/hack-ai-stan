'use client'

import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PLATFORMS, type Platform } from '@/lib/constants/platforms'

interface PlatformSelectorProps {
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  multiple?: boolean
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  value,
  onValueChange,
  className,
  multiple = false
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-4 block">
        Select Platform{multiple ? 's' : ''}
      </label>
      {multiple ? (
        <ToggleGroup
          type="multiple"
          value={Array.isArray(value) ? value : value ? [value] : []}
          onValueChange={onValueChange as (value: string[]) => void}
          className="grid grid-cols-3 gap-3"
        >
          {PLATFORMS.map((platform: Platform) => {
            const IconComponent = platform.icon
            return (
              <ToggleGroupItem
                key={platform.id}
                value={platform.id}
                aria-label={`Select ${platform.label}`}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-sm min-h-[48px]"
              >
                <IconComponent size={18} />
                <span className="text-sm font-medium">{platform.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      ) : (
        <ToggleGroup
          type="single"
          value={Array.isArray(value) ? value[0] || '' : value || ''}
          onValueChange={onValueChange as (value: string) => void}
          className="grid grid-cols-3 gap-3"
        >
          {PLATFORMS.map((platform: Platform) => {
            const IconComponent = platform.icon
            return (
              <ToggleGroupItem
                key={platform.id}
                value={platform.id}
                aria-label={`Select ${platform.label}`}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-sm min-h-[48px]"
              >
                <IconComponent size={18} />
                <span className="text-sm font-medium">{platform.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      )}
    </div>
  )
}

export default PlatformSelector 