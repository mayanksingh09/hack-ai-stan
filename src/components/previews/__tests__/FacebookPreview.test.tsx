import React from 'react'
import { render, screen } from '@testing-library/react'
import { FacebookPreview } from '../FacebookPreview'

describe('FacebookPreview', () => {
  const defaultProps = {
    title: 'Great insights on social media marketing',
    post_body: 'Sharing some thoughts on effective Facebook strategies',
    headline: 'Digital Marketing Specialist',
    tags: ['marketing', 'facebook', 'social'],
    username: 'john.doe',
    profile_name: 'John Doe'
  }

  it('should render with basic props', () => {
    render(<FacebookPreview {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Digital Marketing Specialist')).toBeInTheDocument()
    expect(screen.getByText(/Sharing some thoughts on effective Facebook strategies/)).toBeInTheDocument()
    expect(screen.getByText(/#marketing/)).toBeInTheDocument()
    expect(screen.getByText(/#facebook/)).toBeInTheDocument()
    expect(screen.getByText(/#social/)).toBeInTheDocument()
  })

  it('should use title as post body when post_body is not provided', () => {
    render(<FacebookPreview title="Marketing insights" tags={['business']} />)
    
    expect(screen.getByText(/Marketing insights/)).toBeInTheDocument()
  })

  it('should use default profile name when not provided', () => {
    render(<FacebookPreview title="Test post" tags={[]} />)
    
    expect(screen.getByText('Your Profile')).toBeInTheDocument()
  })

  it('should display headline when provided', () => {
    render(<FacebookPreview title="Test" tags={[]} headline="Social Media Manager" />)
    
    expect(screen.getByText('Social Media Manager')).toBeInTheDocument()
  })

  it('should not display headline when not provided', () => {
    render(<FacebookPreview title="Test" tags={[]} />)
    
    expect(screen.queryByText(/Manager/)).not.toBeInTheDocument()
  })

  it('should integrate hashtags into post content', () => {
    render(<FacebookPreview title="Facebook post" tags={['tag1', 'tag2']} />)
    
    expect(screen.getByText(/Facebook post #tag1 #tag2/)).toBeInTheDocument()
  })

  it('should limit hashtags to 5 for optimal engagement', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7']
    render(<FacebookPreview title="Test post" tags={manyTags} />)
    
    // Should only show first 5 tags in content
    expect(screen.getByText(/Test post #tag1 #tag2 #tag3 #tag4 #tag5$/)).toBeInTheDocument()
    expect(screen.queryByText(/#tag6/)).not.toBeInTheDocument()
    expect(screen.queryByText(/#tag7/)).not.toBeInTheDocument()
  })

  it('should show warning when using more than 5 hashtags', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    render(<FacebookPreview title="Test" tags={manyTags} />)
    
    expect(screen.getByText(/Using 6 hashtags. Consider using 5 or fewer for better reach/)).toBeInTheDocument()
  })

  it('should not show hashtag warning when using 5 or fewer tags', () => {
    const fewTags = ['tag1', 'tag2', 'tag3']
    render(<FacebookPreview title="Test" tags={fewTags} />)
    
    expect(screen.queryByText(/Consider using.*or fewer/)).not.toBeInTheDocument()
  })

  it('should show optimal engagement indicator for short posts', () => {
    const shortPost = 'A'.repeat(50) // Under 80 chars - optimal
    render(<FacebookPreview title={shortPost} tags={[]} />)
    
    expect(screen.getByText('Optimal length for engagement')).toBeInTheDocument()
    expect(screen.getByText('50 chars')).toHaveClass('text-green-600')
  })

  it('should show good engagement indicator for medium posts', () => {
    const mediumPost = 'A'.repeat(120) // 80-160 chars - good
    render(<FacebookPreview title={mediumPost} tags={[]} />)
    
    expect(screen.getByText('Good length, could be shorter')).toBeInTheDocument()
    expect(screen.getByText('120 chars')).toHaveClass('text-yellow-600')
  })

  it('should show poor engagement indicator for long posts', () => {
    const longPost = 'A'.repeat(200) // Over 160 chars - poor
    render(<FacebookPreview title={longPost} tags={[]} />)
    
    expect(screen.getByText('Consider shortening for better engagement')).toBeInTheDocument()
    expect(screen.getByText('200 chars')).toHaveClass('text-red-600')
  })

  it('should show content analysis section', () => {
    render(<FacebookPreview title="Test post" tags={[]} />)
    
    expect(screen.getByText('Content Analysis')).toBeInTheDocument()
  })

  it('should show progress bar with correct color for content length', () => {
    const { container, rerender } = render(<FacebookPreview title="Short" tags={[]} />)
    
    // Should show green for optimal length
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
    
    // Test yellow for medium length
    const mediumPost = 'A'.repeat(120)
    rerender(<FacebookPreview title={mediumPost} tags={[]} />)
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument()
    
    // Test red for long length
    const longPost = 'A'.repeat(200)
    rerender(<FacebookPreview title={longPost} tags={[]} />)
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('should show profile picture with initial', () => {
    render(<FacebookPreview title="Test" tags={[]} profile_name="Jane Smith" />)
    
    expect(screen.getByText('J')).toBeInTheDocument() // First letter of profile name
  })

  it('should display Facebook UI elements', () => {
    render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should show engagement counts
    expect(screen.getByText('142 reactions')).toBeInTheDocument()
    expect(screen.getByText('28 comments')).toBeInTheDocument()
    expect(screen.getByText('15 shares')).toBeInTheDocument()
    
    // Should show timestamp
    expect(screen.getByText('2h')).toBeInTheDocument()
    
    // Should show action buttons
    expect(screen.getByText('Like')).toBeInTheDocument()
    expect(screen.getByText('Comment')).toBeInTheDocument()
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('should display image placeholder', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have aspect-video container
    const imageContainer = container.querySelector('.aspect-video')
    expect(imageContainer).toBeInTheDocument()
    
    // Should show photo emoji
    expect(screen.getByText('📸')).toBeInTheDocument()
    
    // Should show photo label
    expect(screen.getByText('Photo')).toBeInTheDocument()
  })

  it('should display Facebook branding', () => {
    render(<FacebookPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('Facebook')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<FacebookPreview title="Facebook post" tags={[]} />)
    
    expect(screen.getByText(/Facebook post$/)).toBeInTheDocument() // Should end with post, no hashtags
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should handle empty post body and title', () => {
    render(<FacebookPreview title="" tags={['business']} />)
    
    expect(screen.getByText(/#business/)).toBeInTheDocument()
  })

  it('should prefer post_body over title when both provided', () => {
    render(<FacebookPreview title="Title text" post_body="Post body text" tags={[]} />)
    
    expect(screen.getByText(/Post body text/)).toBeInTheDocument()
    expect(screen.queryByText(/Title text/)).not.toBeInTheDocument()
  })

  it('should have responsive styling classes', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-xl')
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('should support dark mode classes', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Check for dark mode classes
    expect(container.querySelector('.dark\\:bg-gray-900')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument()
  })

  it('should have Facebook-style rounded design', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have rounded corners
    expect(container.firstChild).toHaveClass('rounded-xl')
    
    // Should have rounded elements
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })

  it('should show multiple reaction types', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have different colored reaction icons
    expect(container.querySelector('.bg-blue-600')).toBeInTheDocument() // Like
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument() // Heart
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument() // Laugh
  })

  it('should have hover effects on action buttons', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have hover effects
    expect(container.querySelector('.hover\\:bg-gray-100')).toBeInTheDocument()
  })

  it('should show location indicator', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have location icon (SVG path for location)
    const locationIcon = container.querySelector('svg')
    expect(locationIcon).toBeInTheDocument()
  })

  it('should calculate character count including hashtags', () => {
    const content = 'A'.repeat(50)
    const tags = ['test'] // adds " #test" = 6 chars, total = 56
    render(<FacebookPreview title={content} tags={tags} />)
    
    expect(screen.getByText('56 chars')).toBeInTheDocument()
  })

  it('should handle exactly optimal length posts', () => {
    const optimalPost = 'A'.repeat(80) // Exactly at optimal limit
    render(<FacebookPreview title={optimalPost} tags={[]} />)
    
    expect(screen.getByText('Optimal length for engagement')).toBeInTheDocument()
    expect(screen.getByText('80 chars')).toHaveClass('text-green-600')
  })

  it('should show Facebook blue theme elements', () => {
    const { container } = render(<FacebookPreview title="Test" tags={[]} />)
    
    // Should have blue theme elements
    expect(container.querySelector('.bg-blue-600')).toBeInTheDocument()
    expect(container.querySelector('.text-blue-400')).toBeInTheDocument()
  })

  it('should handle very long profile names', () => {
    const longProfileName = 'Very Long Facebook Profile Name That Should Display'
    render(<FacebookPreview title="Test" tags={[]} profile_name={longProfileName} />)
    
    expect(screen.getByText(longProfileName)).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument() // First letter
  })
}) 