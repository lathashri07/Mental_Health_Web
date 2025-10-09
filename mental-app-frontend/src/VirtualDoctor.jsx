// In VirtualDoctor.jsx

const [isRecording, setIsRecording] = useState(false);
const [userTranscript, setUserTranscript] = useState('');
const [videoUrl, setVideoUrl] = useState('initial_avatar_idle_video.mp4');

// This is a simplified example. You'd need more logic for a full implementation.
const startRecording = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setUserTranscript(transcript);
    //
    // LATER: Send this transcript to the backend via WebSocket
    //
  };
  recognition.start();
  setIsRecording(true);
};

useEffect(() => {
  const ws = new WebSocket(`ws://localhost:${PORT}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'video') {
      setVideoUrl(data.url); // Update the video source
    }
  };

  // Cleanup on component unmount
  return () => ws.close();
}, []);

return (
  <div>
    <video src={videoUrl} autoPlay key={videoUrl}></video>
    <button onClick={startRecording}>
      {isRecording ? 'Listening...' : 'Push to Talk'}
    </button>
  </div>
);