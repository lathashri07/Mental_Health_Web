// src/components/FaceRecognition.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Activity, RefreshCw, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for consistency
import { apiEndpoints } from "../components/utils/apiEndpoints"; // Import your API endpoints

const FaceRecognition = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const navigate = useNavigate();

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(true);
    const [capturedData, setCapturedData] = useState(null);
    const [scanStatus, setScanStatus] = useState("Initializing AI...");

    // 1. Load AI Models & Start Camera
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                startVideo();
            } catch (err) {
                console.error("Model Load Error:", err);
                setScanStatus("Error loading AI models.");
            }
        };
        loadModels();

        return () => stopCameraStream();
    }, []);

    const startVideo = () => {
        setScanStatus("Accessing Camera...");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsLoading(false);
                    setScanStatus("Looking for a face...");
                }
            })
            .catch((err) => {
                console.error("Camera Error:", err);
                setScanStatus("Camera access denied.");
            });
    };

    const stopCameraStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // 2. Continuous Detection Loop with Auto-Capture
    const handleVideoOnPlay = () => {
        const interval = setInterval(async () => {
            if (!isScanning || !videoRef.current || !canvasRef.current) {
                clearInterval(interval);
                return;
            }

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
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, displaySize.width, displaySize.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

            if (detections.length > 0) {
                const expressions = detections[0].expressions;
                const maxEmotion = Object.keys(expressions).reduce((a, b) => 
                    expressions[a] > expressions[b] ? a : b
                );
                
                // Auto-capture if confidence is high (> 0.7)
                if (expressions[maxEmotion] > 0.7) {
                    clearInterval(interval);
                    captureSnapshot(maxEmotion);
                } else {
                    setScanStatus("Hold still...");
                }
            } else {
                setScanStatus("Looking for a face...");
            }
        }, 500);
    };

    // 3. Capture Snapshot
    const captureSnapshot = (emotion) => {
        if (!videoRef.current) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        const imgData = tempCanvas.toDataURL('image/png');

        setCapturedData({
            image: imgData,
            emotion: emotion,
        });

        stopCameraStream();
        setIsScanning(false);
    };

    // 4. Retake Logic
    const handleRetake = () => {
        setCapturedData(null);
        setIsScanning(true);
        setIsLoading(true);
        startVideo();
    };

    // 5. ✅ SAVE DATA & PROCEED TO CHAT
    const handleProceedToChat = async () => {
        if (!capturedData) return;

        // Get User and Token from Storage
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to save your mood.");
            navigate('/login');
            return;
        }

        try {
            // A. Save to Database (For Profile Tracker)
            // We include userId explicitly to ensure it attaches to the correct account
            await axios.post('http://localhost:3000/mood-logs', { 
                userId: user?._id || user?.id, // Send User ID
                emotion: capturedData.emotion, 
                confidence: 0.9,
                timestamp: new Date().toISOString()
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // B. Navigate to Chatbot (For Accurate Response)
            // We pass the emotion in the "state" so the Chatbot knows it immediately
            navigate('/chatbot', { 
                state: { 
                    detectedMood: capturedData.emotion 
                } 
            });

        } catch (error) {
            console.error("Save Error:", error);
            // Even if save fails, proceed to chat but maybe with a warning or fallback
            navigate('/chatbot', { 
                state: { 
                    detectedMood: capturedData.emotion 
                } 
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 flex flex-col items-center py-10 px-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Camera className="text-teal-600" /> 
                {isScanning ? "Scanning Expression..." : "Analysis Complete"}
            </h2>

            <div className="relative border-4 border-white rounded-3xl overflow-hidden shadow-2xl bg-black w-full max-w-2xl aspect-video">
                
                {isScanning && (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80 text-white">
                                <Activity className="animate-spin mr-2"/> {scanStatus}
                            </div>
                        )}
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            onPlay={handleVideoOnPlay} 
                            className="w-full h-full object-cover transform scale-x-[-1]" 
                        />
                        <canvas 
                            ref={canvasRef} 
                            className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]" 
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                                {scanStatus}
                            </span>
                        </div>
                    </>
                )}

                {!isScanning && capturedData && (
                    <div className="relative w-full h-full">
                        <img 
                            src={capturedData.image} 
                            alt="Captured Expression" 
                            className="w-full h-full object-cover transform scale-x-[-1]" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end items-center pb-8">
                            <p className="text-slate-300 text-lg mb-1">We detected that you are feeling:</p>
                            <h3 className="text-4xl font-bold text-teal-400 uppercase tracking-widest drop-shadow-md">
                                {capturedData.emotion}
                            </h3>
                        </div>
                    </div>
                )}
            </div>

            {!isScanning && capturedData && (
                <div className="mt-8 flex flex-col md:flex-row gap-4 w-full max-w-2xl justify-center">
                    
                    <button 
                        onClick={handleRetake}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
                    >
                        <RefreshCw size={20}/> Retake
                    </button>

                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-teal-500 hover:text-teal-600 transition-colors"
                    >
                        <LayoutDashboard size={20}/> Go to Dashboard
                    </button>

                    <button 
                        onClick={handleProceedToChat}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-600 text-white font-bold shadow-lg hover:bg-teal-700 hover:scale-105 transition-all"
                    >
                        <MessageSquare size={20}/> Talk about it with Dr. Nova
                    </button>
                </div>
            )}
            
            <p className="mt-8 text-slate-500 text-sm max-w-md text-center">
                {isScanning 
                    ? "Please look directly at the camera. We will capture your first clear expression automatically." 
                    : "Data will be saved to your profile for tracking. This image is not stored permanently."}
            </p>
        </div>
    );
};

export default FaceRecognition;