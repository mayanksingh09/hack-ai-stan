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
  readOnly?: boolean
  showEditToggle?: boolean
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder = "Write your content script here...",
  className,
  disabled = false,
  required = false,
  readOnly = false,
  showEditToggle = false
}) => {
  const [isEditing, setIsEditing] = React.useState(!readOnly)

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Content Script {required && <span className="text-destructive">*</span>}
        </label>
        {showEditToggle && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {isEditing ? 'View' : 'Edit'}
          </button>
        )}
      </div>
      <Textarea
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={showEditToggle ? !isEditing : readOnly}
        required={required}
        className="min-h-[120px] resize-y"
        aria-label="Content script editor"
        aria-describedby="content-script-description"
      />
      <p id="content-script-description" className="text-xs text-muted-foreground mt-2">
        {readOnly || (showEditToggle && !isEditing) 
          ? "Generated script content" 
          : "Write the script or content for your social media post"}
      </p>
    </div>
  )
}

export default ScriptEditor 