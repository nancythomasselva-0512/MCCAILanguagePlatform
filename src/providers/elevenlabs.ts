/**
 * ElevenLabs API client wrapper
 */

export const elevenlabsProvider = {
  /**
   * Synthesize text to speech using ElevenLabs API
   */
  async synthesizeSpeech(text: string, voice = '21m00Tcm4TlvDq8ikWAM', apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error("ElevenLabs API key missing");
    }

    try {
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
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(`ElevenLabs synthesis failed: ${errData?.detail?.message || response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
};
