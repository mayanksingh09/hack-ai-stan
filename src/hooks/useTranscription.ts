import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface TranscriptionState {
  transcript: string | null
  loading: boolean
  error: string | null
}

interface TranscriptionResponse {
  transcript: string
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
      const { data, error } = await supabase
        .from('transcripts')
        .select('transcript')
        .eq('video_url', url)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.warn('Error checking for existing transcript:', error)
        return null
      }

      return data?.transcript || null
    } catch (error) {
      console.warn('Error checking for existing transcript:', error)
      return null
    }
  }, [])

  // Save transcript to Supabase
  const saveTranscript = useCallback(async (url: string, transcript: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('transcripts')
        .insert({
          video_url: url,
          transcript: transcript,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.warn('Error saving transcript:', error)
      }
    } catch (error) {
      console.warn('Error saving transcript:', error)
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
        throw new Error(`Transcription failed: ${response.statusText}`)
      }

      const data: TranscriptionResponse = await response.json()
      
      // Save the new transcript to Supabase
      await saveTranscript(url, data.transcript)
      
      setState({
        transcript: data.transcript,
        loading: false,
        error: null,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe video'
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