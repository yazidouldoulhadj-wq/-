/**
 * Service for generating and handling AI voice messages.
 * Integrates with the server-side Gemini 3.8 Flash Lite TTS endpoint
 * and provides client-side Web Speech synthesis fallback.
 */

export interface GenerateVoiceParams {
  text: string;
  lang: 'ar' | 'fr';
  voiceName?: 'Kore' | 'Fenrir' | 'Puck' | 'Zephyr' | 'Charon';
  style?: string;
}

export interface GenerateVoiceResult {
  success: boolean;
  audioDataUrl?: string;
  mimeType?: string;
  provider: 'gemini-tts' | 'web-speech' | 'fallback';
  error?: string;
}

export async function generateAIVoice({
  text,
  lang,
  voiceName = 'Kore',
  style,
}: GenerateVoiceParams): Promise<GenerateVoiceResult> {
  try {
    // 1. First attempt to call the backend Gemini TTS API endpoint
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        lang,
        voiceName,
        style,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audioDataUrl) {
        return {
          success: true,
          audioDataUrl: data.audioDataUrl,
          mimeType: data.mimeType || 'audio/wav',
          provider: 'gemini-tts',
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini TTS unavailable, trying Web Speech / audio fallback:', err);
  }

  // 2. Client-side Web Speech fallback if server endpoint is offline or no API key
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'fr' ? 'fr-FR' : 'ar-SA';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        // Try to match appropriate voice
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find((v) =>
          lang === 'fr' ? v.lang.startsWith('fr') : v.lang.startsWith('ar')
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        utterance.onend = () => {
          resolve({
            success: true,
            provider: 'web-speech',
          });
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          resolve({
            success: true,
            provider: 'fallback',
          });
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve({
          success: true,
          provider: 'fallback',
        });
      }
    });
  }

  return {
    success: false,
    error: 'Audio generation failed',
    provider: 'fallback',
  };
}

/**
 * Play an audio element or data URL safely with user-gesture resilience
 */
export function playVoiceSafely(
  src: string,
  volume = 0.9,
  onEnded?: () => void
): HTMLAudioElement {
  const audio = new Audio(src);
  audio.volume = Math.max(0, Math.min(1, volume));
  if (onEnded) {
    audio.onended = onEnded;
  }
  audio.play().catch((err) => {
    console.log('Audio autoplay prevented or audio load error:', err);
  });
  return audio;
}
