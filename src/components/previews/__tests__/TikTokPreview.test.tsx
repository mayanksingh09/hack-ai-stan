import React from 'react'
import { render, screen } from '@testing-library/react'
import { TikTokPreview } from '../TikTokPreview'

describe('TikTokPreview', () => {
  const defaultProps = {
    title: 'Check out this amazing dance move!',
    caption: 'New dance trend going viral',
    tags: ['dance', 'viral', 'trending', 'fyp'],
    username: 'dancequeen'
  }

  it('should render with basic props', () => {
    render(<TikTokPreview {...defaultProps} />)
    
    expect(screen.getByText('@dancequeen')).toBeInTheDocument()
    expect(screen.getByText(/New dance trend going viral/)).toBeInTheDocument()
    expect(screen.getAllByText(/#dance/)).toHaveLength(2) // Caption and pill
    expect(screen.getAllByText(/#viral/)).toHaveLength(2) // Caption and pill
    expect(screen.getAllByText(/#trending/)).toHaveLength(2) // Caption and pill
    expect(screen.getAllByText(/#fyp/)).toHaveLength(2) // Caption and pill
  })

  it('should use title as caption when caption is not provided', () => {
    render(<TikTokPreview title="Amazing content here" tags={['content']} />)
    
    expect(screen.getByText(/Amazing content here/)).toBeInTheDocument()
  })

  it('should use default username when not provided', () => {
    render(<TikTokPreview title="Test video" tags={[]} />)
    
    expect(screen.getByText('@your_username')).toBeInTheDocument()
  })

  it('should integrate hashtags into caption', () => {
    render(<TikTokPreview title="Great video" tags={['tag1', 'tag2']} />)
    
    expect(screen.getByText(/Great video #tag1 #tag2/)).toBeInTheDocument()
  })

  it('should display character count for caption', () => {
    const caption = 'Test caption'
    const tags = ['tag1', 'tag2']
    const expectedLength = `${caption} #tag1 #tag2`.length
    
    render(<TikTokPreview title={caption} tags={tags} />)
    
    expect(screen.getByText(`${expectedLength}/2200`)).toBeInTheDocument()
  })

  it('should apply correct color classes for caption character count', () => {
    // Test green status (≤1000 chars)
    const shortCaption = 'A'.repeat(500)
    const { rerender } = render(<TikTokPreview title={shortCaption} tags={[]} />)
    
    expect(screen.getByText(`500/2200`)).toHaveClass('text-green-400')
    
    // Test yellow status (1001-1800 chars)
    const mediumCaption = 'A'.repeat(1200)
    rerender(<TikTokPreview title={mediumCaption} tags={[]} />)
    
    expect(screen.getByText(`1200/2200`)).toHaveClass('text-yellow-400')
    
    // Test red status (>1800 chars)
    const longCaption = 'A'.repeat(2000)
    rerender(<TikTokPreview title={longCaption} tags={[]} />)
    
    expect(screen.getByText(`2000/2200`)).toHaveClass('text-red-400')
  })

  it('should show profile picture with username initial', () => {
    render(<TikTokPreview title="Test" tags={[]} username="john_doe" />)
    
    expect(screen.getByText('J')).toBeInTheDocument() // First letter of username
  })

  it('should display TikTok UI elements', () => {
    render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should show engagement counts
    expect(screen.getByText('142K')).toBeInTheDocument() // Likes
    expect(screen.getByText('1.2K')).toBeInTheDocument() // Comments
    expect(screen.getByText('840')).toBeInTheDocument() // Shares
    
    // Should show top navigation
    expect(screen.getByText('Following')).toBeInTheDocument()
    expect(screen.getByText('For You')).toBeInTheDocument()
    expect(screen.getByText('LIVE')).toBeInTheDocument()
    
    // Should show follow button
    expect(screen.getByText('Follow')).toBeInTheDocument()
  })

  it('should display TikTok branding', () => {
    render(<TikTokPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('TikTok')).toBeInTheDocument()
  })

  it('should show music information', () => {
    render(<TikTokPreview title="Test" tags={[]} username="testuser" />)
    
    expect(screen.getByText(/Original sound - testuser/)).toBeInTheDocument()
  })

  it('should display hashtag pills', () => {
    const tags = ['dance', 'viral', 'trending']
    render(<TikTokPreview title="Test" tags={tags} />)
    
    // Should show hashtags as pills
    tags.forEach(tag => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument()
    })
  })

  it('should limit hashtag display to 4 and show overflow', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    render(<TikTokPreview title="Test" tags={manyTags} />)
    
    // Should show first 4 tags as pills
    expect(screen.getByText('#tag1')).toBeInTheDocument()
    expect(screen.getByText('#tag2')).toBeInTheDocument()
    expect(screen.getByText('#tag3')).toBeInTheDocument()
    expect(screen.getByText('#tag4')).toBeInTheDocument()
    
    // Should not show 5th and 6th tags as individual pills
    expect(screen.queryByText('#tag5')).not.toBeInTheDocument()
    expect(screen.queryByText('#tag6')).not.toBeInTheDocument()
    
    // Should show overflow count
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('should show effects and trending indicators', () => {
    render(<TikTokPreview title="Test" tags={[]} />)
    
    expect(screen.getByText(/Original • 📍 Trending/)).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<TikTokPreview title="TikTok video" tags={[]} />)
    
    expect(screen.getByText(/TikTok video$/)).toBeInTheDocument() // Should end with video, no hashtags
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should handle empty caption and title', () => {
    render(<TikTokPreview title="" tags={['viral']} />)
    
    expect(screen.getAllByText(/#viral/)).toHaveLength(2) // Caption and pill
  })

  it('should prefer caption over title when both provided', () => {
    render(<TikTokPreview title="Title text" caption="Caption text" tags={[]} />)
    
    expect(screen.getByText(/Caption text/)).toBeInTheDocument()
    expect(screen.queryByText(/Title text/)).not.toBeInTheDocument()
  })

  it('should have vertical video aspect ratio', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('aspect-[9/16]')
  })

  it('should have dark theme styling', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have dark background
    expect(container.firstChild).toHaveClass('bg-black')
    expect(container.firstChild).toHaveClass('text-white')
  })

  it('should have TikTok-style rounded design', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have rounded corners
    expect(container.firstChild).toHaveClass('rounded-2xl')
  })

  it('should show gradient backgrounds and neon accents', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have gradient elements
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    expect(container.querySelector('.bg-gradient-to-r')).toBeInTheDocument()
  })

  it('should have animated music disc', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have spinning animation
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show play button indicator', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have play button (triangle shape made with borders)
    const playButton = container.querySelector('.border-l-white')
    expect(playButton).toBeInTheDocument()
  })

  it('should have backdrop blur effects', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have backdrop blur elements
    expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument()
  })

  it('should show profile follow button with plus icon', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have red follow button
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('should display music emoji in background', () => {
    render(<TikTokPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('🎵')).toBeInTheDocument()
  })

  it('should have responsive max width', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-xs')
  })

  it('should handle very long usernames', () => {
    const longUsername = 'very_long_tiktok_username_here'
    render(<TikTokPreview title="Test" tags={[]} username={longUsername} />)
    
    expect(screen.getByText(`@${longUsername}`)).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument() // First letter
  })

  it('should show glassmorphism design elements', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have glass-like effects with transparency and blur
    expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument()
    expect(container.querySelector('.bg-black\\/50, [class*="bg-black/50"]')).not.toBeNull()
  })

  it('should have proper z-index layering', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have z-index classes for proper layering
    expect(container.querySelector('.z-10')).toBeInTheDocument()
  })

  it('should calculate character count including hashtags', () => {
    const caption = 'A'.repeat(100)
    const tags = ['test'] // adds " #test" = 6 chars, total = 106
    render(<TikTokPreview title={caption} tags={tags} />)
    
    expect(screen.getByText('106/2200')).toBeInTheDocument()
  })

  it('should show TikTok gradient text branding', () => {
    const { container } = render(<TikTokPreview title="Test" tags={[]} />)
    
    // Should have gradient text effect for TikTok branding
    expect(container.querySelector('.bg-gradient-to-r')).toBeInTheDocument()
    expect(container.querySelector('.bg-clip-text')).toBeInTheDocument()
    expect(container.querySelector('.text-transparent')).toBeInTheDocument()
  })
}) 