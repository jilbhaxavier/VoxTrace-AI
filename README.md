# 🎙️ VoxTrace AI — AI-Powered Speech Analysis

**Turning Every Voice into Insight.**

VoxTrace AI is a web-based speech analysis application designed to help users evaluate their spoken delivery. Users can record or upload audio and receive feedback based on selected acoustic characteristics of their speech.

🌐 **Live Demo:** https://voxtrace-ai-frontend.onrender.com

💻 **GitHub Repository:** https://github.com/jilbhaxavier/VoxTrace-AI

---

## 📌 About the Project

Effective communication is an important skill for presentations, interviews, public speaking, and everyday conversations.

However, people do not always have access to immediate feedback about their speaking delivery.

VoxTrace AI aims to make speech analysis accessible through a simple web interface. It analyzes audio characteristics and generates a score with potential areas for improvement.

The project combines audio processing, a Python backend, and a web-based frontend to provide an interactive speech analysis experience.

---

## 🎯 Problem Statement

People practising public speaking often need an accessible way to understand aspects of their speaking delivery.

Traditional practice may not provide immediate, measurable feedback about characteristics such as pauses, pitch variation, and vocal energy.

VoxTrace AI explores how audio analysis can help users identify potential areas for improvement.

---

## 💡 Our Solution

VoxTrace AI provides a web application where users can record or upload a speech recording and receive automated feedback.

The application analyzes selected audio features and calculates a heuristic score based on predefined rules.

The goal is to help users practise speaking and become more aware of their delivery.

---

## ✨ Features

- 🎤 **Audio Input:** Record or upload speech audio through the web interface.
- 📊 **Speech Score:** Generate a score based on selected audio characteristics.
- ⏸️ **Pause Analysis:** Estimate pauses and non-speech portions of a recording.
- 🎵 **Pitch Analysis:** Measure average pitch and pitch variation when detectable.
- 🔊 **Vocal Energy Analysis:** Estimate the energy level of the recorded audio.
- ⚡ **Automated Feedback:** Identify selected acoustic patterns using predefined rules.
- 🌐 **Web-Based Access:** Access the application through a browser.
- ☁️ **Online Deployment:** Frontend and backend are hosted on Render.

*Note: The score is heuristic and should not be interpreted as an objective or scientifically validated measure of speaking ability.*

---

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn

### Audio Processing
- Librosa
- NumPy
- ImageIO-FFmpeg

### Deployment and Version Control
- Render
- GitHub

---

## 🏗️ Project Architecture

VoxTrace AI follows a frontend-backend architecture.

1. The user records or uploads an audio file through the frontend.
2. JavaScript sends the audio file to the backend API.
3. FastAPI receives the uploaded audio.
4. The audio analyzer processes the recording and extracts selected acoustic features.
5. A scoring algorithm evaluates the extracted features.
6. The backend returns the analysis results.
7. The frontend displays the score and feedback to the user.

---

## 📂 Project Structure

```text
VoxTrace-AI/
│
├── backend/
│   ├── analyzer.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Live Demo

Try VoxTrace AI using the deployed application:

**Frontend:**  
https://voxtrace-ai-frontend.onrender.com

**Backend API:**  
https://voxtrace-ai.onrender.com

The backend may take some time to respond after a period of inactivity because hosted services can enter a sleep state.

---

## 💻 Run Locally

### Prerequisites

Install the following:

- Python 3.12 or a compatible Python version
- Git
- A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/jilbhaxavier/VoxTrace-AI.git
```

### 2. Enter the project directory

```bash
cd VoxTrace-AI
```

### 3. Create a virtual environment

```bash
python -m venv backend/venv
```

### 4. Activate the virtual environment

**Windows PowerShell:**

```powershell
.\backend\venv\Scripts\Activate.ps1
```

### 5. Install backend dependencies

```bash
python -m pip install -r backend/requirements.txt
```

### 6. Start the backend

```bash
cd backend
uvicorn main:app --reload
```

The backend should be available at:

http://127.0.0.1:8000

FastAPI's interactive API documentation is available at:

http://127.0.0.1:8000/docs

### 7. Open the frontend

Open `frontend/index.html` in your browser.

Ensure the frontend is configured to send requests to your local backend at:

```text
http://127.0.0.1:8000/analyze
```

If the frontend is configured to use the deployed backend instead, update its API endpoint for local testing.

---

## 📈 How the Scoring Works

The current scoring approach uses predefined rules applied to extracted audio features.

Depending on the analyzer configuration, these features can include:

- Pause ratio
- Average pitch
- Pitch variation
- Average vocal energy

The application starts with a base score and deducts points when selected conditions are detected.

This approach is intended as a prototype for experimenting with automated speech feedback.

The score can be affected by recording quality, background noise, microphone settings, and individual voice characteristics.

It does not independently assess every aspect of communication, such as grammar, factual accuracy, or the overall quality of an argument.

---

## 🔮 Future Improvements

Potential future improvements include:

- More reliable speaking-rate estimation.
- Better speech and silence detection.
- Improved handling of background noise.
- More informative and personalized feedback.
- Better validation of scoring accuracy across different recordings.
- Additional tests for different accents and recording conditions.
- An improved user interface for tracking practice sessions.

---

## 🎯 Use Cases

VoxTrace AI may be useful for:

- Students practising presentations.
- Participants preparing for interviews.
- People practising public speaking.
- Users who want to explore their speaking delivery.
- Developers interested in audio processing and speech analytics.

---

## ⚠️ Limitations

- The score is based on predefined rules and is not a validated measure of speaking proficiency.
- Acoustic measurements can vary with microphones, background noise, and recording conditions.
- Different voices naturally have different pitch and energy characteristics.
- Pause detection may classify some intentional pauses as potential issues.
- The analyzer does not necessarily evaluate grammar, pronunciation, or semantic meaning.

Results should be treated as practice feedback rather than a formal assessment.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

If you would like to improve VoxTrace AI:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

---

## 👩‍💻 Project Information

**Project Name:** VoxTrace AI  
**Category:** Artificial Intelligence / Audio Processing / Web Development  
**Purpose:** Exploratory speech analysis and practice feedback  
**Deployment:** Render  
**Source Code:** GitHub

---

## 📜 License

No license has been specified yet.

Before allowing others to reuse, modify, or distribute this project, consider adding an appropriate open-source license.

---

**VoxTrace AI — Listen. Analyze. Elevate.** 🎙️
