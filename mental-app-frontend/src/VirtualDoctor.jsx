import React, { useState, useEffect, useRef } from 'react';


function VirtualDoctor() {
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // NEW: State for AI processing
  const [videoUrl, setVideoUrl] = useState('/initial_avatar_idle.mp4'); // An idle video
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [transcript, setTranscript] = useState(''); // NEW: State to display user's speech
  const [error, setError] = useState(''); // NEW: State for errors

  const ws = useRef(null);
  // NEW: useRef to hold the speech recognition instance
  const recognition = useRef(null);

  useEffect(() => {
    // --- WebSocket Connection ---
    ws.current = new WebSocket('ws://localhost:3000');
    ws.current.onopen = () => setConnectionStatus('Connected');
    ws.current.onclose = () => setConnectionStatus('Disconnected');
    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnectionStatus('Error');
    };
    ws.current.onmessage = (event) => {
      setIsThinking(false); // Stop thinking when response is received
      const data = JSON.parse(event.data);
      if (data.type === 'video' && data.url) {
        setVideoUrl(data.url);
      }
    };

    // --- Speech Recognition Setup ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.lang = 'en-US';
    recognition.current.interimResults = false;

    // Event listeners for speech recognition are set here
    recognition.current.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript); // Show user what was heard
      setError(''); // Clear previous errors

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(currentTranscript);
        setIsThinking(true); // Start thinking
      }
    };

    recognition.current.onend = () => {
      setIsRecording(false);
    };

    recognition.current.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}. Please try again.`);
      setIsRecording(false);
    };

    // Cleanup function
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleListen = () => {
    if (isRecording) {
      recognition.current.stop();
    } else {
      setTranscript(''); // Clear previous transcript
      recognition.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div>
      <p>Connection Status: {connectionStatus}</p>
      <video src={videoUrl} autoPlay key={videoUrl} controls></video>
      
      {/* NEW: Display thinking status and transcript */}
      <div>
        {isThinking && <p>Virtual doctor is thinking...</p>}
        {transcript && <p>You said: "{transcript}"</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <button onClick={handleListen} disabled={connectionStatus !== 'Connected' || isThinking}>
        {isRecording ? 'Stop Listening' : 'Push to Talk'}
      </button>
    </div>
  );
}

export default VirtualDoctor;