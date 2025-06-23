'use client'

import { useState, useCallback } from 'react'

interface GeneratedContent {
  platform: string
  title: string
  tags: string[]
  // Platform-specific content fields
  description?: string // YouTube
  caption?: string // Instagram, TikTok
  post_body?: string // Facebook, LinkedIn, X/Twitter
  headline?: string // LinkedIn, Facebook
  bio?: string // all platforms
  username?: string // all platforms
  profile_name?: string // all platforms
  about_section?: string // LinkedIn
  connection_message?: string // LinkedIn
  stream_category?: string // Twitch
  validation?: {
    status: 'valid' | 'warning' | 'error'
    score?: number
    issues?: Array<{ field: string; message: string }>
    suggestions?: string[]
  }
}

interface ContentGenerationState {
  [platform: string]: {
    content?: GeneratedContent
    loading: boolean
    error?: string
  }
}

interface UseContentGenerationReturn {
  generatedContent: ContentGenerationState
  generateContent: (platforms: string[], transcript: string) => Promise<void>
  isGenerating: boolean
  clearContent: () => void
}

export const useContentGeneration = (): UseContentGenerationReturn => {
  const [generatedContent, setGeneratedContent] = useState<ContentGenerationState>({})

  const isGenerating = Object.values(generatedContent).some(state => state.loading)

  const generateContent = useCallback(async (platforms: string[], transcript: string) => {
    if (!transcript.trim()) return

    // Initialize loading states for all platforms
    const initialStates: ContentGenerationState = {}
    platforms.forEach(platform => {
      initialStates[platform] = { loading: true }
    })
    setGeneratedContent(initialStates)

    // Create promises for all platform generation requests
    const generationPromises = platforms.map(async (platform) => {
      try {
        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
        const generateEndpoint = `${fastApiUrl}/api/v1/generate/${platform}`
        const response = await fetch(generateEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript: { content: transcript } }),
        })

        if (!response.ok) {
          throw new Error(`Failed to generate content for ${platform}: ${response.statusText}`)
        }

        const data = await response.json()
        
        // Parse the API response structure
        const content: GeneratedContent = {
          platform,
          title: data.content?.title || '',
          tags: Array.isArray(data.content?.tags) 
            ? data.content.tags 
            : typeof data.content?.tags === 'string' 
              ? data.content.tags.split(' ').filter((tag: string) => tag.trim())
              : [],
          // Platform-specific content fields
          description: data.content?.description || undefined,
          caption: data.content?.caption || undefined,
          post_body: data.content?.post_body || undefined,
          headline: data.content?.headline || undefined,
          bio: data.content?.bio || undefined,
          username: data.content?.username || undefined,
          profile_name: data.content?.profile_name || undefined,
          about_section: data.content?.about_section || undefined,
          connection_message: data.content?.connection_message || undefined,
          stream_category: data.content?.stream_category || undefined,
          validation: {
            status: data.validation_passed ? 'valid' : 'error',
            score: data.quality_score || 0,
            issues: Array.isArray(data.issues) ? data.issues : [],
            suggestions: Array.isArray(data.suggestions) ? data.suggestions : []
          }
        }

        return { platform, content }
      } catch (error) {
        return { 
          platform, 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        }
      }
    })

    // Execute all requests in parallel
    const results = await Promise.allSettled(generationPromises)

    // Update state with results
    setGeneratedContent(prev => {
      const newState = { ...prev }
      
      results.forEach((result, index) => {
        const platform = platforms[index]
        
        if (result.status === 'fulfilled') {
          if ('content' in result.value) {
            newState[platform] = {
              loading: false,
              content: result.value.content
            }
          } else {
            newState[platform] = {
              loading: false,
              error: result.value.error
            }
          }
        } else {
          newState[platform] = {
            loading: false,
            error: 'Request failed unexpectedly'
          }
        }
      })
      
      return newState
    })
  }, [])

  const clearContent = useCallback(() => {
    setGeneratedContent({})
  }, [])

  return {
    generatedContent,
    generateContent,
    isGenerating,
    clearContent
  }
}

export default useContentGeneration 