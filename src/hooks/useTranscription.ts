import { useState, useEffect, useCallback } from 'react'

interface TranscriptionState {
  transcript: string | null
  loading: boolean
  error: string | null
}

interface TranscriptionResponse {
  transcript: string
}

export const useTranscription = (videoUrl?: string) => {
  const [state, setState] = useState<TranscriptionState>({
    transcript: null,
    loading: false,
    error: null,
  })

  const requestTranscription = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/v1/transcribe', {
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
  }, [])

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