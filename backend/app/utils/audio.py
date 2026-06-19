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

def transcribe_local_audio(audio_bytes: bytes, filename: str, model: str = "base", language: str = None):
    ext = filename.split(".")[-1].lower() if "." in filename else "wav"
    if ext not in ["mp3", "wav", "m4a", "ogg", "flac", "aac", "webm", "opus"]:
        # Fallback if unknown or unsupported
        ext = "wav"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
        temp_file.write(audio_bytes)
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
        
        return {
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
