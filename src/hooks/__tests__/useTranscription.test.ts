import { renderHook, waitFor } from '@testing-library/react'
import { useTranscription } from '../useTranscription'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('useTranscription', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTranscription())

    expect(result.current.transcript).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.retry).toBe('function')
  })

  it('should not make API call when no videoUrl is provided', () => {
    renderHook(() => useTranscription())

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should make API call when videoUrl is provided', async () => {
    const mockResponse = {
      transcript: 'This is a test transcript'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const { result } = renderHook(() => useTranscription('https://example.com/video.mp4'))

    // Should start loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    // Wait for API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/v1/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: 'https://example.com/video.mp4' }),
    })

    expect(result.current.transcript).toBe('This is a test transcript')
    expect(result.current.error).toBeNull()
  })

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    })

    const { result } = renderHook(() => useTranscription('https://example.com/video.mp4'))

    // Wait for API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transcript).toBeNull()
    expect(result.current.error).toBe('Transcription failed: Internal Server Error')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useTranscription('https://example.com/video.mp4'))

    // Wait for API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transcript).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('should handle unknown errors', async () => {
    mockFetch.mockRejectedValueOnce('Unknown error')

    const { result } = renderHook(() => useTranscription('https://example.com/video.mp4'))

    // Wait for API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transcript).toBeNull()
    expect(result.current.error).toBe('Failed to transcribe video')
  })

  it('should retry transcription when retry is called', async () => {
    const mockResponse = {
      transcript: 'Retry transcript'
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const { result } = renderHook(() => useTranscription('https://example.com/video.mp4'))

    // Wait for initial call
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear the mock to track retry call
    mockFetch.mockClear()

    // Call retry
    result.current.retry()

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.transcript).toBe('Retry transcript')
  })

  it('should not retry when no videoUrl is available', () => {
    const { result } = renderHook(() => useTranscription())

    result.current.retry()

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should make new API call when videoUrl changes', async () => {
    const mockResponse1 = { transcript: 'First transcript' }
    const mockResponse2 = { transcript: 'Second transcript' }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse1)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse2)
      })

    const { result, rerender } = renderHook(
      ({ url }) => useTranscription(url),
      { initialProps: { url: 'https://example.com/video1.mp4' } }
    )

    // Wait for first call
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transcript).toBe('First transcript')

    // Change URL
    rerender({ url: 'https://example.com/video2.mp4' })

    // Wait for second call
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.current.transcript).toBe('Second transcript')
  })
}) 