import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

function VirtualDoctor() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [status, setStatus] = useState('Ready to connect');
  
  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. Setup Speech Recognition (Browser API) ---
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition. Please use Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
    };

    recognition.onend = () => {
      setIsListening(false);
      // If we haven't processed a result yet, go back to idle
      if (status === 'Listening...') setStatus('Processing...');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleUserMessage(text);
    };

    recognitionRef.current = recognition;
  }, [conversationHistory]); // Re-bind if history changes

  // --- 2. Handle User Speaking ---
  const handleUserMessage = async (userText) => {
    setStatus('Thinking...');
    
    // Add user message to local history
    const newHistory = [...conversationHistory, { role: 'user', content: userText }];
    setConversationHistory(newHistory);

    try {
      const token = localStorage.getItem('token');
      
      // Call Backend
      const response = await fetch('http://localhost:3000/virtual-doctor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userText, history: newHistory })
      });

      const data = await response.json();
      
      if (data.reply) {
        // Add AI response to history
        setConversationHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
        speakResponse(data.reply);
      }

    } catch (error) {
      console.error(error);
      setStatus('Connection Error');
    }
  };

  // --- 3. Text-to-Speech (The Doctor Speaks) ---
  const speakResponse = (text) => {
    setStatus('Dr. Nova is speaking...');
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    // You can customize the voice here if you want
    // const voices = synth.getVoices();
    // utterance.voice = voices[0]; 
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus('Your turn to speak');
      // Automatically start listening again after doctor finishes?
      // toggleListening(); // Uncomment this for continuous conversation
    };

    synth.speak(utterance);
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
        speakResponse("Hello. I am Dr. Nova. How have you been sleeping lately?");
    } else {
        synth.cancel(); // Stop talking
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
           🏥 Virtual Consultation Room
        </h2>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">Exit</button>
      </div>

      {/* Main Video Area */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
        
        {/* DOCTOR VIEW (AI) */}
        <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
           <video src="Virtual_Doctor.mp4" autoPlay loop muted className="w-full h-full object-cover" />
           
           {/* Visualizer when talking */}
           {isSpeaking && (
             <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                <div className="w-2 h-8 bg-green-400 animate-bounce"></div>
                <div className="w-2 h-12 bg-green-400 animate-bounce delay-75"></div>
                <div className="w-2 h-6 bg-green-400 animate-bounce delay-150"></div>
             </div>
           )}
           <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
             Dr. Nova (AI Psychiatrist)
           </div>
        </div>

        {/* USER VIEW (Webcam) */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
          {isCallActive ? (
            <Webcam 
              audio={false}
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Camera Off
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            You
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="bg-gray-800 px-6 py-2 rounded-full text-blue-300 font-mono text-sm">
           Status: {status}
        </div>

        {!isCallActive ? (
            <button 
                onClick={toggleCall}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all"
            >
                Start Consultation
            </button>
        ) : (
            <div className="flex gap-4">
                <button 
                    onClick={toggleListening}
                    disabled={isSpeaking}
                    className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 ${
                        isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isListening ? '🛑 Stop Speaking' : '🎙️ Tap to Speak'}
                </button>

                <button 
                    onClick={toggleCall}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all"
                >
                    End Call
                </button>
            </div>
        )}
      </div>

      {/* Transcript Log (Optional) */}
      <div className="mt-8 w-full max-w-2xl bg-gray-800 rounded-lg p-4 text-gray-300 h-32 overflow-y-auto text-sm">
        {conversationHistory.length === 0 ? (
            <p className="text-gray-500 text-center">Conversation transcript will appear here...</p>
        ) : (
            conversationHistory.map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-1 rounded-lg ${msg.role === 'user' ? 'bg-blue-900 text-blue-100' : 'bg-green-900 text-green-100'}`}>
                        {msg.role === 'user' ? 'You: ' : 'Dr: '} {msg.content}
                    </span>
                </div>
            ))
        )}
      </div>
    </div>
  );
}

export default VirtualDoctor;