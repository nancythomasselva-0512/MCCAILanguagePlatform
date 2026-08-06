# start_backend.ps1
# Setup virtual environment and run the Faster-Whisper FastAPI server

$pythonExe = "C:\Users\Praveen N\AppData\Local\Programs\Python\Python311\python.exe"

if (!(Test-Path $pythonExe)) {
    $pythonExe = "python"
}

# Ensure Gyan.FFmpeg is in the path for this session
$ffmpegPath = "C:\Users\Praveen N\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
if (Test-Path $ffmpegPath) {
    $env:Path = "$ffmpegPath;$env:Path"
    Write-Host "Added FFmpeg to environment path: $ffmpegPath"
} else {
    Write-Host "FFmpeg path not found, relying on system PATH."
}

# Ensure we are in the backend directory
Set-Location -Path $PSScriptRoot

# Create virtual environment if it doesn't exist
if (!(Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..."
    & $pythonExe -m venv .venv
}

# Activate and install requirements
Write-Host "Upgrading pip and installing requirements..."
& ".venv/Scripts/python.exe" -m pip install --upgrade pip
& ".venv/Scripts/python.exe" -m pip install -r requirements.txt

# Run server
Write-Host "Starting Faster-Whisper server on http://localhost:8000..."
& ".venv/Scripts/python.exe" main.py
