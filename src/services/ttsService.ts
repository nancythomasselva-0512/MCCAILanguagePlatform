import { openaiProvider } from '../providers/openai';
import { elevenlabsProvider } from '../providers/elevenlabs';
import { providerManager } from '../providers/providerManager';

const ttsAudioCache = new Map<string, string>();

export type TTSState = 'idle' | 'playing' | 'paused' | 'error';

export interface TTSOptions {
  onStateChange?: (state: TTSState) => void;
  onWarning?: (message: string) => void;
  openAiApiKey?: string;
  elevenLabsApiKey?: string;
}

class TTSService {
  private state: TTSState = 'idle';
  private options?: TTSOptions;
  private currentChunks: string[] = [];
  private currentChunkIndex: number = 0;
  private langCode: string = 'en-US';
  private langName: string = 'English';
  private currentAudioFallback: HTMLAudioElement | null = null;
  private voicesLoaded: boolean = false;

  private langMap: Record<string, string> = {
    'English': 'en-US',
    'Tamil': 'ta-IN',
    'Hindi': 'hi-IN',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Portuguese': 'pt-PT',
    'Arabic': 'ar-SA',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Chinese (Simplified)': 'zh-CN',
    'Russian': 'ru-RU',
    'Italian': 'it-IT',
    'Dutch': 'nl-NL',
    'Polish': 'pl-PL',
    'Turkish': 'tr-TR',
    'Vietnamese': 'vi-VN',
    'Thai': 'th-TH',
    'Indonesian': 'id-ID',
    'Bengali': 'bn-IN',
    'Urdu': 'ur-PK',
    'Swahili': 'sw-KE'
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.refreshVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.refreshVoices();
      };
    }
  }

  private refreshVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
    }
    return voices;
  }

  private setState(newState: TTSState) {
    console.log(`TTS State changed: ${this.state} -> ${newState}`);
    this.state = newState;
    if (this.options?.onStateChange) {
      this.options.onStateChange(newState);
    }
  }

  private async ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = this.refreshVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      
      console.log("TTS: Waiting for onvoiceschanged before selecting a voice...");
      window.speechSynthesis.onvoiceschanged = () => {
        voices = this.refreshVoices();
        console.log(`TTS: onvoiceschanged fired. Loaded ${voices.length} voices.`);
        resolve(voices);
      };
      
      // Fallback timeout in case onvoiceschanged never fires
      setTimeout(() => {
        voices = this.refreshVoices();
        console.log(`TTS: Timeout reached. Loaded ${voices.length} voices.`);
        resolve(voices);
      }, 1000);
    });
  }

  public async play(text: string, langName: string, options?: TTSOptions) {
    this.stop(); // Clean up anything currently running
    this.options = options;
    
    // Auto Detect uses English as a fallback if detected language isn't passed properly
    this.langName = langName === 'Auto Detect' ? 'English' : langName;
    this.langCode = this.langMap[this.langName] || 'en-US';

    if (!text.trim()) {
      this.setState('idle');
      return;
    }

    // Split long text into chunks by sentence endings to prevent speech engine from cutting out
    const sentenceChunks = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
    
    // Further split chunks that are too long (e.g., > 200 chars)
    this.currentChunks = sentenceChunks.flatMap(chunk => {
      if (chunk.length <= 200) return [chunk];
      return chunk.match(/.{1,200}(\s|$)/g) || [chunk];
    }).map(c => c.trim()).filter(Boolean);

    this.currentChunkIndex = 0;
    this.setState('playing');
    await this.speakNextChunk();
  }

  public pause() {
    if (this.state === 'playing') {
      if (this.currentAudioFallback) {
        this.currentAudioFallback.pause();
      } else {
        window.speechSynthesis.pause();
      }
      this.setState('paused');
    }
  }

  public resume() {
    if (this.state === 'paused') {
      if (this.currentAudioFallback) {
        this.currentAudioFallback.play();
      } else {
        window.speechSynthesis.resume();
      }
      this.setState('playing');
    }
  }

  public stop() {
    window.speechSynthesis.cancel();
    if (this.currentAudioFallback) {
      this.currentAudioFallback.pause();
      this.currentAudioFallback.currentTime = 0;
      this.currentAudioFallback = null;
    }
    this.currentChunks = [];
    this.currentChunkIndex = 0;
    if (this.state !== 'idle') {
      this.setState('idle');
    }
  }

  private async speakNextChunk() {
    if (this.currentChunkIndex >= this.currentChunks.length) {
      console.log("TTS: Finished all chunks.");
      this.setState('idle');
      return;
    }

    const chunk = this.currentChunks[this.currentChunkIndex];
    console.log(`TTS: speakNextChunk index ${this.currentChunkIndex}/${this.currentChunks.length}. Lang requested: ${this.langCode}`);
    
    // 1. Reload all available SpeechSynthesis voices
    // 2. Wait for speechSynthesis.onvoiceschanged before selecting a voice
    // 3. Refresh the voice list using speechSynthesis.getVoices()
    const voices = await this.ensureVoicesLoaded();
    const baseLang = this.langCode.split('-')[0];

    // 7. Log Total voices available
    console.log(`TTS: Total voices available: ${voices.length}`);

    let voice: SpeechSynthesisVoice | undefined;

    if (baseLang === 'ta') {
      // 4. When the selected language is Tamil: Automatically select the best available ta-IN voice. Do not use any English voice.
      // 5. Verify that the selected voice language starts with: ta
      const tamilVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith('ta') || 
        v.name.toLowerCase().includes('tamil')
      );
      console.log(`TTS: Tamil voices found: ${tamilVoices.length}`);
      
      if (tamilVoices.length > 0) {
        // 9. If multiple Tamil voices exist, automatically select the highest quality voice.
        // Google voices are typically higher quality, then Microsoft. Also check localService if possible.
        voice = tamilVoices.find(v => v.name.includes('Google') || (!v.localService)) 
             || tamilVoices.find(v => v.name.includes('Microsoft')) 
             || tamilVoices[0];
             
        console.log(`TTS: Selected Tamil voice: "${voice.name}"`);
        console.log(`TTS: Voice language: ${voice.lang}`);
        // 8. If a Tamil voice is found, disable the fallback warning: "No native voice found for Tamil."
        // (This happens automatically because voice is defined and isFallback is false)
      }
    } else {
      // 13. Ensure the same implementation works for all supported languages
      // Exact match
      voice = voices.find(v => v.lang === this.langCode);
      
      // Base language match
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(baseLang));
      }

      // Name match
      if (!voice) {
        voice = voices.find(v => v.name.toLowerCase().includes(this.langName.toLowerCase()));
      }
      
      if (voice) {
        console.log(`TTS: Selected native voice: "${voice.name}"`);
        console.log(`TTS: Voice language: ${voice.lang}`);
      }
    }

    if (!voice && baseLang !== 'ta') {
      console.log(`TTS: No native voice found for ${this.langCode} (${this.langName}).`);
    }

    // 6. If a Tamil voice exists, always use it instead of the online fallback.
    let isFallback = false;
    if (!voice) {
      isFallback = true;
    }

    if (isFallback) {
      console.log(`TTS: Native voice found: false`);
      console.log(`TTS: Trying online provider failover loop...`);
      
      if (this.currentChunkIndex === 0 && this.options?.onWarning) {
        this.options.onWarning(`Using cloud ${this.langName} voice.`);
      }

      const cacheKey = `${this.langCode}_${chunk}`;
      let audioUrl = "";

      if (ttsAudioCache.has(cacheKey)) {
        audioUrl = ttsAudioCache.get(cacheKey)!;
        console.log(`TTS: Cache Hit! Reusing previously generated audio for chunk.`);
      } else {
        // Priority 0: Free Google TTS Fallback for Tamil
        if (baseLang === 'ta') {
          console.log(`TTS: Using Free Google TTS fallback for Tamil`);
          audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(chunk.substring(0, 200))}`;
          ttsAudioCache.set(cacheKey, audioUrl);
        }

        const errors: string[] = [];
        
        // Priority 1: Backend TTS (Proxy to OpenAI)
        if (!audioUrl) {
          try {
          console.log(`TTS: Sending request... [Provider: Backend / OpenAI]`);
          audioUrl = await providerManager.synthesizeSpeech(chunk, 'alloy');
          console.log(`TTS: Response received... [Provider: Backend / OpenAI]`);
          ttsAudioCache.set(cacheKey, audioUrl);
          console.log(`TTS: Audio URL created & cached.`);
        } catch (e: any) {
          console.error(`TTS: Provider Backend failed:`, e.message);
          errors.push(`Backend: ${e.message}`);
        }

        // Priority 2: ElevenLabs
        if (!audioUrl) {
          try {
             console.log(`TTS: Sending request... [Provider: ElevenLabs]`);
             audioUrl = await elevenlabsProvider.synthesizeSpeech(chunk, '21m00Tcm4TlvDq8ikWAM', this.options?.elevenLabsApiKey);
             console.log(`TTS: Response received... [Provider: ElevenLabs]`);
             ttsAudioCache.set(cacheKey, audioUrl);
             console.log(`TTS: Audio URL created & cached.`);
          } catch(e: any) {
             console.error(`TTS: Provider ElevenLabs failed:`, e.message);
             errors.push(`ElevenLabs: ${e.message}`);
          }
        }
        
        }
        
        if (!audioUrl) {
          const finalErrorMsg = errors.join(" | ");
          console.error(`TTS: All configured online fallback providers failed. Errors: ${finalErrorMsg}`);
          if (this.options?.onWarning) {
            this.options.onWarning(`Online TTS Providers Failed. ${finalErrorMsg}`);
          }
          this.setState('error');
          return;
        }
      }

      this.currentAudioFallback = new Audio(audioUrl);
      
      this.currentAudioFallback.onplay = () => {
        // 7. Log Speech started
        console.log(`TTS: Speech started [Online Fallback]`);
      };

      this.currentAudioFallback.onended = () => {
        // 7. Log Speech ended
        console.log(`TTS: Speech ended [Online Fallback]`);
        console.log(`TTS: Online chunk finished.`);
        this.currentAudioFallback = null;
        this.currentChunkIndex++;
        this.speakNextChunk();
      };
      
      this.currentAudioFallback.onerror = (e) => {
        // 7. Log Any speech errors
        console.error("TTS: Any speech errors: Audio Playback Error:", e);
        if (this.options?.onWarning) {
          this.options.onWarning("Browser failed to decode or play the audio stream. Invalid audio format.");
        }
        this.currentAudioFallback = null;
        this.setState('error');
      };
      
      try {
        console.log(`TTS: Playback started...`);
        await this.currentAudioFallback.play();
        console.log(`TTS: Audio playback confirmed active by browser.`);
        return;
      } catch (e: any) {
        console.error(`TTS: Any speech errors: Play promise rejected by browser:`, e.message);
        if (this.options?.onWarning) {
          this.options.onWarning(`Audio playback blocked by browser: ${e.message}`);
        }
        this.setState('error');
        return;
      }
    }

    // 10. Ensure the Listen button correctly reads complete Tamil Unicode text
    const utt = new SpeechSynthesisUtterance(chunk);
    utt.lang = this.langCode;
    if (voice) {
      utt.voice = voice;
      // explicitly enforce language for the utterance to match the native voice if needed
      if (baseLang === 'ta') {
        utt.lang = voice.lang || 'ta-IN';
      }
    }

    utt.onstart = () => {
      // 7. Log Speech started
      console.log(`TTS: Speech started [Native]`);
    };

    utt.onend = () => {
      // 7. Log Speech ended
      console.log(`TTS: Speech ended [Native]`);
      console.log(`TTS: Native chunk finished.`);
      this.currentChunkIndex++;
      this.speakNextChunk();
    };

    utt.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        // 7. Log Any speech errors
        console.error("TTS: Any speech errors: SpeechSynthesis Error:", e);
        if (this.options?.onWarning) {
          this.options.onWarning(`Audio playback encountered an error: ${e.error}`);
        }
        this.setState('error');
      } else {
        console.log(`TTS: Speech ${e.error} [Native]`);
      }
    };

    console.log(`TTS: Playing native speech chunk: "${chunk.substring(0, 30)}..."`);
    window.speechSynthesis.speak(utt);
  }

  public getState(): TTSState {
    return this.state;
  }
}

export const ttsService = new TTSService();

