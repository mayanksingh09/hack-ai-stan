import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { InstagramPreview } from '../InstagramPreview'

describe('InstagramPreview', () => {
  const defaultProps = {
    title: 'Beautiful sunset today',
    caption: 'Check out this amazing sunset from my balcony',
    tags: ['sunset', 'photography', 'nature'],
    username: 'testuser',
    profile_name: 'Test User'
  }

  it('should render with basic props', () => {
    render(<InstagramPreview {...defaultProps} />)
    
    expect(screen.getAllByText('testuser')).toHaveLength(2) // Header and caption
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText(/Check out this amazing sunset from my balcony/)).toBeInTheDocument()
    expect(screen.getByText(/sunset/)).toBeInTheDocument()
    expect(screen.getByText(/photography/)).toBeInTheDocument()
    expect(screen.getByText(/nature/)).toBeInTheDocument()
  })

  it('should use title as caption when caption is not provided', () => {
    render(<InstagramPreview title="My awesome title" tags={['test']} />)
    
    expect(screen.getByText(/My awesome title/)).toBeInTheDocument()
  })

  it('should use default username when not provided', () => {
    render(<InstagramPreview title="Test" tags={[]} />)
    
    expect(screen.getAllByText('your_username')).toHaveLength(2) // Header and caption
    expect(screen.getByText('Your Profile')).toBeInTheDocument()
  })

  it('should integrate hashtags into caption', () => {
    render(<InstagramPreview title="Test post" tags={['tag1', 'tag2']} />)
    
    expect(screen.getByText(/Test post #tag1 #tag2/)).toBeInTheDocument()
  })

  it('should truncate caption when exceeding preview limit', () => {
    const longCaption = 'A'.repeat(200) // Exceeds 125 preview limit
    render(<InstagramPreview title="Test" caption={longCaption} tags={[]} />)
    
    expect(screen.getByText('more')).toBeInTheDocument()
    
    // Should show truncated version initially
    const captionElements = screen.getAllByText(/A+/)
    const truncatedCaption = captionElements.find(el => el.textContent?.includes('...'))
    expect(truncatedCaption).toBeInTheDocument()
  })

  it('should toggle caption visibility when "more/less" is clicked', () => {
    const longCaption = 'A'.repeat(200)
    render(<InstagramPreview title="Test" caption={longCaption} tags={[]} />)
    
    const moreButton = screen.getByText('more')
    fireEvent.click(moreButton)
    
    expect(screen.getByText('less')).toBeInTheDocument()
    
    const lessButton = screen.getByText('less')
    fireEvent.click(lessButton)
    
    expect(screen.getByText('more')).toBeInTheDocument()
  })

  it('should display character count for caption', () => {
    const caption = 'Test caption'
    const tags = ['tag1', 'tag2']
    const expectedLength = `${caption} #tag1 #tag2`.length
    
    render(<InstagramPreview title="Test" caption={caption} tags={tags} />)
    
    expect(screen.getByText(`Caption: ${expectedLength}/2200`)).toBeInTheDocument()
  })

  it('should apply correct color classes for caption character count', () => {
    // Test green status (≤500 chars)
    const shortCaption = 'A'.repeat(100)
    const { rerender } = render(<InstagramPreview title="Test" caption={shortCaption} tags={[]} />)
    
    expect(screen.getByText(`Caption: 100/2200`)).toHaveClass('text-green-600')
    
    // Test yellow status (501-1500 chars)
    const mediumCaption = 'A'.repeat(800)
    rerender(<InstagramPreview title="Test" caption={mediumCaption} tags={[]} />)
    
    expect(screen.getByText(`Caption: 800/2200`)).toHaveClass('text-yellow-600')
    
    // Test red status (>1500 chars)
    const longCaption = 'A'.repeat(1800)
    rerender(<InstagramPreview title="Test" caption={longCaption} tags={[]} />)
    
    expect(screen.getByText(`Caption: 1800/2200`)).toHaveClass('text-red-600')
  })

  it('should show profile picture placeholder with user initial', () => {
    render(<InstagramPreview title="Test" tags={[]} username="john_doe" />)
    
    expect(screen.getAllByText('J')).toHaveLength(2) // First letter appears in both profile pictures
  })

  it('should display Instagram UI elements', () => {
    render(<InstagramPreview title="Test" tags={[]} />)
    
    // Should show likes count
    expect(screen.getByText('2,847 likes')).toBeInTheDocument()
    
    // Should show comments preview
    expect(screen.getByText('View all 24 comments')).toBeInTheDocument()
    expect(screen.getByText('friend_username')).toBeInTheDocument()
    expect(screen.getByText('Amazing post! 🔥')).toBeInTheDocument()
    
    // Should show timestamp
    expect(screen.getByText('2 HOURS AGO')).toBeInTheDocument()
    
    // Should show comment input
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
    expect(screen.getByText('Post')).toBeInTheDocument()
  })

  it('should display image placeholder with camera emoji', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    // Should have square aspect ratio
    const imageContainer = container.querySelector('.aspect-square')
    expect(imageContainer).toBeInTheDocument()
    
    // Should show camera emoji
    expect(screen.getByText('📷')).toBeInTheDocument()
    
    // Should show image count
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('should show action buttons', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    // Should have heart, comment, share, and bookmark buttons
    // We can't easily test Font Awesome icons, so we'll check for their containers
    const actionBar = container.querySelector('.flex.items-center.justify-between')
    expect(actionBar).toBeInTheDocument()
  })

  it('should display Instagram branding', () => {
    render(<InstagramPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Instagram')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<InstagramPreview title="Test caption" tags={[]} />)
    
    expect(screen.getByText(/Test caption/)).toBeInTheDocument()
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should handle empty caption and title', () => {
    render(<InstagramPreview title="" tags={['test']} />)
    
    expect(screen.getByText(/#test/)).toBeInTheDocument()
  })

  it('should not show more/less button for short captions', () => {
    render(<InstagramPreview title="Short caption" tags={[]} />)
    
    expect(screen.queryByText('more')).not.toBeInTheDocument()
    expect(screen.queryByText('less')).not.toBeInTheDocument()
  })

  it('should have responsive styling classes', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('should support dark mode classes', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    // Check for dark mode classes
    expect(container.querySelector('.dark\\:bg-gray-900')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument()
  })

  it('should show gradient styling for Instagram branding', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    const brandingElement = container.querySelector('.bg-gradient-to-r')
    expect(brandingElement).toBeInTheDocument()
    expect(brandingElement).toHaveClass('from-purple-500', 'via-pink-500', 'to-orange-400')
  })

  it('should show gradient profile picture borders', () => {
    const { container } = render(<InstagramPreview title="Test" tags={[]} />)
    
    const profilePictures = container.querySelectorAll('.bg-gradient-to-br')
    expect(profilePictures.length).toBeGreaterThan(0)
  })

  it('should handle very long usernames', () => {
    const longUsername = 'very_long_username_that_might_overflow'
    render(<InstagramPreview title="Test" tags={[]} username={longUsername} />)
    
    expect(screen.getAllByText(longUsername)).toHaveLength(2) // Header and caption
    expect(screen.getAllByText('V')).toHaveLength(2) // First letter in both profile pictures
  })
}) 