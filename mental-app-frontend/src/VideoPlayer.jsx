import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { video, allVideos } = location.state || {};

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [currentVideo, setCurrentVideo] = useState(video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls timer
  let controlsTimeout;

  // Handle Missing Data
  if (!currentVideo) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <p>No video selected.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-teal-500 rounded">Go Back</button>
      </div>
    );
  }

  // --- Playlist Logic ---
  const findCurrentIndex = () => allVideos?.findIndex(v => v.id === currentVideo.id) ?? -1;
  const hasNext = allVideos && findCurrentIndex() < allVideos.length - 1;
  const hasPrev = allVideos && findCurrentIndex() > 0;

  const playNext = () => {
    if (hasNext) setCurrentVideo(allVideos[findCurrentIndex() + 1]);
  };

  const playPrev = () => {
    if (hasPrev) setCurrentVideo(allVideos[findCurrentIndex() - 1]);
  };

  // --- Video Event Handlers ---
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
    setDuration(total);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const handleSpeedChange = () => {
    const rates = [1, 1.5, 2, 0.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Format Time Helper
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Mouse Move to show controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      ref={playerContainerRef}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden group"
      onMouseMove={handleMouseMove}
    >
      {/* Back Button (Only visible when controls show) */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => navigate(-1)} className="text-white text-xl flex items-center gap-2 hover:text-teal-400">
          ← Back to Library
        </button>
      </div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentVideo.url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onEnded={playNext}
        autoPlay
      ></video>

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-6 pt-12 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-gray-600 cursor-pointer group/bar mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-teal-500" 
            style={{ width: `${progress}%` }}
          ></div>
          <input 
            type="range" 
            min="0" max="100" 
            value={progress} 
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white">
          
          <div className="flex items-center gap-4">
            {/* Prev */}
            <button onClick={playPrev} disabled={!hasPrev} className="hover:text-teal-400 disabled:opacity-30">
              ⏮
            </button>
            
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-3xl hover:text-teal-400 transition transform hover:scale-110">
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* Next */}
            <button onClick={playNext} disabled={!hasNext} className="hover:text-teal-400 disabled:opacity-30">
              ⏭
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="w-6">
                {isMuted || volume === 0 ? "🔇" : "🔊"}
              </button>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={volume} onChange={handleVolumeChange}
                className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 h-1 bg-white accent-teal-500"
              />
            </div>

            {/* Time */}
            <span className="text-xs text-gray-300">
              {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Speed Toggle */}
            <button onClick={handleSpeedChange} className="text-xs font-bold border border-gray-500 rounded px-2 py-1 hover:bg-white hover:text-black">
              {playbackRate}x
            </button>

            {/* Subtitles (Dummy UI) */}
            <button className="text-xl opacity-70 hover:opacity-100" title="Subtitles (CC)">
              💬
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullScreen} className="text-xl hover:text-teal-400">
              ⛶
            </button>
          </div>

        </div>
        
        {/* Title */}
        <h3 className="text-white font-bold mt-4 text-lg">{currentVideo.title}</h3>
      </div>
    </div>
  );
}

export default VideoPlayer;