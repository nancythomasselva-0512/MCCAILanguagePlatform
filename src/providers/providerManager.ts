import { apiRequest } from '../utils/api';

export const providerManager = {
  /**
   * Synthesize text to speech via FastAPI SaaS tool proxy
   */
  async synthesizeSpeech(
    text: string,
    voice: string,
    provider: string,
    _openAiKey?: string,
    _elevenLabsKey?: string
  ): Promise<string> {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("voice", voice);
    formData.append("provider", provider);

    const data = await apiRequest("/tools/synthesize", {
      method: "POST",
      body: formData,
    });
    
    // Fallback stream playback URL or simulated synthesized sound
    return data.audio_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  },

  /**
   * Transcribe uploaded audio file via FastAPI SaaS tool proxy
   */
  async transcribeAudio(
    file: File,
    provider: string,
    _openAiKey?: string,
    _deepgramKey?: string,
    language = 'en'
  ): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("provider", provider);
    formData.append("language", language);

    const data = await apiRequest("/tools/transcribe", {
      method: "POST",
      body: formData,
    });

    return data.text || "";
  },

  /**
   * Real-time Voice Recording / Transcription (with failover handled in FastAPI backend)
   */
  async transcribeVoice(
    file: File,
    provider: string,
    _openAiKey?: string,
    _deepgramKey?: string,
    language = 'en-US',
    _onFailover?: (newProvider: string) => void
  ): Promise<{ text: string; finalProvider: string }> {
    const langCode = language.split('-')[0];
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("provider", provider);
    formData.append("language", langCode);

    const data = await apiRequest("/tools/transcribe", {
      method: "POST",
      body: formData,
    });

    return {
      text: data.text || "",
      finalProvider: data.provider || "openai"
    };
  },

  /**
   * Translate text via FastAPI SaaS tool proxy
   */
  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string,
    provider: string,
    _openAiKey?: string,
    _deepLKey?: string
  ): Promise<{ text: string; detectedLang?: string }> {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("source_lang", sourceLang);
    formData.append("target_lang", targetLang);
    formData.append("provider", provider);

    const data = await apiRequest("/tools/translate", {
      method: "POST",
      body: formData,
    });

    return {
      text: data.text || "",
      detectedLang: data.detected_lang || ""
    };
  }
};
