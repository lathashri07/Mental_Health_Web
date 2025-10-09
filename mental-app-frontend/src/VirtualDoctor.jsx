import React, { useState, useEffect, useRef } from 'react';

// Get the SpeechRecognition object, prefixed for different browsers
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

function VirtualDoctor() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('initial_avatar_idle_video.mp4'); // An idle video
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  
  // useRef is used to hold a reference to the WebSocket connection
  // This allows it to persist and be accessed from anywhere in the component
  const ws = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    // 1. FIX: Hardcode the port number to 3000
    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'video' && data.url) {
        setVideoUrl(data.url); // Update the video source with the AI's response
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    // Cleanup: Close the connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []); // The empty dependency array ensures this runs only once

  const handleListen = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // This effect runs when speech recognition produces a result
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('User said:', transcript);
    
    // 2. FIX: Check if the WebSocket is connected and send the transcript
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(transcript);
      // Set a temporary "thinking" video while waiting for the response
      setVideoUrl('thinking_avatar_video.mp4'); 
    }
    
    setIsRecording(false);
  };
  
  // Handle cases where the user stops talking
  recognition.onend = () => {
    setIsRecording(false);
  };

  return (
    <div>
      <p>Connection Status: {connectionStatus}</p>
      {/* The `key` forces React to re-mount the video element when the src changes */}
      <video src={videoUrl} autoPlay key={videoUrl}></video>
      <button onClick={handleListen} disabled={connectionStatus !== 'Connected'}>
        {isRecording ? 'Listening...' : 'Push to Talk'}
      </button>
    </div>
  );
}

export default VirtualDoctor;