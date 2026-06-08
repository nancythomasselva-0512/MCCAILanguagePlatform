import { pipeline, env } from '@xenova/transformers';

// Set environment config to fetch models from Hugging Face CDN (since local caching inside the app isn't needed)
env.allowLocalModels = false;

// Global transcriber cache
let transcriberInstance: any = null;
let transcriberLoading = false;

export interface TranscribeProgressData {
  progress: number;
  status: 'downloading' | 'loading' | 'ready';
  file?: string;
}

export type ProgressCallback = (data: TranscribeProgressData) => void;

/**
 * Lazy loads and caches the whisper-tiny automatic-speech-recognition pipeline.
 */
export async function getTranscriber(onProgress?: ProgressCallback): Promise<any> {
  if (transcriberInstance) {
    if (onProgress) onProgress({ progress: 100, status: 'ready' });
    return transcriberInstance;
  }

  // Prevent double-loading issues
  if (transcriberLoading) {
    while (transcriberLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (transcriberInstance) {
      if (onProgress) onProgress({ progress: 100, status: 'ready' });
      return transcriberInstance;
    }
  }

  transcriberLoading = true;
  try {
    transcriberInstance = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
      progress_callback: (data: any) => {
        if (data.status === 'progress') {
          if (onProgress) {
            onProgress({
              progress: Math.round(data.progress || 0),
              status: 'downloading',
              file: data.file
            });
          }
        } else if (data.status === 'ready') {
          if (onProgress) {
            onProgress({ progress: 100, status: 'ready' });
          }
        }
      }
    });
    return transcriberInstance;
  } finally {
    transcriberLoading = false;
  }
}

/**
 * Decodes any browser-supported audio file (MP3, WAV, M4A, OGG, FLAC)
 * and resamples it to 16,000Hz mono Float32Array (which Whisper models expect).
 */
export async function decodeAudioFile(file: File): Promise<Float32Array> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Decode audio data into an AudioBuffer
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    // Create an OfflineAudioContext to perform offline resampling to 16kHz mono
    const targetSampleRate = 16000;
    const offlineCtx = new OfflineAudioContext(
      1, // mono channel
      Math.round(audioBuffer.duration * targetSampleRate),
      targetSampleRate
    );
    
    // Connect source to OfflineAudioContext destination
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    
    // Perform decoding/rendering
    const renderedBuffer = await offlineCtx.startRendering();
    return renderedBuffer.getChannelData(0);
  } finally {
    // Ensure standard context is closed to free up hardware resources
    if (audioCtx.state !== 'closed') {
      await audioCtx.close();
    }
  }
}
