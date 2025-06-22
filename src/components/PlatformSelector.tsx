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
          className="flex flex-wrap gap-3 justify-start"
        >
          {PLATFORMS.map((platform: Platform) => {
            const IconComponent = platform.icon
            return (
              <ToggleGroupItem
                key={platform.id}
                value={platform.id}
                aria-label={`Select ${platform.label}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-sm min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] flex-grow-0 flex-shrink-0 basis-auto sm:basis-[calc(50%-0.375rem)] md:basis-[calc(33.333%-0.5rem)] lg:basis-[calc(25%-0.563rem)] xl:basis-[calc(20%-0.6rem)]"
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
          className="flex flex-wrap gap-3 justify-start"
        >
          {PLATFORMS.map((platform: Platform) => {
            const IconComponent = platform.icon
            return (
              <ToggleGroupItem
                key={platform.id}
                value={platform.id}
                aria-label={`Select ${platform.label}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-sm min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] flex-grow-0 flex-shrink-0 basis-auto sm:basis-[calc(50%-0.375rem)] md:basis-[calc(33.333%-0.5rem)] lg:basis-[calc(25%-0.563rem)] xl:basis-[calc(20%-0.6rem)]"
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