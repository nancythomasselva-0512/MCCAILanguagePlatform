import os
import tempfile
import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("faster-whisper-backend")

app = FastAPI(title="Faster-Whisper Transcription API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model cache to avoid reloading on every request
model_cache = {}

def get_model(model_size: str = "base", device: str = "cpu", compute_type: str = "int8"):
    key = (model_size, device, compute_type)
    if key not in model_cache:
        logger.info(f"Loading Whisper model '{model_size}' on {device} ({compute_type})...")
        # download and load the model
        model_cache[key] = WhisperModel(model_size, device=device, compute_type=compute_type)
        logger.info("Model loaded successfully.")
    return model_cache[key]

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "faster-whisper"}

@app.post("/api/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    model: str = Form("base"),
    language: str = Form(None),
):
    filename = file.filename or "audio.mp3"
    logger.info(f"Received transcription request for file: {filename}, model: {model}, language: {language}")
    
    ext = filename.split(".")[-1].lower()
    if ext not in ["mp3", "wav", "m4a", "ogg", "flac", "aac", "webm", "opus"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")
    
    # Save uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # Load model (use CPU and int8 for best speed and memory usage on standard devices)
        whisper_model = get_model(model_size=model, device="cpu", compute_type="int8")
        
        # Determine language parameter
        lang_arg = None if (not language or language.lower() in ["auto", "auto-detect", ""]) else language
        
        logger.info(f"Starting transcription for {temp_path} (language: {lang_arg or 'auto-detect'})...")
        segments, info = whisper_model.transcribe(
            temp_path,
            beam_size=5,
            language=lang_arg,
            word_timestamps=False
        )
        
        # segments is a generator, so we must iterate it to actually trigger transcription
        segment_list = []
        for segment in segments:
            # Format timestamp as MM:SS
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
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
        
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as e:
                logger.warning(f"Failed to delete temp file {temp_path}: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
