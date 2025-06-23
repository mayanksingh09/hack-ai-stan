import type { GeneratedContent } from '../../components/GeneratedContentCard'

describe('GeneratedContent Interface', () => {
  it('should accept all required fields', () => {
    const minimalContent: GeneratedContent = {
      platform: 'youtube',
      title: 'Test Title',
      tags: ['tag1', 'tag2']
    }

    expect(minimalContent.platform).toBe('youtube')
    expect(minimalContent.title).toBe('Test Title')
    expect(minimalContent.tags).toEqual(['tag1', 'tag2'])
  })

  it('should accept all optional platform-specific fields', () => {
    const fullContent: GeneratedContent = {
      platform: 'youtube',
      title: 'Test Title',
      tags: ['tag1', 'tag2'],
      // Platform-specific fields
      description: 'YouTube description',
      caption: 'Instagram caption',
      post_body: 'LinkedIn post body',
      headline: 'LinkedIn headline',
      bio: 'User bio',
      username: 'testuser',
      profile_name: 'Test User',
      about_section: 'About section content',
      connection_message: 'LinkedIn connection message',
      stream_category: 'Gaming',
      validation: {
        status: 'valid',
        score: 85,
        issues: [{ field: 'title', message: 'Too long' }],
        suggestions: ['Make title shorter']
      }
    }

    // Verify all fields are accessible
    expect(fullContent.description).toBe('YouTube description')
    expect(fullContent.caption).toBe('Instagram caption')
    expect(fullContent.post_body).toBe('LinkedIn post body')
    expect(fullContent.headline).toBe('LinkedIn headline')
    expect(fullContent.bio).toBe('User bio')
    expect(fullContent.username).toBe('testuser')
    expect(fullContent.profile_name).toBe('Test User')
    expect(fullContent.about_section).toBe('About section content')
    expect(fullContent.connection_message).toBe('LinkedIn connection message')
    expect(fullContent.stream_category).toBe('Gaming')
    expect(fullContent.validation?.status).toBe('valid')
    expect(fullContent.validation?.score).toBe(85)
  })

  it('should handle platform-specific content combinations', () => {
    const youtubeContent: GeneratedContent = {
      platform: 'youtube',
      title: 'YouTube Video Title',
      tags: ['gaming', 'tutorial'],
      description: 'This is a YouTube video description',
      username: 'testchannel'
    }

    const instagramContent: GeneratedContent = {
      platform: 'instagram',
      title: 'Instagram Post',
      tags: ['photo', 'lifestyle'],
      caption: 'Check out this amazing photo! #lifestyle',
      username: 'photouser',
      profile_name: 'Photo User'
    }

    const linkedinContent: GeneratedContent = {
      platform: 'linkedin',
      title: 'Professional Update',
      tags: ['business', 'networking'],
      post_body: 'Sharing some professional insights...',
      headline: 'Senior Software Engineer',
      about_section: 'Experienced in full-stack development',
      connection_message: 'Would love to connect!'
    }

    const twitchContent: GeneratedContent = {
      platform: 'twitch',
      title: 'Live Gaming Stream',
      tags: ['gaming', 'live'],
      bio: 'Professional gamer and streamer',
      stream_category: 'Just Chatting',
      username: 'streamergamer'
    }

    // Verify platform-specific fields are properly typed
    expect(youtubeContent.description).toBeDefined()
    expect(instagramContent.caption).toBeDefined()
    expect(linkedinContent.headline).toBeDefined()
    expect(twitchContent.stream_category).toBeDefined()
  })

  it('should handle validation object properly', () => {
    const contentWithValidation: GeneratedContent = {
      platform: 'twitter',
      title: 'Tweet content',
      tags: ['hashtag'],
      validation: {
        status: 'warning',
        score: 65,
        issues: [
          { field: 'title', message: 'Character limit exceeded' },
          { field: 'tags', message: 'Too many hashtags' }
        ],
        suggestions: [
          'Reduce character count',
          'Use fewer hashtags'
        ]
      }
    }

    expect(contentWithValidation.validation?.status).toBe('warning')
    expect(contentWithValidation.validation?.issues).toHaveLength(2)
    expect(contentWithValidation.validation?.suggestions).toHaveLength(2)
    expect(contentWithValidation.validation?.issues?.[0].field).toBe('title')
  })

  it('should type-check platform field as string', () => {
    const content: GeneratedContent = {
      platform: 'custom_platform',
      title: 'Custom Title',
      tags: []
    }

    expect(typeof content.platform).toBe('string')
  })

  it('should type-check tags as string array', () => {
    const content: GeneratedContent = {
      platform: 'youtube',
      title: 'Test',
      tags: ['tag1', 'tag2', 'tag3']
    }

    expect(Array.isArray(content.tags)).toBe(true)
    expect(content.tags.every((tag: string) => typeof tag === 'string')).toBe(true)
  })
}) 