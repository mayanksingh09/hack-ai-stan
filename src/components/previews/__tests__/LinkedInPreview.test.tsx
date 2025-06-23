import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { LinkedInPreview } from '../LinkedInPreview'

describe('LinkedInPreview', () => {
  const defaultProps = {
    title: 'Professional insight about industry trends',
    post_body: 'Sharing some thoughts on the future of technology',
    headline: 'Senior Software Engineer at Tech Company',
    about_section: 'Experienced software engineer with expertise in full-stack development',
    tags: ['technology', 'software', 'development'],
    username: 'john-doe',
    profile_name: 'John Doe'
  }

  it('should render with basic props', () => {
    render(<LinkedInPreview {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Senior Software Engineer at Tech Company')).toBeInTheDocument()
    expect(screen.getByText(/Sharing some thoughts on the future of technology/)).toBeInTheDocument()
    expect(screen.getByText(/#technology/)).toBeInTheDocument()
    expect(screen.getByText(/#software/)).toBeInTheDocument()
    expect(screen.getByText(/#development/)).toBeInTheDocument()
  })

  it('should use title as post body when post_body is not provided', () => {
    render(<LinkedInPreview title="Professional update" tags={['business']} />)
    
    expect(screen.getByText(/Professional update/)).toBeInTheDocument()
  })

  it('should use default profile name when not provided', () => {
    render(<LinkedInPreview title="Test post" tags={[]} />)
    
    expect(screen.getByText('Your Profile')).toBeInTheDocument()
  })

  it('should display headline when provided', () => {
    render(<LinkedInPreview title="Test" tags={[]} headline="CTO at Startup" />)
    
    expect(screen.getByText('CTO at Startup')).toBeInTheDocument()
  })

  it('should not display headline when not provided', () => {
    render(<LinkedInPreview title="Test" tags={[]} />)
    
    expect(screen.queryByText(/CTO/)).not.toBeInTheDocument()
  })

  it('should integrate hashtags into post content with newlines', () => {
    render(<LinkedInPreview title="Professional post" tags={['tag1', 'tag2']} />)
    
    expect(screen.getByText(/Professional post/)).toBeInTheDocument()
    expect(screen.getByText(/#tag1 #tag2/)).toBeInTheDocument()
  })

  it('should truncate post when exceeding preview limit', () => {
    const longPost = 'A'.repeat(300) // Exceeds 200 preview limit
    render(<LinkedInPreview title="Test" post_body={longPost} tags={[]} />)
    
    expect(screen.getByText('See more')).toBeInTheDocument()
  })

  it('should toggle post visibility when "See more/less" is clicked', () => {
    const longPost = 'A'.repeat(300)
    render(<LinkedInPreview title="Test" post_body={longPost} tags={[]} />)
    
    const seeMoreButton = screen.getByText('See more')
    fireEvent.click(seeMoreButton)
    
    expect(screen.getByText('See less')).toBeInTheDocument()
    
    const seeLessButton = screen.getByText('See less')
    fireEvent.click(seeLessButton)
    
    expect(screen.getByText('See more')).toBeInTheDocument()
  })

  it('should display character count for post', () => {
    const content = 'Test post'
    const tags = ['tag1', 'tag2']
    const expectedLength = `${content}\n\n#tag1 #tag2`.length
    
    render(<LinkedInPreview title={content} tags={tags} />)
    
    expect(screen.getByText(`Post: ${expectedLength}/3000`)).toBeInTheDocument()
  })

  it('should apply correct color classes for post character count', () => {
    // Test green status (≤1000 chars)
    const shortPost = 'A'.repeat(500)
    const { rerender } = render(<LinkedInPreview title={shortPost} tags={[]} />)
    
    expect(screen.getByText(`Post: 500/3000`)).toHaveClass('text-green-600')
    
    // Test yellow status (1001-2000 chars)
    const mediumPost = 'A'.repeat(1500)
    rerender(<LinkedInPreview title={mediumPost} tags={[]} />)
    
    expect(screen.getByText(`Post: 1500/3000`)).toHaveClass('text-yellow-600')
    
    // Test red status (>2000 chars)
    const longPost = 'A'.repeat(2500)
    rerender(<LinkedInPreview title={longPost} tags={[]} />)
    
    expect(screen.getByText(`Post: 2500/3000`)).toHaveClass('text-red-600')
  })

  it('should display about section when provided', () => {
    render(<LinkedInPreview title="Test" tags={[]} about_section="Professional background info" />)
    
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText(/Professional background info/)).toBeInTheDocument()
  })

  it('should not display about section when not provided', () => {
    render(<LinkedInPreview title="Test" tags={[]} />)
    
    expect(screen.queryByText('About')).not.toBeInTheDocument()
  })

  it('should truncate about section content', () => {
    const longAbout = 'A'.repeat(200) // Exceeds 120 truncation limit
    render(<LinkedInPreview title="Test" tags={[]} about_section={longAbout} />)
    
    const aboutElements = screen.getAllByText(/A+/)
    const truncatedAbout = aboutElements.find(el => el.textContent?.includes('...'))
    expect(truncatedAbout).toBeInTheDocument()
    expect(truncatedAbout?.textContent?.length).toBeLessThan(200)
  })

  it('should show profile picture with initial', () => {
    render(<LinkedInPreview title="Test" tags={[]} profile_name="Jane Smith" />)
    
    expect(screen.getByText('J')).toBeInTheDocument() // First letter of profile name
  })

  it('should display LinkedIn UI elements', () => {
    render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Should show engagement counts
    expect(screen.getByText('247 reactions')).toBeInTheDocument()
    expect(screen.getByText('18 comments')).toBeInTheDocument()
    expect(screen.getByText('12 reposts')).toBeInTheDocument()
    
    // Should show timestamp
    expect(screen.getByText('2h')).toBeInTheDocument()
    
    // Should show action buttons
    expect(screen.getByText('Like')).toBeInTheDocument()
    expect(screen.getByText('Comment')).toBeInTheDocument()
    expect(screen.getByText('Repost')).toBeInTheDocument()
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('should display LinkedIn branding', () => {
    render(<LinkedInPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle empty tags array', () => {
    render(<LinkedInPreview title="Professional post" tags={[]} />)
    
    expect(screen.getByText(/Professional post$/)).toBeInTheDocument() // Should end with post, no hashtags
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('should handle empty post body and title', () => {
    render(<LinkedInPreview title="" tags={['business']} />)
    
    expect(screen.getByText(/#business/)).toBeInTheDocument()
  })

  it('should prefer post_body over title when both provided', () => {
    render(<LinkedInPreview title="Title text" post_body="Post body text" tags={[]} />)
    
    expect(screen.getByText(/Post body text/)).toBeInTheDocument()
    expect(screen.queryByText(/Title text/)).not.toBeInTheDocument()
  })

  it('should not show more/less button for short posts', () => {
    render(<LinkedInPreview title="Short post" tags={[]} />)
    
    expect(screen.queryByText('See more')).not.toBeInTheDocument()
    expect(screen.queryByText('See less')).not.toBeInTheDocument()
  })

  it('should have responsive styling classes', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    expect(container.firstChild).toHaveClass('max-w-md')
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('should support dark mode classes', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Check for dark mode classes
    expect(container.querySelector('.dark\\:bg-gray-900')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument()
  })

  it('should have professional LinkedIn styling', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Should have blue theme elements
    expect(container.querySelector('.bg-blue-600')).toBeInTheDocument()
    // Should have LinkedIn branding with blue background
    const brandingElement = container.querySelector('.bg-blue-600:last-child')
    expect(brandingElement).toBeInTheDocument()
  })

  it('should show reaction icons in engagement bar', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Should have reaction icons
    const reactionIcons = container.querySelectorAll('.bg-blue-600, .bg-red-500')
    expect(reactionIcons.length).toBeGreaterThan(0)
  })

  it('should handle whitespace in post content properly', () => {
    const postWithNewlines = 'Line 1\nLine 2\nLine 3'
    render(<LinkedInPreview title={postWithNewlines} tags={[]} />)
    
    // whitespace-pre-line should preserve newlines
    const postElement = screen.getByText(/Line 1/)
    expect(postElement).toHaveClass('whitespace-pre-line')
  })

  it('should show LinkedIn icon in about section', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} about_section="About me" />)
    
    // Should have LinkedIn icon in about section
    const aboutSection = container.querySelector('.bg-blue-50')
    expect(aboutSection).toBeInTheDocument()
  })

  it('should have hover effects on action buttons', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Should have hover effects
    expect(container.querySelector('.hover\\:bg-gray-50')).toBeInTheDocument()
  })

  it('should show global visibility indicator', () => {
    render(<LinkedInPreview title="Test" tags={[]} />)
    
    expect(screen.getByText('🌐')).toBeInTheDocument()
  })

  it('should have larger profile picture than other platforms', () => {
    const { container } = render(<LinkedInPreview title="Test" tags={[]} />)
    
    // Should have 12x12 profile picture (larger than Twitter/Instagram)
    const profilePicture = container.querySelector('.w-12.h-12')
    expect(profilePicture).toBeInTheDocument()
  })

  it('should handle very long profile names', () => {
    const longProfileName = 'Very Long Professional Name That Should Display Properly'
    render(<LinkedInPreview title="Test" tags={[]} profile_name={longProfileName} />)
    
    expect(screen.getByText(longProfileName)).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument() // First letter
  })
}) 