import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlatformPreview } from '../PlatformPreview'

// Mock all platform preview components
jest.mock('../YouTubePreview', () => ({
  YouTubePreview: ({ title, description, tags, className }: any) => (
    <div data-testid="youtube-preview" className={className}>
      <div>YouTube: {title}</div>
      {description && <div>Description: {description}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../InstagramPreview', () => ({
  InstagramPreview: ({ title, caption, tags, username, profile_name, className }: any) => (
    <div data-testid="instagram-preview" className={className}>
      <div>Instagram: {title}</div>
      {caption && <div>Caption: {caption}</div>}
      {username && <div>Username: {username}</div>}
      {profile_name && <div>Profile: {profile_name}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../XTwitterPreview', () => ({
  XTwitterPreview: ({ title, post_body, tags, username, profile_name, className }: any) => (
    <div data-testid="x-twitter-preview" className={className}>
      <div>X/Twitter: {title}</div>
      {post_body && <div>Post: {post_body}</div>}
      {username && <div>Username: {username}</div>}
      {profile_name && <div>Profile: {profile_name}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../LinkedInPreview', () => ({
  LinkedInPreview: ({ title, post_body, headline, about_section, tags, profile_name, className }: any) => (
    <div data-testid="linkedin-preview" className={className}>
      <div>LinkedIn: {title}</div>
      {post_body && <div>Post: {post_body}</div>}
      {headline && <div>Headline: {headline}</div>}
      {about_section && <div>About: {about_section}</div>}
      {profile_name && <div>Profile: {profile_name}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../FacebookPreview', () => ({
  FacebookPreview: ({ title, post_body, headline, tags, profile_name, className }: any) => (
    <div data-testid="facebook-preview" className={className}>
      <div>Facebook: {title}</div>
      {post_body && <div>Post: {post_body}</div>}
      {headline && <div>Headline: {headline}</div>}
      {profile_name && <div>Profile: {profile_name}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../TikTokPreview', () => ({
  TikTokPreview: ({ title, caption, tags, username, className }: any) => (
    <div data-testid="tiktok-preview" className={className}>
      <div>TikTok: {title}</div>
      {caption && <div>Caption: {caption}</div>}
      {username && <div>Username: {username}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

jest.mock('../TwitchPreview', () => ({
  TwitchPreview: ({ title, bio, stream_category, tags, username, className }: any) => (
    <div data-testid="twitch-preview" className={className}>
      <div>Twitch: {title}</div>
      {bio && <div>Bio: {bio}</div>}
      {stream_category && <div>Category: {stream_category}</div>}
      {username && <div>Username: {username}</div>}
      <div>Tags: {tags.join(', ')}</div>
    </div>
  )
}))

describe('PlatformPreview', () => {
  const defaultContent = {
    title: 'Test Content Title',
    tags: ['test', 'content'],
    description: 'Test description',
    caption: 'Test caption',
    post_body: 'Test post body',
    headline: 'Test headline',
    bio: 'Test bio',
    username: 'testuser',
    profile_name: 'Test User',
    about_section: 'Test about section',
    connection_message: 'Test connection',
    stream_category: 'Gaming'
  }

  it('should render YouTube preview for youtube platform', () => {
    render(<PlatformPreview platform="youtube" content={defaultContent} />)
    
    expect(screen.getByTestId('youtube-preview')).toBeInTheDocument()
    expect(screen.getByText('YouTube: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Description: Test description')).toBeInTheDocument()
    expect(screen.getByText('Tags: test, content')).toBeInTheDocument()
  })

  it('should render Instagram preview for instagram platform', () => {
    render(<PlatformPreview platform="instagram" content={defaultContent} />)
    
    expect(screen.getByTestId('instagram-preview')).toBeInTheDocument()
    expect(screen.getByText('Instagram: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Caption: Test caption')).toBeInTheDocument()
    expect(screen.getByText('Username: testuser')).toBeInTheDocument()
    expect(screen.getByText('Profile: Test User')).toBeInTheDocument()
  })

  it('should render X/Twitter preview for x_twitter platform', () => {
    render(<PlatformPreview platform="x_twitter" content={defaultContent} />)
    
    expect(screen.getByTestId('x-twitter-preview')).toBeInTheDocument()
    expect(screen.getByText('X/Twitter: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Post: Test post body')).toBeInTheDocument()
  })

  it('should render X/Twitter preview for twitter platform alias', () => {
    render(<PlatformPreview platform="twitter" content={defaultContent} />)
    
    expect(screen.getByTestId('x-twitter-preview')).toBeInTheDocument()
  })

  it('should render X/Twitter preview for x platform alias', () => {
    render(<PlatformPreview platform="x" content={defaultContent} />)
    
    expect(screen.getByTestId('x-twitter-preview')).toBeInTheDocument()
  })

  it('should render LinkedIn preview for linkedin platform', () => {
    render(<PlatformPreview platform="linkedin" content={defaultContent} />)
    
    expect(screen.getByTestId('linkedin-preview')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Post: Test post body')).toBeInTheDocument()
    expect(screen.getByText('Headline: Test headline')).toBeInTheDocument()
    expect(screen.getByText('About: Test about section')).toBeInTheDocument()
  })

  it('should render Facebook preview for facebook platform', () => {
    render(<PlatformPreview platform="facebook" content={defaultContent} />)
    
    expect(screen.getByTestId('facebook-preview')).toBeInTheDocument()
    expect(screen.getByText('Facebook: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Post: Test post body')).toBeInTheDocument()
    expect(screen.getByText('Headline: Test headline')).toBeInTheDocument()
  })

  it('should render TikTok preview for tiktok platform', () => {
    render(<PlatformPreview platform="tiktok" content={defaultContent} />)
    
    expect(screen.getByTestId('tiktok-preview')).toBeInTheDocument()
    expect(screen.getByText('TikTok: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Caption: Test caption')).toBeInTheDocument()
    expect(screen.getByText('Username: testuser')).toBeInTheDocument()
  })

  it('should render TikTok preview for tik_tok platform alias', () => {
    render(<PlatformPreview platform="tik_tok" content={defaultContent} />)
    
    expect(screen.getByTestId('tiktok-preview')).toBeInTheDocument()
  })

  it('should render Twitch preview for twitch platform', () => {
    render(<PlatformPreview platform="twitch" content={defaultContent} />)
    
    expect(screen.getByTestId('twitch-preview')).toBeInTheDocument()
    expect(screen.getByText('Twitch: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Bio: Test bio')).toBeInTheDocument()
    expect(screen.getByText('Category: Gaming')).toBeInTheDocument()
    expect(screen.getByText('Username: testuser')).toBeInTheDocument()
  })

  it('should be case insensitive for platform names', () => {
    render(<PlatformPreview platform="YOUTUBE" content={defaultContent} />)
    
    expect(screen.getByTestId('youtube-preview')).toBeInTheDocument()
  })

  it('should render generic preview for unsupported platform', () => {
    render(<PlatformPreview platform="unsupported" content={defaultContent} />)
    
    expect(screen.getByText('unsupported Preview')).toBeInTheDocument()
    expect(screen.getByText('Generic preview - platform not fully supported')).toBeInTheDocument()
    expect(screen.getByText('Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Test post body')).toBeInTheDocument()
    expect(screen.getByText('Test caption')).toBeInTheDocument()
  })

  it('should display bio in generic preview when provided', () => {
    render(<PlatformPreview platform="unknown" content={defaultContent} />)
    
    expect(screen.getByText('Bio:')).toBeInTheDocument()
    expect(screen.getByText('Test bio')).toBeInTheDocument()
  })

  it('should display hashtags in generic preview', () => {
    render(<PlatformPreview platform="unknown" content={defaultContent} />)
    
    expect(screen.getByText('#test')).toBeInTheDocument()
    expect(screen.getByText('#content')).toBeInTheDocument()
  })

  it('should show platform support message in generic preview', () => {
    const platform = 'newplatform'
    render(<PlatformPreview platform={platform} content={defaultContent} />)
    
    expect(screen.getByText(`Add support for ${platform} to see platform-specific preview`)).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<PlatformPreview platform="youtube" content={defaultContent} className="custom-class" />)
    
    expect(screen.getByTestId('youtube-preview')).toHaveClass('custom-class')
  })

  it('should pass minimal content without optional fields', () => {
    const minimalContent = {
      title: 'Minimal Title',
      tags: ['minimal']
    }

    render(<PlatformPreview platform="youtube" content={minimalContent} />)
    
    expect(screen.getByText('YouTube: Minimal Title')).toBeInTheDocument()
    expect(screen.getByText('Tags: minimal')).toBeInTheDocument()
  })

  it('should handle empty tags array', () => {
    const contentWithoutTags = {
      title: 'No Tags',
      tags: []
    }

    render(<PlatformPreview platform="youtube" content={contentWithoutTags} />)
    
    expect(screen.getByText('YouTube: No Tags')).toBeInTheDocument()
    expect(screen.getByText(/Tags:/)).toBeInTheDocument()
  })

  it('should not display optional content in generic preview when not provided', () => {
    const minimalContent = {
      title: 'Minimal Content',
      tags: ['test']
    }

    render(<PlatformPreview platform="unknown" content={minimalContent} />)
    
    expect(screen.getByText('Minimal Content')).toBeInTheDocument()
    expect(screen.queryByText('Bio:')).not.toBeInTheDocument()
    expect(screen.queryByText('Test description')).not.toBeInTheDocument()
  })

  it('should display platform initial in generic preview header', () => {
    render(<PlatformPreview platform="testplatform" content={defaultContent} />)
    
    expect(screen.getByText('T')).toBeInTheDocument() // First letter of platform
  })

  it('should handle platform with special characters', () => {
    render(<PlatformPreview platform="test-platform_2" content={defaultContent} />)
    
    expect(screen.getByText('T')).toBeInTheDocument() // First letter
    expect(screen.getByText('test-platform_2 Preview')).toBeInTheDocument()
  })

  // Error handling test - we'll test with an invalid platform that triggers generic preview
  it('should handle unsupported platforms gracefully with generic preview', () => {
    render(<PlatformPreview platform="unsupported_platform" content={defaultContent} />)
    
    expect(screen.getByText('unsupported_platform Preview')).toBeInTheDocument()
    expect(screen.getByText('Generic preview - platform not fully supported')).toBeInTheDocument()
    expect(screen.getByText('Add support for unsupported_platform to see platform-specific preview')).toBeInTheDocument()
  })

  it('should handle content with missing required fields gracefully', () => {
    const incompleteContent = {
      title: '',
      tags: []
    }

    render(<PlatformPreview platform="unknown" content={incompleteContent} />)
    
    expect(screen.getByText('unknown Preview')).toBeInTheDocument()
    expect(screen.queryByText('Bio:')).not.toBeInTheDocument()
  })

  it('should pass correct props to each platform component', () => {
    // Test that all expected props are passed correctly for each platform
    const { rerender } = render(<PlatformPreview platform="youtube" content={defaultContent} />)
    expect(screen.getByTestId('youtube-preview')).toBeInTheDocument()
    
    rerender(<PlatformPreview platform="instagram" content={defaultContent} />)
    expect(screen.getByTestId('instagram-preview')).toBeInTheDocument()
    
    rerender(<PlatformPreview platform="linkedin" content={defaultContent} />)
    expect(screen.getByTestId('linkedin-preview')).toBeInTheDocument()
  })

  it('should pass all expected props to platform components', () => {
    render(<PlatformPreview platform="linkedin" content={defaultContent} className="test-class" />)
    
    const linkedinPreview = screen.getByTestId('linkedin-preview')
    expect(linkedinPreview).toHaveClass('test-class')
    expect(screen.getByText('LinkedIn: Test Content Title')).toBeInTheDocument()
    expect(screen.getByText('Post: Test post body')).toBeInTheDocument()
    expect(screen.getByText('Headline: Test headline')).toBeInTheDocument()
    expect(screen.getByText('About: Test about section')).toBeInTheDocument()
    expect(screen.getByText('Profile: Test User')).toBeInTheDocument()
    expect(screen.getByText('Tags: test, content')).toBeInTheDocument()
  })
}) 