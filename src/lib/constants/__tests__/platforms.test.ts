import { PLATFORMS, type Platform } from '../platforms'
import { 
  SiYoutube, 
  SiInstagram, 
  SiFacebook, 
  SiLinkedin, 
  SiTwitch,
  SiTiktok,
  SiX
} from 'react-icons/si'

describe('Platform Constants', () => {
  it('should have exactly 7 platforms', () => {
    expect(PLATFORMS).toHaveLength(7)
  })

  it('should contain all required platforms', () => {
    const platformIds = PLATFORMS.map(platform => platform.id)
    
    expect(platformIds).toContain('youtube')
    expect(platformIds).toContain('instagram')
    expect(platformIds).toContain('tiktok')
    expect(platformIds).toContain('facebook')
    expect(platformIds).toContain('linkedin')
    expect(platformIds).toContain('twitch')
    expect(platformIds).toContain('x_twitter')
  })

  it('should have correct platform structure', () => {
    PLATFORMS.forEach(platform => {
      expect(platform).toHaveProperty('id')
      expect(platform).toHaveProperty('label')
      expect(platform).toHaveProperty('icon')
      expect(typeof platform.id).toBe('string')
      expect(typeof platform.label).toBe('string')
      expect(typeof platform.icon).toBe('function')
    })
  })

  it('should have correct YouTube platform configuration', () => {
    const youtube = PLATFORMS.find(p => p.id === 'youtube')
    expect(youtube).toBeDefined()
    expect(youtube?.label).toBe('YouTube')
    expect(youtube?.icon).toBe(SiYoutube)
  })

  it('should have correct Instagram platform configuration', () => {
    const instagram = PLATFORMS.find(p => p.id === 'instagram')
    expect(instagram).toBeDefined()
    expect(instagram?.label).toBe('Instagram')
    expect(instagram?.icon).toBe(SiInstagram)
  })

  it('should have correct TikTok platform configuration', () => {
    const tiktok = PLATFORMS.find(p => p.id === 'tiktok')
    expect(tiktok).toBeDefined()
    expect(tiktok?.label).toBe('TikTok')
    expect(tiktok?.icon).toBe(SiTiktok)
  })

  it('should have correct Facebook platform configuration', () => {
    const facebook = PLATFORMS.find(p => p.id === 'facebook')
    expect(facebook).toBeDefined()
    expect(facebook?.label).toBe('Facebook')
    expect(facebook?.icon).toBe(SiFacebook)
  })

  it('should have correct LinkedIn platform configuration', () => {
    const linkedin = PLATFORMS.find(p => p.id === 'linkedin')
    expect(linkedin).toBeDefined()
    expect(linkedin?.label).toBe('LinkedIn')
    expect(linkedin?.icon).toBe(SiLinkedin)
  })

  it('should have correct Twitch platform configuration', () => {
    const twitch = PLATFORMS.find(p => p.id === 'twitch')
    expect(twitch).toBeDefined()
    expect(twitch?.label).toBe('Twitch')
    expect(twitch?.icon).toBe(SiTwitch)
  })

  it('should have correct X (Twitter) platform configuration', () => {
    const xTwitter = PLATFORMS.find(p => p.id === 'x_twitter')
    expect(xTwitter).toBeDefined()
    expect(xTwitter?.label).toBe('X (Twitter)')
    expect(xTwitter?.icon).toBe(SiX)
  })

  it('should have unique platform IDs', () => {
    const platformIds = PLATFORMS.map(platform => platform.id)
    const uniqueIds = [...new Set(platformIds)]
    expect(platformIds).toHaveLength(uniqueIds.length)
  })

  it('should have unique platform labels', () => {
    const platformLabels = PLATFORMS.map(platform => platform.label)
    const uniqueLabels = [...new Set(platformLabels)]
    expect(platformLabels).toHaveLength(uniqueLabels.length)
  })

  it('should export Platform type correctly', () => {
    // Type test - this will fail at compile time if the type is incorrect
    const testPlatform: Platform = {
      id: 'test',
      label: 'Test',
      icon: SiYoutube
    }

    expect(testPlatform.id).toBe('test')
    expect(testPlatform.label).toBe('Test')
    expect(testPlatform.icon).toBe(SiYoutube)
  })

  it('should match expected platform order', () => {
    const expectedOrder = [
      'youtube',
      'instagram', 
      'tiktok',
      'facebook',
      'linkedin',
      'twitch',
      'x_twitter'
    ]

    const actualOrder = PLATFORMS.map(p => p.id)
    expect(actualOrder).toEqual(expectedOrder)
  })
}) 