from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import os
import uuid

from analyzer import analyze_audio


app = FastAPI(
    title="Speech Analytics AI",
    description="Contrastive Speech Analytics and Temporal Flaw Grounding",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@app.get("/")
def home():
    return {
        "message": "Speech Analytics AI API is running"
    }


@app.post("/analyze")
async def analyze(audio: UploadFile = File(...)):

    file_id = str(uuid.uuid4())

    filename = f"{file_id}_{audio.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    contents = await audio.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    result = analyze_audio(file_path)

    return {
        "filename": audio.filename,
        "analysis": result
    }