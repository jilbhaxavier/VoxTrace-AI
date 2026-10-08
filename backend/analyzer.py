import librosa
import numpy as np
import os
import subprocess
import tempfile
import imageio_ffmpeg


def analyze_audio(file_path):

    # Convert browser WebM recording to WAV
    if file_path.lower().endswith(".webm"):

        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

        temp_wav = tempfile.NamedTemporaryFile(
            suffix=".wav",
            delete=False
        )

        temp_wav.close()

        subprocess.run(
            [
                ffmpeg_path,
                "-y",
                "-i",
                file_path,
                "-ar",
                "16000",
                "-ac",
                "1",
                temp_wav.name
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        audio_path = temp_wav.name

    else:
        audio_path = file_path

    y, sr = librosa.load(
        audio_path,
        sr=None,
        mono=True
    )

    duration = librosa.get_duration(y=y, sr=sr)

    # -----------------------------
    # Energy
    # -----------------------------
    rms = librosa.feature.rms(y=y)[0]

    average_energy = float(np.mean(rms))
    energy_variation = float(np.std(rms))

    # -----------------------------
    # Pitch / F0
    # -----------------------------
    f0, voiced_flag, voiced_probs = librosa.pyin(
        y,
        fmin=librosa.note_to_hz("C2"),
        fmax=librosa.note_to_hz("C7")
    )

    valid_pitch = f0[~np.isnan(f0)]

    if len(valid_pitch) > 0:
        average_pitch = float(np.mean(valid_pitch))
        pitch_variation = float(np.std(valid_pitch))
    else:
        average_pitch = 0
        pitch_variation = 0

    # -----------------------------
    # MFCC
    # -----------------------------
    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=13
    )

    mfcc_mean = np.mean(mfcc, axis=1)

    # -----------------------------
    # Speech / Pause Detection
    # -----------------------------
    intervals = librosa.effects.split(
        y,
        top_db=30
    )

    speech_duration = 0

    for start, end in intervals:
        speech_duration += (end - start) / sr

    pause_duration = max(
        0,
        duration - speech_duration
    )

    pause_ratio = (
        pause_duration / duration
        if duration > 0
        else 0
    )

    # -----------------------------
    # Estimated Speaking Rate
    # -----------------------------
    estimated_words = max(
        1,
        int(speech_duration * 2.2)
    )

    speaking_minutes = speech_duration / 60

    estimated_wpm = (
        estimated_words / speaking_minutes
        if speaking_minutes > 0
        else 0
    )

    # -----------------------------
    # Detect Flaws
    # -----------------------------
    flaws = []

    # Excessive pauses
    if pause_ratio > 0.20:

        flaws.append({
            "type": "Excessive Pauses",
            "severity": "High",
            "message": "A large portion of the speech contains silence.",
            "value": round(pause_ratio * 100, 2)
        })

    elif pause_ratio > 0.12:

        flaws.append({
            "type": "Pauses",
            "severity": "Medium",
            "message": "Several noticeable pauses were detected.",
            "value": round(pause_ratio * 100, 2)
        })

    # Low pitch variation
    if average_pitch > 0:

        pitch_cv = (
            pitch_variation /
            average_pitch
        )

        if pitch_cv < 0.08:

            flaws.append({
                "type": "Low Pitch Variation",
                "severity": "Medium",
                "message": "The voice has relatively low pitch variation.",
                "value": round(pitch_cv * 100, 2)
            })

    # Low vocal energy
    if average_energy < 0.015:

        flaws.append({
            "type": "Low Vocal Energy",
            "severity": "Medium",
            "message": "The average vocal energy is relatively low.",
            "value": round(average_energy, 4)
        })

    # -----------------------------
    # Score
    # -----------------------------
    score = 100

    for flaw in flaws:

        if flaw["severity"] == "High":
            score -= 15

        elif flaw["severity"] == "Medium":
            score -= 8

        else:
            score -= 5

    score = max(0, score)

    # -----------------------------
    # Return Results
    # -----------------------------
    return {

        "duration": round(
            duration,
            2
        ),

        "sample_rate": sr,

        "average_energy": round(
            average_energy,
            4
        ),

        "energy_variation": round(
            energy_variation,
            4
        ),

        "average_pitch": round(
            average_pitch,
            2
        ),

        "pitch_variation": round(
            pitch_variation,
            2
        ),

        "pause_duration": round(
            pause_duration,
            2
        ),

        "pause_ratio": round(
            pause_ratio * 100,
            2
        ),

        "estimated_wpm": round(
            estimated_wpm,
            2
        ),

        "mfcc": [
            round(float(x), 3)
            for x in mfcc_mean
        ],

        "score": score,

        "flaws": flaws
    }