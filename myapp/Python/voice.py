import os
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper

# -------- Settings --------
LANGUAGE = "ta"  # 'ta' for Tamil, 'en' for English
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(SCRIPT_DIR, "my_json.json")

# -------- Load Whisper model --------
print("Loading Whisper model... This may take a while!")
MODEL = whisper.load_model("small")  # small/medium/large for accuracy
print("Model loaded successfully!")

# -------- FastAPI app --------
app = FastAPI()

# Allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ for production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- JSON helpers --------
def load_json_file(file_path):
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except json.JSONDecodeError:
            pass
    return []

def save_json_file(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# -------- API endpoint to upload voice --------
@app.post("/upload-voice")
async def upload_voice(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_path = os.path.join(SCRIPT_DIR, "temp.wav")
    contents = await file.read()
    with open(temp_path, "wb") as f:
        f.write(contents)

    # Transcribe using Whisper
    result = MODEL.transcribe(temp_path, language=LANGUAGE, fp16=False)
    text = result["text"].strip()

    # Save to JSON
    entry = {
        "timestamp": datetime.now().isoformat(),
        "text": text
    }
    data = load_json_file(JSON_FILE)
    data.append(entry)
    save_json_file(JSON_FILE, data)

    # Optional: delete temp file to avoid clutter
    if os.path.exists(temp_path):
        os.remove(temp_path)

    # FIX: send "success": True instead of "status"
    return {"success": True, "text": text}
