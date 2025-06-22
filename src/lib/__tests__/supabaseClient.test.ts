import { createClient } from '@supabase/supabase-js'

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear any existing environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  afterEach(() => {
    // Clean up modules to ensure fresh imports
    jest.resetModules()
  })

  it('should initialize client with correct environment variables', async () => {
    // Set up environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    // Mock the client creation
    const mockClient = { from: jest.fn() }
    mockCreateClient.mockReturnValue(mockClient as unknown as ReturnType<typeof createClient>)

    // Import the client (this will execute the initialization)
    await import('../supabaseClient')

    // Verify that createClient was called with correct parameters
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })

  it('should throw error when SUPABASE_URL is missing', async () => {
    // Set only the anon key
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    // Import should throw an error
    await expect(async () => {
      await import('../supabaseClient')
    }).rejects.toThrow('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  })

  it('should throw error when SUPABASE_ANON_KEY is missing', async () => {
    // Set only the URL
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'

    // Import should throw an error
    await expect(async () => {
      await import('../supabaseClient')
    }).rejects.toThrow('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('should throw error when both environment variables are missing', async () => {
    // Import should throw an error for missing URL first
    await expect(async () => {
      await import('../supabaseClient')
    }).rejects.toThrow('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  })
}) 