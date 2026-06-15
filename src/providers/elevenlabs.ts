/**
 * ElevenLabs API client wrapper
 */

export const elevenlabsProvider = {
  /**
   * Synthesize text to speech using ElevenLabs API
   */
  async synthesizeSpeech(text: string, voice = '21m00Tcm4TlvDq8ikWAM', apiKey?: string): Promise<string> {
    if (apiKey) {
      // Default ElevenLabs voice ID if generic string passed
      const voiceId = voice.length > 8 ? voice : '21m00Tcm4TlvDq8ikWAM'; 
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs synthesis failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    // High-fidelity fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In demo mode, we will synthesize using the browser's SpeechSynthesis and return a placeholder/alert.
    // We can trigger SpeechSynthesis.speak directly to make sound in the browser!
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    
    // Return a mock object URL or return a generic sound wave blob
    return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA';
  }
};
