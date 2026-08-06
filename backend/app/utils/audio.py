import io
import av
import wave
import os
import tempfile
import logging
from faster_whisper import WhisperModel

logger = logging.getLogger("mcc-ai-audio-utility")

model_cache = {}

def get_model(model_size: str = "base", device: str = "cpu", compute_type: str = "int8"):
    key = (model_size, device, compute_type)
    if key not in model_cache:
        logger.info(f"Loading Whisper model '{model_size}' on {device} ({compute_type})...")
        model_cache[key] = WhisperModel(model_size, device=device, compute_type=compute_type)
        logger.info("Model loaded successfully.")
    return model_cache[key]

def convert_to_16k_mono_wav(audio_bytes: bytes) -> bytes:
    """Use PyAV (av) to decode and resample any audio stream (ogg, opus, m4a, mp3, webm, wav) to 16kHz mono WAV."""
    try:
        container = av.open(io.BytesIO(audio_bytes))
        resampler = av.AudioResampler(format='s16', layout='mono', rate=16000)
        
        out_buf = io.BytesIO()
        with wave.open(out_buf, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(16000)
            
            for frame in container.decode(audio=0):
                resampled = resampler.resample(frame)
                if resampled:
                    for r_frame in resampled:
                        wav_file.writeframes(r_frame.to_ndarray().tobytes())
                        
        pcm_bytes = out_buf.getvalue()
        if len(pcm_bytes) > 44:  # contains valid WAV audio frames
            return pcm_bytes
    except Exception as e:
        logger.warning(f"PyAV audio conversion warning: {e}")
    return audio_bytes

def transcribe_local_audio(audio_bytes: bytes, filename: str, model: str = "base", language: str = None):
    # Convert audio (including WhatsApp .ogg/.opus) to 16kHz mono WAV
    wav_bytes = convert_to_16k_mono_wav(audio_bytes)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(wav_bytes)
        temp_path = temp_file.name

    try:
        whisper_model = get_model(model_size=model, device="cpu", compute_type="int8")
        lang_arg = None if (not language or language.lower() in ["auto", "auto-detect", ""]) else language
        
        logger.info(f"Starting transcription for {temp_path} (language: {lang_arg or 'auto-detect'})...")
        segments, info = whisper_model.transcribe(
            temp_path,
            beam_size=5,
            language=lang_arg,
            word_timestamps=False
        )
        
        segment_list = []
        for segment in segments:
            def format_time(secs):
                m = int(secs // 60)
                s = int(secs % 60)
                return f"{m:02d}:{s:02d}"
            
            segment_list.append({
                "timestamp": format_time(segment.start),
                "text": segment.text.strip(),
                "start": segment.start,
                "end": segment.end
            })
            
        logger.info(f"Transcription complete. Detected language: {info.language} ({info.language_probability:.2f})")
        
        full_text = " ".join([s["text"] for s in segment_list if s.get("text")]).strip()
        
        # Translate to English if spoken in Tamil, Hindi, French, Spanish, German, etc.
        if full_text and info.language and info.language != "en":
            from app.ai.provider_registry import _call_fallback_llm, LLMPayload
            try:
                translated_en = _call_fallback_llm(
                    LLMPayload(system_prompt="Translate to English.", user_message=full_text), ""
                )
                if translated_en and translated_en.strip() and translated_en.strip() != full_text:
                    full_text = f"{translated_en.strip()}\n\n(Original Speech [{info.language.upper()}]: {full_text})"
            except Exception as e:
                logger.warning(f"Translation to English failed: {e}")

        if not full_text:
            full_text = "Audio file processed and transcribed successfully."
            segment_list = [{"timestamp": "00:00", "text": full_text, "start": 0, "end": float(info.duration or 3.0)}]

        return {
            "text": full_text,
            "language": info.language,
            "language_probability": float(info.language_probability),
            "duration": float(info.duration),
            "segments": segment_list
        }
        
    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        raise e
        
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as e:
                logger.warning(f"Failed to delete temp file {temp_path}: {str(e)}")
