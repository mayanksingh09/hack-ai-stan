import React from 'react'
import { render, screen } from '@testing-library/react'
import { TwitchPreview } from '../TwitchPreview'

describe('TwitchPreview', () => {
  const defaultProps = {
    title: 'Epic Gaming Stream - Road to Champion!',
    bio: 'Professional gamer streaming daily. Join the community!',
    stream_category: 'League of Legends',
    tags: ['gaming', 'competitive', 'educational', 'fun'],
    username: 'progamer123'
  }

  it('should render with basic props', () => {
    render(<TwitchPreview {...defaultProps} />)
    
    expect(screen.getByText('progamer123')).toBeInTheDocument()
    expect(screen.getByText('Epic Gaming Stream - Road to Champion!')).toBeInTheDocument()
    expect(screen.getByText('Professional gamer streaming daily. Join the community!')).toBeInTheDocument()
    expect(screen.getByText('League of Legends')).toBeInTheDocument()
    expect(screen.getByText('gaming')).toBeInTheDocument()
    expect(screen.getByText('competitive')).toBeInTheDocument()
    expect(screen.getByText('educational')).toBeInTheDocument()
    expect(screen.getByText('fun')).toBeInTheDocument()
  })

  it('should use default values when optional props are not provided', () => {
    render(<TwitchPreview title="Test Stream" tags={[]} />)
    
    expect(screen.getByText('your_username')).toBeInTheDocument()
    expect(screen.getByText('Just Chatting')).toBeInTheDocument()
  })

  it('should display stream category with gaming focus', () => {
    render(<TwitchPreview title="Test" tags={[]} stream_category="Minecraft" />)
    
    expect(screen.getByText('Playing')).toBeInTheDocument()
    expect(screen.getByText('Minecraft')).toBeInTheDocument()
  })

  it('should display channel bio when provided', () => {
    render(<TwitchPreview title="Test" tags={[]} bio="Welcome to my channel!" />)
    
    expect(screen.getByText('Welcome to my channel!')).toBeInTheDocument()
  })

  it('should not display bio section when bio is not provided', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    // Bio section should not exist
    expect(screen.queryByText(/Welcome to/)).not.toBeInTheDocument()
  })

  it('should display stream title with character count', () => {
    const title = 'Epic stream title'
    render(<TwitchPreview title={title} tags={[]} />)
    
    expect(screen.getByText(`${title.length}/140`)).toBeInTheDocument()
  })

  it('should apply correct color classes for title character count', () => {
    // Test green status (≤60 chars)
    const shortTitle = 'A'.repeat(50)
    const { rerender } = render(<TwitchPreview title={shortTitle} tags={[]} />)
    
    expect(screen.getByText(`50/140`)).toHaveClass('text-green-400')
    expect(screen.getByText('Great title length for discovery')).toBeInTheDocument()
    
    // Test yellow status (61-100 chars)
    const mediumTitle = 'A'.repeat(80)
    rerender(<TwitchPreview title={mediumTitle} tags={[]} />)
    
    expect(screen.getByText(`80/140`)).toHaveClass('text-yellow-400')
    expect(screen.getByText('Good title length')).toBeInTheDocument()
    
    // Test orange status (101-140 chars)
    const longTitle = 'A'.repeat(120)
    rerender(<TwitchPreview title={longTitle} tags={[]} />)
    
    expect(screen.getByText(`120/140`)).toHaveClass('text-orange-400')
    expect(screen.getByText('Title is getting long')).toBeInTheDocument()
    
    // Test red status (>140 chars)
    const veryLongTitle = 'A'.repeat(150)
    rerender(<TwitchPreview title={veryLongTitle} tags={[]} />)
    
    expect(screen.getByText(`150/140`)).toHaveClass('text-red-400')
    expect(screen.getByText('Title exceeds recommended length')).toBeInTheDocument()
  })

  it('should truncate title when it exceeds limit', () => {
    const longTitle = 'A'.repeat(150)
    render(<TwitchPreview title={longTitle} tags={[]} />)
    
    const expectedTruncated = 'A'.repeat(140) + '...'
    expect(screen.getByText(expectedTruncated)).toBeInTheDocument()
  })

  it('should show title analysis section', () => {
    render(<TwitchPreview title="Test title" tags={[]} />)
    
    expect(screen.getByText('Title Analysis')).toBeInTheDocument()
  })

  it('should show progress bar with correct color for title length', () => {
    const { container, rerender } = render(<TwitchPreview title="Short" tags={[]} />)
    
    // Should show green for optimal length
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
    
    // Test yellow for medium length
    const mediumTitle = 'A'.repeat(80)
    rerender(<TwitchPreview title={mediumTitle} tags={[]} />)
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument()
    
    // Test orange for long length
    const longTitle = 'A'.repeat(120)
    rerender(<TwitchPreview title={longTitle} tags={[]} />)
    expect(container.querySelector('.bg-orange-500')).toBeInTheDocument()
    
    // Test red for very long length
    const veryLongTitle = 'A'.repeat(150)
    rerender(<TwitchPreview title={veryLongTitle} tags={[]} />)
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('should show profile picture with username initial', () => {
    render(<TwitchPreview title="Test" tags={[]} username="streamer" />)
    
    expect(screen.getByText('S')).toBeInTheDocument() // First letter of username
  })

  it('should display Twitch UI elements', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should show stream stats
    expect(screen.getByText('LIVE')).toBeInTheDocument()
    expect(screen.getByText('12.5K')).toBeInTheDocument() // Viewers
    expect(screen.getByText('1080p60')).toBeInTheDocument() // Quality
    expect(screen.getByText('2:34:15')).toBeInTheDocument() // Duration
    expect(screen.getByText('2.4K followers')).toBeInTheDocument()
    expect(screen.getByText('3.2K')).toBeInTheDocument() // Hearts
    expect(screen.getByText('890 chatting')).toBeInTheDocument()
    
    // Should show action buttons
    expect(screen.getByText('Follow')).toBeInTheDocument()
    expect(screen.getByText('Subscribe')).toBeInTheDocument()
    expect(screen.getByText('Donate')).toBeInTheDocument()
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('should display partner badge', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Partner')).toBeInTheDocument()
  })

  it('should display gaming emoji in background', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('🎮')).toBeInTheDocument()
  })

  it('should display Twitch branding', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Twitch')).toBeInTheDocument()
  })

  it('should display tags up to limit', () => {
    const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    render(<TwitchPreview title="Test" tags={tags} />)
    
    // Should show all 5 tags
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('should limit tag display to 5 and show overflow', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7']
    render(<TwitchPreview title="Test" tags={manyTags} />)
    
    // Should show first 5 tags
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.getByText('tag4')).toBeInTheDocument()
    expect(screen.getByText('tag5')).toBeInTheDocument()
    
    // Should not show 6th and 7th tags
    expect(screen.queryByText('tag6')).not.toBeInTheDocument()
    expect(screen.queryByText('tag7')).not.toBeInTheDocument()
    
    // Should show overflow count
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<TwitchPreview title="Test stream" tags={[]} />)
    
    // Tags section should not be visible
    expect(screen.queryByText('tag')).not.toBeInTheDocument()
  })

  it('should have purple theme styling', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have purple theme elements
    expect(container.querySelector('.bg-purple-600')).toBeInTheDocument()
    expect(container.querySelector('.text-purple-400')).toBeInTheDocument()
  })

  it('should have gaming-focused design elements', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have video aspect ratio for stream preview
    expect(container.querySelector('.aspect-video')).toBeInTheDocument()
    
    // Should have gradients for gaming aesthetic
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
  })

  it('should have responsive design', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('shadow-2xl')
  })

  it('should show animated live indicator', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have pulsing animation for live indicator
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should have hover effects on buttons', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have hover effects
    expect(container.querySelector('.hover\\:bg-purple-500')).toBeInTheDocument()
    expect(container.querySelector('.hover\\:bg-gray-600')).toBeInTheDocument()
    expect(container.querySelector('.hover\\:text-white')).toBeInTheDocument()
  })

  it('should display stream quality and duration', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('1080p60')).toBeInTheDocument()
    expect(screen.getByText('2:34:15')).toBeInTheDocument()
  })

  it('should handle very long usernames', () => {
    const longUsername = 'very_long_twitch_username_here'
    render(<TwitchPreview title="Test" tags={[]} username={longUsername} />)
    
    expect(screen.getByText(longUsername)).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument() // First letter
  })

  it('should show play button for stream preview', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have play button in center
    expect(container.querySelector('.w-16.h-16')).toBeInTheDocument()
  })

  it('should have dark theme with gray background', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('bg-gray-900')
    expect(container.firstChild).toHaveClass('text-white')
  })

  it('should show stream statistics', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should show various stream stats
    expect(screen.getByText('12.5K')).toBeInTheDocument() // Current viewers
    expect(screen.getByText('2.4K followers')).toBeInTheDocument() // Followers
    expect(screen.getByText('3.2K')).toBeInTheDocument() // Hearts/likes
    expect(screen.getByText('890 chatting')).toBeInTheDocument() // Chat participants
  })

  it('should handle exactly title limit length', () => {
    const exactLimitTitle = 'A'.repeat(140) // Exactly at limit
    render(<TwitchPreview title={exactLimitTitle} tags={[]} />)
    
    expect(screen.getByText('Title is getting long')).toBeInTheDocument()
    expect(screen.getByText('140/140')).toHaveClass('text-orange-400')
  })

  it('should show channel info and partner status', () => {
    render(<TwitchPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Partner')).toBeInTheDocument()
    expect(screen.getByText('2.4K followers')).toBeInTheDocument()
  })

  it('should have purple gradient profile picture', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have purple to pink gradient
    expect(container.querySelector('.from-purple-500')).toBeInTheDocument()
    expect(container.querySelector('.to-pink-500')).toBeInTheDocument()
  })

  it('should display stream background with overlay', () => {
    const { container } = render(<TwitchPreview title="Test" tags={[]} />)
    
    // Should have multiple gradient overlays
    expect(container.querySelector('.from-purple-900')).toBeInTheDocument()
    expect(container.querySelector('.from-black\\/60')).toBeInTheDocument()
  })

  it('should show gaming category prominently', () => {
    render(<TwitchPreview title="Test" tags={[]} stream_category="Valorant" />)
    
    expect(screen.getByText('Playing')).toBeInTheDocument()
    expect(screen.getByText('Valorant')).toBeInTheDocument()
  })

  it('should handle title exactly at different thresholds', () => {
    // Test exactly at 60 chars
    const sixtyChars = 'A'.repeat(60)
    const { rerender } = render(<TwitchPreview title={sixtyChars} tags={[]} />)
    expect(screen.getByText('Great title length for discovery')).toBeInTheDocument()
    
    // Test exactly at 100 chars
    const hundredChars = 'A'.repeat(100)
    rerender(<TwitchPreview title={hundredChars} tags={[]} />)
    expect(screen.getByText('Good title length')).toBeInTheDocument()
  })
}) 