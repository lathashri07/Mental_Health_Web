import cv2
from deepface import DeepFace
import tkinter as tk

# ---------------- FACE DETECTION SETUP ----------------
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)

# ---------------- CUSTOM SUGGESTIONS ----------------
emotion_suggestions = {
    'happy': "Keep smiling! Spread your joy today 😊",
    'surprise': "Wow! Take a moment to enjoy the unexpected 🌟",
    'neutral': "Stay calm and keep going, you’re doing fine 🙂",
    'disgust': "Shift your focus to something you love 🌈",
    'sad': "Take a deep breath... maybe try talking and sharing your feelings to our AI chatbot friend 💙",
    'angry': "Try relaxing your mind by listening to music and reading a magazine from our model 😌",
    'fear': "You are safe — focus on something comforting 🕊️"
}

emotion_detected = None  # Track if an emotion was already detected

# ---------------- MAIN VIDEO LOOP ----------------
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        face_roi = rgb_frame[y:y + h, x:x + w]

        # Perform emotion analysis
        result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        # Draw rectangle and emotion on video
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(frame, f"{emotion}", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Open suggestion window only once when first emotion detected
        if emotion_detected is None:
            emotion_detected = emotion

            # Stop video feed
            cap.release()
            cv2.destroyAllWindows()

            # ---------------- TKINTER WINDOW ----------------
            root = tk.Tk()
            root.title("Emotion Healing Suggestion")
            root.geometry("550x280")
            root.configure(bg="#101820")

            # Get respective suggestion
            suggestion = emotion_suggestions.get(emotion.lower(), "Stay positive and keep smiling!")

            # Title Label
            tk.Label(root, text=f"Detected Emotion: {emotion.upper()}",
                     font=("Helvetica", 18, "bold"), bg="#101820", fg="#00FFFF").pack(pady=25)

            # Suggestion Label
            tk.Label(root, text=suggestion, wraplength=500, justify="center",
                     font=("Helvetica", 14), bg="#101820", fg="white").pack(pady=20)

            # Exit Button
            tk.Button(root, text="Close", command=root.destroy,
                      font=("Helvetica", 12, "bold"), bg="#00FFFF", fg="black", width=12).pack(pady=20)

            root.mainloop()
            break  # Exit loop after showing suggestion

    cv2.imshow("Emotion Detection", frame)

    # Press 'q' to quit manually
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
