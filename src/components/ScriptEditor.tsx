'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'

interface ScriptEditorProps {
  value?: string
  defaultValue?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder = "Write your content script here...",
  className,
  disabled = false,
  required = false
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 block">
        Content Script {required && <span className="text-destructive">*</span>}
      </label>
      <Textarea
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="min-h-[120px] resize-y"
        aria-label="Content script editor"
        aria-describedby="content-script-description"
      />
      <p id="content-script-description" className="text-xs text-muted-foreground mt-2">
        Write the script or content for your social media post
      </p>
    </div>
  )
}

export default ScriptEditor 