let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;


// ================================
// RECORDING
// ================================

const startBtn =
    document.getElementById("startBtn");

const stopBtn =
    document.getElementById("stopBtn");

const recordingStatus =
    document.getElementById("recordingStatus");

const recordedAudio =
    document.getElementById("recordedAudio");


startBtn.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        mediaRecorder =
            new MediaRecorder(stream);

        audioChunks = [];

        mediaRecorder.ondataavailable = event => {

            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }

        };

        mediaRecorder.onstop = () => {

            recordedBlob =
                new Blob(
                    audioChunks,
                    { type: "audio/webm" }
                );

            const audioURL =
                URL.createObjectURL(recordedBlob);

            recordedAudio.src =
                audioURL;

            recordingStatus.innerText =
                "Recording finished. You can analyze it now.";

            stream.getTracks().forEach(
                track => track.stop()
            );

        };

        mediaRecorder.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;

        recordingStatus.innerText =
            "🔴 Recording... Speak now.";

    } catch (error) {

        console.error(error);

        alert(
            "Microphone access was denied or is unavailable."
        );

    }

});


stopBtn.addEventListener("click", () => {

    if (
        mediaRecorder &&
        mediaRecorder.state !== "inactive"
    ) {

        mediaRecorder.stop();

    }

    startBtn.disabled = false;
    stopBtn.disabled = true;

});


// ================================
// ANALYZE AUDIO
// ================================

const analyzeBtn =
    document.getElementById("analyzeBtn");

const audioFile =
    document.getElementById("audioFile");

const loading =
    document.getElementById("loading");


analyzeBtn.addEventListener("click", async () => {

    let audioToAnalyze = null;

    // Uploaded file has priority
    if (audioFile.files.length > 0) {

        audioToAnalyze =
            audioFile.files[0];

    }

    // Otherwise use recorded audio
    else if (recordedBlob) {

        audioToAnalyze =
            new File(
                [recordedBlob],
                "recorded_speech.webm",
                {
                    type: "audio/webm"
                }
            );

    }

    else {

        alert(
            "Please record your speech or upload an audio file."
        );

        return;

    }


    loading.style.display = "block";


    const formData =
        new FormData();

    formData.append(
        "audio",
        audioToAnalyze
    );


    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data =
            await response.json();


        const result =
            data.analysis;


        // ================================
        // DISPLAY RESULTS
        // ================================

        document.getElementById("score").innerText =
            result.score;

        document.getElementById("duration").innerText =
            result.duration + " sec";

        document.getElementById("wpm").innerText =
            result.estimated_wpm;

        document.getElementById("pitch").innerText =
            result.average_pitch;


        document.getElementById("pauseRatio").innerText =
            result.pause_ratio + "%";

        document.getElementById("energy").innerText =
            result.average_energy;

        document.getElementById("pitchVariation").innerText =
            result.pitch_variation;


        // ================================
        // AUDIO PLAYER
        // ================================

        const audioPlayer =
            document.getElementById("audioPlayer");

        audioPlayer.src =
            URL.createObjectURL(audioToAnalyze);


        // ================================
        // FLAWS
        // ================================

        const flawsContainer =
            document.getElementById("flaws");

        flawsContainer.innerHTML = "";


        if (result.flaws.length === 0) {

            flawsContainer.innerHTML = `
                <div class="flaw low">
                    <h3>✓ No major flaws detected</h3>
                    <p>
                        Your current acoustic features
                        are within the selected thresholds.
                    </p>
                </div>
            `;

        }

        else {

            result.flaws.forEach(flaw => {

                let className = "flaw";


                if (flaw.severity === "Medium") {
                    className = "flaw medium";
                }


                if (flaw.severity === "Low") {
                    className = "flaw low";
                }


                flawsContainer.innerHTML += `

                    <div class="${className}">

                        <h3>
                            ⚠️ ${flaw.type}
                        </h3>

                        <p>
                            ${flaw.message}
                        </p>

                        <p>
                            <strong>Measured Value:</strong>
                            ${flaw.value}
                        </p>

                        <p>
                            <strong>Severity:</strong>
                            ${flaw.severity}
                        </p>

                    </div>

                `;

            });

        }


        // ================================
        // SUGGESTIONS
        // ================================

        const suggestions =
            document.getElementById("suggestions");

        suggestions.innerHTML = "";


        if (result.flaws.length === 0) {

            suggestions.innerHTML = `
                <div class="suggestion">
                    <strong>Great job!</strong>
                    <p>
                        Keep practicing to maintain
                        your current speaking quality.
                    </p>
                </div>
            `;

        }


        result.flaws.forEach(flaw => {

            let suggestionText =
                "Continue practicing your speech.";


            if (
                flaw.type ===
                "Excessive Pauses"
            ) {

                suggestionText =
                    "Try to reduce long silent gaps. Practice speaking in complete phrases and prepare your next sentence before finishing the current one.";

            }


            else if (
                flaw.type ===
                "Pauses"
            ) {

                suggestionText =
                    "Try to make your pauses shorter and more natural.";

            }


            else if (
                flaw.type ===
                "Low Pitch Variation"
            ) {

                suggestionText =
                    "Try adding natural changes in pitch to make your speech more expressive.";

            }


            else if (
                flaw.type ===
                "Low Vocal Energy"
            ) {

                suggestionText =
                    "Try speaking with slightly stronger and clearer vocal energy.";

            }


            suggestions.innerHTML += `

                <div class="suggestion">

                    <strong>
                        💡 ${flaw.type}
                    </strong>

                    <p>
                        ${suggestionText}
                    </p>

                </div>

            `;

        });


    }

    catch (error) {

        console.error(error);

        alert(
            "Could not analyze the audio. " +
            "Make sure the backend is running."
        );

    }


    loading.style.display = "none";

});