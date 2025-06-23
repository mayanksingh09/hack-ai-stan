import { renderHook, act } from '@testing-library/react'
import { useContentGeneration } from '../useContentGeneration'

// Mock fetch
global.fetch = jest.fn()

describe('useContentGeneration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup environment variable
    process.env.NEXT_PUBLIC_FASTAPI_URL = 'http://localhost:8000'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useContentGeneration())

    expect(result.current.generatedContent).toEqual({})
    expect(result.current.isGenerating).toBe(false)
  })

  it('should handle successful content generation with all fields', async () => {
    const mockApiResponse = {
      content: {
        title: 'Test Title',
        tags: ['tag1', 'tag2'],
        description: 'YouTube description',
        caption: 'Instagram caption',
        post_body: 'LinkedIn post body',
        headline: 'LinkedIn headline',
        bio: 'User bio',
        username: 'testuser',
        profile_name: 'Test User',
        about_section: 'About section content',
        connection_message: 'Connection message',
        stream_category: 'Gaming'
      },
      validation_passed: true,
      quality_score: 85,
      issues: [],
      suggestions: ['Great content!']
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content).toEqual({
      platform: 'youtube',
      title: 'Test Title',
      tags: ['tag1', 'tag2'],
      description: 'YouTube description',
      caption: 'Instagram caption',
      post_body: 'LinkedIn post body',
      headline: 'LinkedIn headline',
      bio: 'User bio',
      username: 'testuser',
      profile_name: 'Test User',
      about_section: 'About section content',
      connection_message: 'Connection message',
      stream_category: 'Gaming',
      validation: {
        status: 'valid',
        score: 85,
        issues: [],
        suggestions: ['Great content!']
      }
    })
  })

  it('should handle API response with minimal fields', async () => {
    const mockApiResponse = {
      content: {
        title: 'Minimal Title',
        tags: 'tag1 tag2 tag3'
      },
      validation_passed: false,
      quality_score: 60,
      issues: [{ field: 'title', message: 'Too short' }]
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['instagram'], 'Test transcript')
    })

    expect(result.current.generatedContent.instagram.content).toEqual({
      platform: 'instagram',
      title: 'Minimal Title',
      tags: ['tag1', 'tag2', 'tag3'],
      description: undefined,
      caption: undefined,
      post_body: undefined,
      headline: undefined,
      bio: undefined,
      username: undefined,
      profile_name: undefined,
      about_section: undefined,
      connection_message: undefined,
      stream_category: undefined,
      validation: {
        status: 'error',
        score: 60,
        issues: [{ field: 'title', message: 'Too short' }],
        suggestions: []
      }
    })
  })

  it('should handle multiple platforms simultaneously', async () => {
    const mockYouTubeResponse = {
      content: {
        title: 'YouTube Title',
        tags: ['youtube', 'video'],
        description: 'YouTube description'
      },
      validation_passed: true,
      quality_score: 90
    }

    const mockInstagramResponse = {
      content: {
        title: 'Instagram Title',
        tags: ['instagram', 'photo'],
        caption: 'Instagram caption'
      },
      validation_passed: true,
      quality_score: 85
    }

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockYouTubeResponse
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockInstagramResponse
      })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube', 'instagram'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content?.title).toBe('YouTube Title')
    expect(result.current.generatedContent.youtube.content?.description).toBe('YouTube description')
    expect(result.current.generatedContent.instagram.content?.title).toBe('Instagram Title')
    expect(result.current.generatedContent.instagram.content?.caption).toBe('Instagram caption')
  })

  it('should handle tags as array', async () => {
    const mockApiResponse = {
      content: {
        title: 'Test Title',
        tags: ['tag1', 'tag2', 'tag3']
      },
      validation_passed: true
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content?.tags).toEqual(['tag1', 'tag2', 'tag3'])
  })

  it('should handle tags as string', async () => {
    const mockApiResponse = {
      content: {
        title: 'Test Title',
        tags: 'tag1 tag2 tag3'
      },
      validation_passed: true
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content?.tags).toEqual(['tag1', 'tag2', 'tag3'])
  })

  it('should handle empty or invalid tags', async () => {
    const mockApiResponse = {
      content: {
        title: 'Test Title',
        tags: null
      },
      validation_passed: true
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content?.tags).toEqual([])
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.error).toBe('Network error')
    expect(result.current.generatedContent.youtube.loading).toBe(false)
  })

  it('should handle HTTP errors', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.error).toBe('Failed to generate content for youtube: Internal Server Error')
    expect(result.current.generatedContent.youtube.loading).toBe(false)
  })

  it('should set loading states correctly', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ content: { title: 'Test', tags: [] }, validation_passed: true })
      }), 100))
    )

    const { result } = renderHook(() => useContentGeneration())

    act(() => {
      result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.loading).toBe(true)
    expect(result.current.isGenerating).toBe(true)
  })

  it('should clear content', () => {
    const { result } = renderHook(() => useContentGeneration())

    // Set some content first
    act(() => {
      result.current.generateContent(['youtube'], 'Test transcript')
    })

    act(() => {
      result.current.clearContent()
    })

    expect(result.current.generatedContent).toEqual({})
    expect(result.current.isGenerating).toBe(false)
  })

  it('should not generate content for empty transcript', async () => {
    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], '')
    })

    expect(result.current.generatedContent).toEqual({})
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle missing content object in API response', async () => {
    const mockApiResponse = {
      validation_passed: true,
      quality_score: 50
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const { result } = renderHook(() => useContentGeneration())

    await act(async () => {
      await result.current.generateContent(['youtube'], 'Test transcript')
    })

    expect(result.current.generatedContent.youtube.content?.title).toBe('')
    expect(result.current.generatedContent.youtube.content?.tags).toEqual([])
  })
}) 