import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface TranscriptionState {
  transcript: string | null
  loading: boolean
  error: string | null
}

interface TranscriptionResponse {
  text?: string | null
  transcript?: string | null
  language_code?: string
  language_probability?: number
  words?: Array<any>
  additional_formats?: any
}

interface TranscriptRecord {
  id?: number
  video_url: string
  transcript: string
  created_at?: string
}

export const useTranscription = (videoUrl?: string) => {
  const [state, setState] = useState<TranscriptionState>({
    transcript: null,
    loading: false,
    error: null,
  })

  // Check if transcript already exists in Supabase
  const getExistingTranscript = useCallback(async (url: string): Promise<string | null> => {
    try {
      console.log('Checking for existing transcript for URL:', url)
      const { data, error } = await supabase
        .from('transcripts')
        .select('transcript')
        .eq('video_url', url)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking for existing transcript:', error)
        return null
      }

      if (data?.transcript) {
        console.log('Found existing transcript in database')
        return data.transcript
      }
      
      console.log('No existing transcript found')
      return null
    } catch (error) {
      console.error('Error checking for existing transcript:', error)
      return null
    }
  }, [])

  // Save transcript to Supabase
  const saveTranscript = useCallback(async (url: string, transcript: string): Promise<void> => {
    try {
      console.log('Saving transcript to database for URL:', url)
      
      // Validate inputs before saving
      if (!url || url.trim() === '') {
        throw new Error('Video URL is required to save transcript')
      }
      
      if (!transcript || transcript.trim() === '') {
        throw new Error('Transcript content is required and cannot be empty')
      }
      
      const { error } = await supabase
        .from('transcripts')
        .insert({
          video_url: url.trim(),
          transcript: transcript.trim(),
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving transcript:', error)
        throw new Error(`Failed to save transcript: ${error.message}`)
      }
      
      console.log('Transcript saved successfully to database')
    } catch (error) {
      console.error('Error saving transcript:', error)
      throw error
    }
  }, [])

  const requestTranscription = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // First, check if we already have a transcript for this video
      const existingTranscript = await getExistingTranscript(url)
      
      if (existingTranscript) {
        setState({
          transcript: existingTranscript,
          loading: false,
          error: null,
        })
        return
      }

      // If no existing transcript, call the API
      console.log('Requesting new transcription from API for URL:', url)
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
      const transcribeEndpoint = `${fastApiUrl}/api/v1/transcribe`
      
      const response = await fetch(transcribeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_url: url }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Transcription API error response:', errorText)
        throw new Error(`Transcription failed: ${response.statusText}`)
      }

      let data: TranscriptionResponse
      try {
        data = await response.json()
        console.log('Full API response:', data)
        console.log('Received response from API:', { 
          hasText: !!data.text, 
          textLength: data.text?.length,
          hasTranscript: !!data.transcript, 
          transcriptLength: data.transcript?.length,
          languageCode: data.language_code
        })
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError)
        throw new Error('Invalid response format from transcription API')
      }
      
      // Extract transcript from either 'text' or 'transcript' field
      const transcriptText = data.text || data.transcript
      
      // Validate that we actually received a transcript
      if (!transcriptText || typeof transcriptText !== 'string' || transcriptText.trim() === '') {
        console.error('Transcript validation failed:', { 
          text: data.text,
          transcript: data.transcript, 
          textType: typeof data.text,
          transcriptType: typeof data.transcript,
          fullResponse: data 
        })
        throw new Error('Transcription API returned empty or null transcript. Please check your video file and try again.')
      }
      
      // At this point, transcriptText is guaranteed to be a non-empty string
      const validTranscript = transcriptText.trim()
      
      // Save the new transcript to Supabase only if it's valid
      try {
        await saveTranscript(url, validTranscript)
        console.log('Transcript saved to database successfully')
      } catch (saveError) {
        console.warn('Failed to save transcript to database, but continuing with transcription:', saveError)
        // Don't throw the save error - we still want to show the transcript even if saving fails
      }
      
      setState({
        transcript: validTranscript,
        loading: false,
        error: null,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe video'
      console.error('Transcription error:', errorMessage)
      setState({
        transcript: null,
        loading: false,
        error: errorMessage,
      })
    }
  }, [getExistingTranscript, saveTranscript])

  useEffect(() => {
    if (videoUrl) {
      requestTranscription(videoUrl)
    }
  }, [videoUrl, requestTranscription])

  const retry = useCallback(() => {
    if (videoUrl) {
      requestTranscription(videoUrl)
    }
  }, [videoUrl, requestTranscription])

  return {
    transcript: state.transcript,
    loading: state.loading,
    error: state.error,
    retry,
  }
} 