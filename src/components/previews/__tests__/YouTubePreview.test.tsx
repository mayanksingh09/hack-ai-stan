import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { YouTubePreview } from '../YouTubePreview'

describe('YouTubePreview', () => {
  const defaultProps = {
    title: 'Test YouTube Video Title',
    description: 'This is a test description for the YouTube video',
    tags: ['tag1', 'tag2', 'tag3']
  }

  it('should render with basic props', () => {
    render(<YouTubePreview {...defaultProps} />)
    
    expect(screen.getByText('Test YouTube Video Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test description for the YouTube video')).toBeInTheDocument()
    expect(screen.getByText('#tag1')).toBeInTheDocument()
    expect(screen.getByText('#tag2')).toBeInTheDocument()
    expect(screen.getByText('#tag3')).toBeInTheDocument()
  })

  it('should render without description', () => {
    render(<YouTubePreview title="Test Title" tags={['tag1']} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('#tag1')).toBeInTheDocument()
    expect(screen.queryByText('Show more')).not.toBeInTheDocument()
  })

  it('should render without tags', () => {
    render(<YouTubePreview title="Test Title" tags={[]} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should truncate title when exceeding limit', () => {
    const longTitle = 'A'.repeat(120) // Exceeds 100 character limit
    render(<YouTubePreview title={longTitle} tags={[]} />)
    
    const displayedTitle = screen.getByRole('heading', { level: 3 })
    expect(displayedTitle.textContent).toHaveLength(100) // 97 chars + '...'
    expect(displayedTitle.textContent).toMatch(/\.\.\.$/) // Ends with ...
  })

  it('should show description with "Show more" when exceeding preview limit', () => {
    const longDescription = 'A'.repeat(200) // Exceeds 157 preview limit
    render(<YouTubePreview title="Test" description={longDescription} tags={[]} />)
    
    expect(screen.getByText('Show more')).toBeInTheDocument()
    
    // Should show truncated version initially
    const descriptionText = screen.getByText(/A+/)
    expect(descriptionText.textContent?.length).toBeLessThan(200)
  })

  it('should toggle description visibility when "Show more/less" is clicked', () => {
    const longDescription = 'A'.repeat(200)
    render(<YouTubePreview title="Test" description={longDescription} tags={[]} />)
    
    const showMoreButton = screen.getByText('Show more')
    fireEvent.click(showMoreButton)
    
    expect(screen.getByText('Show less')).toBeInTheDocument()
    
    const showLessButton = screen.getByText('Show less')
    fireEvent.click(showLessButton)
    
    expect(screen.getByText('Show more')).toBeInTheDocument()
  })

  it('should display character count for title', () => {
    const title = 'Test Title'
    render(<YouTubePreview title={title} tags={[]} />)
    
    expect(screen.getByText(`Title: ${title.length}/100`)).toBeInTheDocument()
  })

  it('should display character count for description', () => {
    const description = 'Test Description'
    render(<YouTubePreview title="Test" description={description} tags={[]} />)
    
    expect(screen.getByText(`Description: ${description.length}/5000`)).toBeInTheDocument()
  })

  it('should apply correct color classes for title character count', () => {
    // Test green status (≤60 chars)
    const shortTitle = 'A'.repeat(50)
    const { rerender } = render(<YouTubePreview title={shortTitle} tags={[]} />)
    
    expect(screen.getByText(`Title: 50/100`)).toHaveClass('text-green-600')
    
    // Test yellow status (61-80 chars)
    const mediumTitle = 'A'.repeat(70)
    rerender(<YouTubePreview title={mediumTitle} tags={[]} />)
    
    expect(screen.getByText(`Title: 70/100`)).toHaveClass('text-yellow-600')
    
    // Test red status (>80 chars)
    const longTitle = 'A'.repeat(90)
    rerender(<YouTubePreview title={longTitle} tags={[]} />)
    
    expect(screen.getByText(`Title: 90/100`)).toHaveClass('text-red-600')
  })

  it('should apply correct color classes for description character count', () => {
    // Test green status (≤1000 chars)
    const shortDescription = 'A'.repeat(500)
    const { rerender } = render(<YouTubePreview title="Test" description={shortDescription} tags={[]} />)
    
    expect(screen.getByText(`Description: 500/5000`)).toHaveClass('text-green-600')
    
    // Test yellow status (1001-3000 chars)
    const mediumDescription = 'A'.repeat(2000)
    rerender(<YouTubePreview title="Test" description={mediumDescription} tags={[]} />)
    
    expect(screen.getByText(`Description: 2000/5000`)).toHaveClass('text-yellow-600')
    
    // Test red status (>3000 chars)
    const longDescription = 'A'.repeat(4000)
    rerender(<YouTubePreview title="Test" description={longDescription} tags={[]} />)
    
    expect(screen.getByText(`Description: 4000/5000`)).toHaveClass('text-red-600')
  })

  it('should limit tags display to 5 and show overflow count', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7']
    render(<YouTubePreview title="Test" tags={manyTags} />)
    
    // Should show first 5 tags
    expect(screen.getByText('#tag1')).toBeInTheDocument()
    expect(screen.getByText('#tag2')).toBeInTheDocument()
    expect(screen.getByText('#tag3')).toBeInTheDocument()
    expect(screen.getByText('#tag4')).toBeInTheDocument()
    expect(screen.getByText('#tag5')).toBeInTheDocument()
    
    // Should not show 6th and 7th tags
    expect(screen.queryByText('#tag6')).not.toBeInTheDocument()
    expect(screen.queryByText('#tag7')).not.toBeInTheDocument()
    
    // Should show overflow count
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('should display YouTube branding', () => {
    render(<YouTubePreview title="Test" tags={[]} />)
    
    expect(screen.getByText('YouTube')).toBeInTheDocument()
  })

  it('should show video thumbnail placeholder with play button', () => {
    const { container } = render(<YouTubePreview title="Test" tags={[]} />)
    
    // Should have video aspect ratio container
    const videoContainer = container.querySelector('.aspect-video')
    expect(videoContainer).toBeInTheDocument()
    
    // Should show duration
    expect(screen.getByText('10:24')).toBeInTheDocument()
  })

  it('should show channel information', () => {
    render(<YouTubePreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Your Channel')).toBeInTheDocument()
    expect(screen.getByText('1.2K views')).toBeInTheDocument()
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('should show action buttons', () => {
    render(<YouTubePreview title="Test" tags={[]} />)
    
    expect(screen.getByText('142')).toBeInTheDocument() // Likes count
    expect(screen.getByText('Share')).toBeInTheDocument()
    expect(screen.getByText('1.2K')).toBeInTheDocument() // Views count
  })

  it('should apply custom className', () => {
    const { container } = render(<YouTubePreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty description gracefully', () => {
    render(<YouTubePreview title="Test" description="" tags={[]} />)
    
    expect(screen.queryByText('Show more')).not.toBeInTheDocument()
    expect(screen.queryByText('Description:')).not.toBeInTheDocument()
  })

  it('should have responsive styling classes', () => {
    const { container } = render(<YouTubePreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('should support dark mode classes', () => {
    const { container } = render(<YouTubePreview title="Test" tags={[]} />)
    
    // Check for dark mode classes
    expect(container.querySelector('.dark\\:bg-gray-900')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument()
  })
}) 