import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VideoUploader } from '../VideoUploader'

// Mock functions
const mockUpload = jest.fn()
const mockGetPublicUrl = jest.fn()

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl
      }))
    }
  }
}))

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123')
}))

describe('VideoUploader', () => {
  const mockOnFileSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the upload area', () => {
    render(<VideoUploader />)
    
    expect(screen.getByText('Video Upload')).toBeInTheDocument()
    expect(screen.getByText('Drop a video here or click to select')).toBeInTheDocument()
  })

  it('should validate file type', () => {
    render(<VideoUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText('Upload video file')
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })
    
    expect(screen.getByText(/Please select a valid video file/)).toBeInTheDocument()
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('should validate file size', () => {
    render(<VideoUploader onFileSelect={mockOnFileSelect} maxSizeInMB={1} />)
    
    const fileInput = screen.getByLabelText('Upload video file')
    // Create a large file (2MB when limit is 1MB)
    const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' })
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } })
    
    expect(screen.getByText(/File size must be less than 1MB/)).toBeInTheDocument()
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('should handle successful upload', async () => {
    // Mock successful upload
    mockUpload.mockResolvedValue({ 
      data: { path: 'videos/mock-uuid-123.mp4' }, 
      error: null 
    })
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/video.mp4' }
    })
    
    render(<VideoUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText('Upload video file')
    const validFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' })
    
    fireEvent.change(fileInput, { target: { files: [validFile] } })
    
    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText('✓ Upload completed successfully')).toBeInTheDocument()
    })
    
    expect(mockUpload).toHaveBeenCalledWith(
      'videos/mock-uuid-123.mp4',
      validFile,
      {
        cacheControl: '3600',
        upsert: false
      }
    )
    expect(mockGetPublicUrl).toHaveBeenCalledWith('videos/mock-uuid-123.mp4')
    expect(mockOnFileSelect).toHaveBeenCalledWith(validFile, 'https://example.com/video.mp4')
  })

  it('should handle upload error', async () => {
    // Mock upload error
    mockUpload.mockResolvedValue({ 
      data: null, 
      error: new Error('Upload failed') 
    })
    
    render(<VideoUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText('Upload video file')
    const validFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' })
    
    fireEvent.change(fileInput, { target: { files: [validFile] } })
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
    
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('should allow removing selected file', async () => {
    render(<VideoUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText('Upload video file')
    const validFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' })
    
    fireEvent.change(fileInput, { target: { files: [validFile] } })
    
    // File should be selected
    expect(screen.getByText('test.mp4')).toBeInTheDocument()
    
    // Click remove button
    const removeButton = screen.getByLabelText('Remove video')
    fireEvent.click(removeButton)
    
    // Should go back to upload area
    expect(screen.getByText('Drop a video here or click to select')).toBeInTheDocument()
    expect(mockOnFileSelect).toHaveBeenLastCalledWith(null, undefined)
  })
}) 