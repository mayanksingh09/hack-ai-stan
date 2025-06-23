import React from 'react'
import { render, screen } from '@testing-library/react'
import { XTwitterPreview } from '../XTwitterPreview'

describe('XTwitterPreview', () => {
  const defaultProps = {
    title: 'This is a test tweet',
    post_body: 'Check out this amazing content I found today!',
    tags: ['twitter', 'test', 'content'],
    username: 'testuser',
    profile_name: 'Test User'
  }

  it('should render with basic props', () => {
    render(<XTwitterPreview {...defaultProps} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText(/Check out this amazing content I found today!/)).toBeInTheDocument()
    expect(screen.getByText(/#twitter/)).toBeInTheDocument()
    expect(screen.getByText(/#test/)).toBeInTheDocument()
    expect(screen.getByText(/#content/)).toBeInTheDocument()
  })

  it('should use title as post body when post_body is not provided', () => {
    render(<XTwitterPreview title="My awesome tweet" tags={['test']} />)
    
    expect(screen.getByText(/My awesome tweet/)).toBeInTheDocument()
  })

  it('should use default username when not provided', () => {
    render(<XTwitterPreview title="Test tweet" tags={[]} />)
    
    expect(screen.getByText('Your Profile')).toBeInTheDocument()
    expect(screen.getByText('@your_username')).toBeInTheDocument()
  })

  it('should integrate hashtags into post content', () => {
    render(<XTwitterPreview title="Test tweet" tags={['tag1', 'tag2']} />)
    
    expect(screen.getByText(/Test tweet #tag1 #tag2/)).toBeInTheDocument()
  })

  it('should display character count', () => {
    const content = 'Test tweet'
    const tags = ['tag1', 'tag2']
    const expectedLength = `${content} #tag1 #tag2`.length
    
    render(<XTwitterPreview title={content} tags={tags} />)
    
    expect(screen.getByText(`${expectedLength}/280`)).toBeInTheDocument()
  })

  it('should apply correct color classes for character count', () => {
    // Test green status (≤200 chars)
    const shortContent = 'A'.repeat(100)
    const { rerender } = render(<XTwitterPreview title={shortContent} tags={[]} />)
    
    expect(screen.getByText(`100/280`)).toHaveClass('text-green-600')
    
    // Test yellow status (201-260 chars)
    const mediumContent = 'A'.repeat(220)
    rerender(<XTwitterPreview title={mediumContent} tags={[]} />)
    
    expect(screen.getByText(`220/280`)).toHaveClass('text-yellow-600')
    
    // Test red status (>260 chars)
    const longContent = 'A'.repeat(270)
    rerender(<XTwitterPreview title={longContent} tags={[]} />)
    
    expect(screen.getByText(`270/280`)).toHaveClass('text-red-600')
  })

  it('should show warning when character limit is exceeded', () => {
    const longContent = 'A'.repeat(300) // Exceeds 280 limit
    render(<XTwitterPreview title={longContent} tags={[]} />)
    
    expect(screen.getByText(/Tweet exceeds character limit by 20 characters/)).toBeInTheDocument()
  })

  it('should not show warning when within character limit', () => {
    const shortContent = 'Short tweet'
    render(<XTwitterPreview title={shortContent} tags={[]} />)
    
    expect(screen.queryByText(/Tweet exceeds character limit/)).not.toBeInTheDocument()
  })

  it('should show negative character count in progress ring when exceeded', () => {
    const longContent = 'A'.repeat(290) // Exceeds 280 limit
    render(<XTwitterPreview title={longContent} tags={[]} />)
    
    expect(screen.getByText('-10')).toBeInTheDocument() // 280 - 290 = -10
  })

  it('should show profile picture with user initial', () => {
    render(<XTwitterPreview title="Test" tags={[]} username="john_doe" />)
    
    expect(screen.getByText('J')).toBeInTheDocument() // First letter of username
  })

  it('should display Twitter UI elements', () => {
    render(<XTwitterPreview title="Test" tags={[]} />)
    
    // Should show engagement counts
    expect(screen.getByText('24')).toBeInTheDocument() // Comments
    expect(screen.getByText('12')).toBeInTheDocument() // Retweets
    expect(screen.getByText('142')).toBeInTheDocument() // Likes
    
    // Should show timestamp
    expect(screen.getByText('2h')).toBeInTheDocument()
  })

  it('should show progress ring for character count', () => {
    const { container } = render(<XTwitterPreview title="Test tweet" tags={[]} />)
    
    // Should have SVG circle elements for progress ring
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2) // Background circle and progress circle
  })

  it('should display X branding', () => {
    render(<XTwitterPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('𝕏')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<XTwitterPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<XTwitterPreview title="Test tweet" tags={[]} />)
    
    expect(screen.getByText(/Test tweet$/)).toBeInTheDocument() // Should end with tweet, no hashtags
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should handle empty post body and title', () => {
    render(<XTwitterPreview title="" tags={['test']} />)
    
    expect(screen.getByText(/#test/)).toBeInTheDocument()
  })

  it('should prefer post_body over title when both provided', () => {
    render(<XTwitterPreview title="Title text" post_body="Post body text" tags={[]} />)
    
    expect(screen.getByText(/Post body text/)).toBeInTheDocument()
    expect(screen.queryByText(/Title text/)).not.toBeInTheDocument()
  })

  it('should have responsive styling classes', () => {
    const { container } = render(<XTwitterPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('should support dark mode classes', () => {
    const { container } = render(<XTwitterPreview title="Test" tags={[]} />)
    
    // Check for dark mode classes
    expect(container.querySelector('.dark\\:bg-gray-900')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument()
  })

  it('should have Twitter-style action buttons with hover effects', () => {
    const { container } = render(<XTwitterPreview title="Test" tags={[]} />)
    
    // Should have action buttons with hover colors
    expect(container.querySelector('.hover\\:text-blue-500')).toBeInTheDocument()
    expect(container.querySelector('.hover\\:text-green-500')).toBeInTheDocument()
    expect(container.querySelector('.hover\\:text-red-500')).toBeInTheDocument()
  })

  it('should truncate long profile names', () => {
    const longProfileName = 'Very Long Profile Name That Should Be Truncated'
    render(<XTwitterPreview title="Test" tags={[]} profile_name={longProfileName} />)
    
    const profileElement = screen.getByText(longProfileName)
    expect(profileElement).toHaveClass('truncate')
  })

  it('should handle character count exactly at limit', () => {
    const contentAtLimit = 'A'.repeat(280)
    render(<XTwitterPreview title={contentAtLimit} tags={[]} />)
    
    expect(screen.getByText('280/280')).toBeInTheDocument()
    expect(screen.queryByText(/Tweet exceeds character limit/)).not.toBeInTheDocument()
  })

  it('should handle character count just over limit', () => {
    const contentOverLimit = 'A'.repeat(281)
    render(<XTwitterPreview title={contentOverLimit} tags={[]} />)
    
    expect(screen.getByText('281/280')).toBeInTheDocument()
    expect(screen.getByText(/Tweet exceeds character limit by 1 characters/)).toBeInTheDocument()
  })

  it('should calculate character count including hashtags', () => {
    const content = 'A'.repeat(260)
    const tags = ['test'] // adds " #test" = 6 chars, total = 266
    render(<XTwitterPreview title={content} tags={tags} />)
    
    expect(screen.getByText('266/280')).toBeInTheDocument()
  })

  it('should show X branding with black background', () => {
    const { container } = render(<XTwitterPreview title="Test" tags={[]} />)
    
    const brandingElement = container.querySelector('.bg-black')
    expect(brandingElement).toBeInTheDocument()
    expect(brandingElement).toHaveClass('text-white')
  })
}) 