from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import cv2
from deepface import DeepFace
import os

app = Flask(__name__)
CORS(app)

# ----------------- Emotion Suggestions -----------------
emotion_suggestions = {
    'happy': "Keep smiling! Spread your joy today 😊",
    'surprise': "Wow! Take a moment to enjoy the unexpected 🌟",
    'neutral': "Stay calm and keep going, you’re doing fine 🙂",
    'disgust': "Shift your focus to something you love 🌈",
    'sad': "Take a deep breath... maybe try talking and sharing your feelings to our AI chatbot friend 💙",
    'angry': "Try relaxing your mind by listening to music and reading a magazine from our model 😌",
    'fear': "You are safe — focus on something comforting 🕊️"
}

# ----------------- Face Detection Function -----------------
def detect_emotion():
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    cap = cv2.VideoCapture(0)
    detected_emotion = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5)

        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]
            try:
                result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                detected_emotion = result[0]['dominant_emotion']
                cap.release()
                cv2.destroyAllWindows()
                return detected_emotion
            except Exception as e:
                print("Error analyzing face:", e)
                cap.release()
                cv2.destroyAllWindows()
                return None

        cv2.imshow("Emotion Detection - Press 'q' to exit", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return None


# ----------------- Routes -----------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/music')
def music():
    return render_template('music.html')

@app.route('/magazines')
def magazines():
    return render_template('flip.html')

@app.route('/detect_emotion')
def detect_emotion_route():
    emotion = detect_emotion()
    if not emotion:
        return jsonify({
            "emotion": "Unknown",
            "message": "No clear emotion detected. Try again in better lighting."
        })
    suggestion = emotion_suggestions.get(emotion.lower(), "Stay positive and keep smiling! 🌸")
    return jsonify({"emotion": emotion, "message": suggestion})

# Serve static files like background image
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

if __name__ == "__main__":
    app.run(debug=True)
