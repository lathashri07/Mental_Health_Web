import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Save, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FaceRecognition = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [emotion, setEmotion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    // 1. Load AI Models
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Refers to public/models folder
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);
            startVideo();
        };
        loadModels();
    }, []);

    // 2. Start Webcam
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                setIsLoading(false);
            })
            .catch((err) => console.error("Camera Error:", err));
    };

    // 3. Detect Emotions Loop
    const handleVideoOnPlay = () => {
        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const displaySize = { 
                width: videoRef.current.videoWidth, 
                height: videoRef.current.videoHeight 
            };
            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi.detectAllFaces(
                videoRef.current, 
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Clear previous drawings
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, displaySize.width, displaySize.height);

            // Draw detection box
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            
            // Logic to get the dominant emotion
            if (detections.length > 0) {
                const expressions = detections[0].expressions;
                // Find the emotion with highest score
                const maxEmotion = Object.keys(expressions).reduce((a, b) => 
                    expressions[a] > expressions[b] ? a : b
                );
                setEmotion(maxEmotion);
            }
        }, 1000); // Check every 1 second

        return () => clearInterval(interval);
    };

    // 4. Save to Database
    const saveMood = async () => {
        if (!emotion) return;

        try {
            const token = localStorage.getItem("token");
            await fetch('http://localhost:3000/mood-logs', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ emotion: emotion, confidence: 0.9 })
            });
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                navigate('/chatbot'); // Redirect to chat after saving
            }, 1500);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Camera className="text-teal-600" /> AI Emotion Scanner
            </h2>

            <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-black">
                {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white">Loading AI Models...</div>}
                
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    onPlay={handleVideoOnPlay} 
                    width="640" 
                    height="480"
                />
                <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0" 
                />
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="text-2xl font-semibold text-slate-700">
                    Detected Emotion: 
                    <span className="ml-2 text-teal-600 uppercase tracking-wider">
                        {emotion || "Scanning..."}
                    </span>
                </div>

                <button 
                    onClick={saveMood}
                    disabled={!emotion}
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg transition-all
                        ${isSaved ? 'bg-green-500' : 'bg-teal-600 hover:bg-teal-700 hover:scale-105'}
                        ${!emotion ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isSaved ? "Saved!" : <><Save size={20}/> Save & Chat with Dr. Nova</>}
                </button>
                
                <p className="text-slate-500 text-sm max-w-md text-center">
                    Saving your mood allows Dr. Nova to understand how you are feeling before you even start chatting.
                </p>
            </div>
        </div>
    );
};

export default FaceRecognition;