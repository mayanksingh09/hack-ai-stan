import { renderHook, act } from '@testing-library/react'
import { useVideoThumbnail } from '../useVideoThumbnail'
import { extractVideoFirstFrame, blobToFile } from '@/lib/utils'

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  extractVideoFirstFrame: jest.fn(),
  blobToFile: jest.fn()
}))

const mockExtractVideoFirstFrame = extractVideoFirstFrame as jest.MockedFunction<typeof extractVideoFirstFrame>
const mockBlobToFile = blobToFile as jest.MockedFunction<typeof blobToFile>

describe('useVideoThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useVideoThumbnail())
    
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.generateThumbnail).toBe('function')
    expect(typeof result.current.clearError).toBe('function')
  })

  it('should generate thumbnail successfully', async () => {
    const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' })
    const mockFile = new File(['mock video data'], 'test.mp4', { type: 'video/mp4' })
    const mockThumbnailFile = new File(['mock thumbnail data'], 'test_thumbnail.jpg', { type: 'image/jpeg' })
    
    mockExtractVideoFirstFrame.mockResolvedValue(mockBlob)
    mockBlobToFile.mockReturnValue(mockThumbnailFile)
    
    const { result } = renderHook(() => useVideoThumbnail())
    
    let thumbnailResult: File | null = null
    
    await act(async () => {
      thumbnailResult = await result.current.generateThumbnail(mockFile)
    })
    
    expect(mockExtractVideoFirstFrame).toHaveBeenCalledWith(mockFile, 0.9)
    expect(mockBlobToFile).toHaveBeenCalledWith(mockBlob, 'test_thumbnail.jpg', 'image/jpeg')
    expect(thumbnailResult).toBe(mockThumbnailFile)
    expect(result.current.error).toBe(null)
    expect(result.current.isGenerating).toBe(false)
  })

  it('should handle errors during thumbnail generation', async () => {
    const mockFile = new File(['mock video data'], 'test.mp4', { type: 'video/mp4' })
    const mockError = new Error('Failed to extract frame')
    
    mockExtractVideoFirstFrame.mockRejectedValue(mockError)
    
    const { result } = renderHook(() => useVideoThumbnail())
    
    let thumbnailResult: File | null = null
    
    await act(async () => {
      thumbnailResult = await result.current.generateThumbnail(mockFile)
    })
    
    expect(thumbnailResult).toBe(null)
    expect(result.current.error).toBe('Failed to extract frame')
    expect(result.current.isGenerating).toBe(false)
  })

  it('should handle missing video file', async () => {
    const { result } = renderHook(() => useVideoThumbnail())
    
    let thumbnailResult: File | null = null
    
    await act(async () => {
      thumbnailResult = await result.current.generateThumbnail(null as any)
    })
    
    expect(thumbnailResult).toBe(null)
    expect(result.current.error).toBe('No video file provided')
    expect(mockExtractVideoFirstFrame).not.toHaveBeenCalled()
  })

  it('should clear error correctly', () => {
    const { result } = renderHook(() => useVideoThumbnail())
    
    // Simulate an error state
    act(() => {
      result.current.generateThumbnail(null as any)
    })
    
    expect(result.current.error).toBeTruthy()
    
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBe(null)
  })

  it('should set isGenerating state correctly during generation', async () => {
    const mockFile = new File(['mock video data'], 'test.mp4', { type: 'video/mp4' })
    const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' })
    const mockThumbnailFile = new File(['mock thumbnail data'], 'test_thumbnail.jpg', { type: 'image/jpeg' })
    
    // Mock with a delay to test the loading state
    mockExtractVideoFirstFrame.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockBlob), 100))
    )
    mockBlobToFile.mockReturnValue(mockThumbnailFile)
    
    const { result } = renderHook(() => useVideoThumbnail())
    
    expect(result.current.isGenerating).toBe(false)
    
    // Start the generation process
    const generatePromise = result.current.generateThumbnail(mockFile)
    
    // Wait for the state to update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    
    // Should be generating during the async operation
    expect(result.current.isGenerating).toBe(true)
    
    await act(async () => {
      await generatePromise
    })
    
    // Should be done generating after completion
    expect(result.current.isGenerating).toBe(false)
  })
}) 