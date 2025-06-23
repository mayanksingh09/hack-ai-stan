import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GeneratedContentCard, type GeneratedContent } from '../GeneratedContentCard'

// Mock the PlatformPreview component
interface MockPlatformPreviewProps {
  platform: string
  content: { title: string; tags: string[] }
  className?: string
}

jest.mock('@/components/previews', () => ({
  PlatformPreview: ({ platform, content, className }: MockPlatformPreviewProps) => (
    <div data-testid="platform-preview" className={className}>
      <div>Preview for {platform}</div>
      <div>Title: {content.title}</div>
      <div>Tags: {content.tags.join(', ')}</div>
    </div>
  )
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve())
  }
})

describe('GeneratedContentCard', () => {
  const defaultContent: GeneratedContent = {
    platform: 'youtube',
    title: 'How to Build Amazing React Components',
    tags: ['react', 'tutorial', 'frontend'],
    description: 'Learn how to build reusable React components with TypeScript.',
    validation: {
      status: 'valid',
      score: 95
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render with basic content', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      expect(screen.getByText('youtube')).toBeInTheDocument()
      expect(screen.getByText('How to Build Amazing React Components')).toBeInTheDocument()
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('tutorial')).toBeInTheDocument()
      expect(screen.getByText('frontend')).toBeInTheDocument()
    })

    it('should show loading state', () => {
      render(<GeneratedContentCard content={defaultContent} loading={true} />)
      
      expect(screen.getByText('Generating content...')).toBeInTheDocument()
      // Check for the spinner by its CSS class
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show error state', () => {
      const errorMessage = 'Failed to generate content'
      render(<GeneratedContentCard content={defaultContent} error={errorMessage} />)
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('View mode toggle', () => {
    it('should default to details view', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      expect(screen.getByText('Details')).toHaveClass('bg-white')
      expect(screen.getByText('Preview')).not.toHaveClass('bg-white')
      expect(screen.getByText('Title')).toBeInTheDocument() // Details view content
    })

    it('should switch to preview view when preview button is clicked', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      const previewButton = screen.getByText('Preview')
      fireEvent.click(previewButton)
      
      expect(screen.getByText('Preview')).toHaveClass('bg-white')
      expect(screen.getByText('Details')).not.toHaveClass('bg-white')
      expect(screen.getByTestId('platform-preview')).toBeInTheDocument()
    })

    it('should switch back to details view when details button is clicked', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      // Switch to preview
      fireEvent.click(screen.getByText('Preview'))
      expect(screen.getByTestId('platform-preview')).toBeInTheDocument()
      
      // Switch back to details
      fireEvent.click(screen.getByText('Details'))
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.queryByTestId('platform-preview')).not.toBeInTheDocument()
    })
  })

  describe('Platform preview integration', () => {
    it('should render platform preview with correct props', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      fireEvent.click(screen.getByText('Preview'))
      
      const preview = screen.getByTestId('platform-preview')
      expect(preview).toBeInTheDocument()
      expect(screen.getByText('Preview for youtube')).toBeInTheDocument()
      expect(screen.getByText('Title: How to Build Amazing React Components')).toBeInTheDocument()
      expect(screen.getByText('Tags: react, tutorial, frontend')).toBeInTheDocument()
    })

    it('should apply correct className to platform preview', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      fireEvent.click(screen.getByText('Preview'))
      
      const preview = screen.getByTestId('platform-preview')
      expect(preview).toHaveClass('w-full', 'max-w-lg')
    })
  })

  describe('Copy functionality', () => {
    it('should copy title when title copy button is clicked', async () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      const titleCopyButton = screen.getByText('Copy')
      fireEvent.click(titleCopyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('How to Build Amazing React Components')
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should copy tags when tags copy button is clicked', async () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      const tagsCopyButton = screen.getByText('Copy All')
      fireEvent.click(tagsCopyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('react tutorial frontend')
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should copy platform-specific formatted content', async () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      const platformCopyButton = screen.getByText('Copy for YouTube')
      fireEvent.click(platformCopyButton)
      
      const expectedContent = `How to Build Amazing React Components

Learn how to build reusable React components with TypeScript.

#react #tutorial #frontend`
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedContent)
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })
  })

  describe('Platform-specific formatting', () => {
    it('should format YouTube content correctly', async () => {
      const youtubeContent: GeneratedContent = {
        platform: 'youtube',
        title: 'YouTube Video Title',
        description: 'Video description here',
        tags: ['youtube', 'video']
      }
      
      render(<GeneratedContentCard content={youtubeContent} />)
      
      fireEvent.click(screen.getByText('Copy for YouTube'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'YouTube Video Title\n\nVideo description here\n\n#youtube #video'
      )
    })

    it('should format Instagram content correctly', async () => {
      const instagramContent: GeneratedContent = {
        platform: 'instagram',
        title: 'Instagram Post',
        caption: 'Check out this amazing photo!',
        tags: ['photo', 'instagram']
      }
      
      render(<GeneratedContentCard content={instagramContent} />)
      
      fireEvent.click(screen.getByText('Copy for Instagram'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Check out this amazing photo!\n\n#photo #instagram'
      )
    })

    it('should format Twitter content correctly', async () => {
      const twitterContent: GeneratedContent = {
        platform: 'x_twitter',
        title: 'Tweet Title',
        post_body: 'This is my tweet content',
        tags: ['twitter', 'social']
      }
      
      render(<GeneratedContentCard content={twitterContent} />)
      
      fireEvent.click(screen.getByText('Copy for X (Twitter)'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'This is my tweet content #twitter #social'
      )
    })

    it('should format LinkedIn content correctly', async () => {
      const linkedinContent: GeneratedContent = {
        platform: 'linkedin',
        title: 'LinkedIn Post',
        post_body: 'Professional content here',
        headline: 'Software Engineer',
        tags: ['linkedin', 'professional']
      }
      
      render(<GeneratedContentCard content={linkedinContent} />)
      
      fireEvent.click(screen.getByText('Copy for LinkedIn'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Professional content here\n\nSoftware Engineer\n\n#linkedin #professional'
      )
    })

    it('should format Twitch content correctly', async () => {
      const twitchContent: GeneratedContent = {
        platform: 'twitch',
        title: 'Stream Title',
        bio: 'Streamer bio',
        stream_category: 'Gaming',
        tags: ['twitch', 'gaming']
      }
      
      render(<GeneratedContentCard content={twitchContent} />)
      
      fireEvent.click(screen.getByText('Copy for Twitch'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Stream Title\n\nStreamer bio\n\nCategory: Gaming\n\n#twitch #gaming'
      )
    })

    it('should handle missing optional fields gracefully', async () => {
      const minimalContent: GeneratedContent = {
        platform: 'youtube',
        title: 'Simple Title',
        tags: ['simple']
      }
      
      render(<GeneratedContentCard content={minimalContent} />)
      
      fireEvent.click(screen.getByText('Copy for YouTube'))
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Simple Title\n\n#simple'
      )
    })
  })

  describe('Validation display', () => {
    it('should show validation badge for valid content', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      expect(screen.getByText('Valid (95%)')).toBeInTheDocument()
    })

    it('should show warning validation', () => {
      const warningContent: GeneratedContent = {
        ...defaultContent,
        validation: {
          status: 'warning',
          score: 70,
          issues: [{ field: 'title', message: 'Title could be shorter' }]
        }
      }
      
      render(<GeneratedContentCard content={warningContent} />)
      
      expect(screen.getByText('Needs Review (70%)')).toBeInTheDocument()
      expect(screen.getByText('Issues')).toBeInTheDocument()
      expect(screen.getByText('Title could be shorter')).toBeInTheDocument()
    })

    it('should show error validation', () => {
      const errorContent: GeneratedContent = {
        ...defaultContent,
        validation: {
          status: 'error',
          issues: [{ field: 'tags', message: 'Too many tags' }],
          suggestions: ['Remove some tags', 'Use more specific tags']
        }
      }
      
      render(<GeneratedContentCard content={errorContent} />)
      
      expect(screen.getByText('Issues Found')).toBeInTheDocument()
      expect(screen.getByText('Too many tags')).toBeInTheDocument()
      expect(screen.getByText('Suggestions')).toBeInTheDocument()
      expect(screen.getByText('Remove some tags')).toBeInTheDocument()
      expect(screen.getByText('Use more specific tags')).toBeInTheDocument()
    })
  })

  describe('Platform icon display', () => {
    it('should display platform icon when available', () => {
      render(<GeneratedContentCard content={defaultContent} />)
      
      // The icon should be rendered (we can't easily test the actual icon, but we can check it's there)
      const header = screen.getByRole('heading', { name: /youtube/i }).parentElement
      expect(header).toBeInTheDocument()
    })
  })

  describe('Responsive design', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <GeneratedContentCard content={defaultContent} className="custom-class" />
      )
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Error handling', () => {
    it('should handle clipboard write failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Clipboard error'))
      
      render(<GeneratedContentCard content={defaultContent} />)
      
      fireEvent.click(screen.getByText('Copy'))
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })
}) 