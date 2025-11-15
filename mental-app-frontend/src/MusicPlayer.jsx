import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MusicPlayerFixed() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Get both the selected track AND the full playlist
    const { track, allTracks } = location.state || {};
    
    // 2. Set the *current* track in state, starting with the one clicked
    const [currentTrack, setCurrentTrack] = useState(track);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [blackoutMode, setBlackoutMode] = useState(false);
  
    // Check if we have a playlist to navigate
    const hasPlaylist = allTracks && allTracks.length > 0;

    // 3. Find the index of the current track in the full list
    const findCurrentIndex = () => {
        if (!hasPlaylist) return -1;
        return allTracks.findIndex(t => t.id === currentTrack.id);
    };

    // 4. Function to play the next track
    const playNext = () => {
        if (!hasPlaylist) return;
        const currentIndex = findCurrentIndex();
        const nextIndex = (currentIndex + 1) % allTracks.length; // Wrap around
        setCurrentTrack(allTracks[nextIndex]);
    };

    // 5. Function to play the previous track
    const playPrevious = () => {
        if (!hasPlaylist) return;
        const currentIndex = findCurrentIndex();
        const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length; // Wrap around
        setCurrentTrack(allTracks[prevIndex]);
    };

    // --- Original Audio Logic ---

    // If no track, handle gracefully
    // Use currentTrack state for this check
    if (!currentTrack) {
        return (
            <div className="p-10 text-white bg-black h-screen flex flex-col items-center justify-center">
                <p>No track data found.</p>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rose-500 rounded-lg">
                    Go Back
                </button>
            </div>
        );
    }

    const togglePlay = () => {
      const audio = audioRef.current;
      if (isPlaying) audio.pause();
      else audio.play();
      setIsPlaying(!isPlaying);
    };
  
    const onTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
    
    // This now runs for the FIRST track and any time the SRC changes (i.e., new track)
    const onLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
        audioRef.current.play().catch(() => {
            // Autoplay might be blocked
            setIsPlaying(false);
        });
        setIsPlaying(true);
    };

    const handleSeek = (e) => {
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    const formatTime = (time) => {
        if(isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black text-white z-40">
            {/* The Audio Element - Now uses currentTrack.url
                When currentTrack state changes, this 'src' updates,
                and the 'onLoadedMetadata' event will fire again.
            */}
            <audio 
                ref={audioRef} 
                src={currentTrack.url} 
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                // 6. Autoplay next song when one finishes
                onEnded={playNext}
            />

            {/* BLACKOUT OVERLAY */}
            {blackoutMode && (
                <div 
                    className="absolute inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
                    onClick={() => setBlackoutMode(false)}
                >
                    <p className="text-gray-700 text-sm select-none animate-pulse">Tap anywhere to wake</p>
                </div>
            )}

            {/* REGULAR UI (Only visible if not blackout) */}
            {!blackoutMode && (
                <div className="flex flex-col items-center justify-between h-full p-6">
                    {/* Header */}
                    <div className="w-full flex justify-between items-center mt-4">
                        <button onClick={() => navigate(-1)} className="text-3xl text-gray-300">⌄</button>
                        <span className="text-xs tracking-widest uppercase text-gray-400">Playing from Playlist</span>
                        {/* 7. Removed the three-dot button */}
                        <span className="w-8"></span> {/* Placeholder to keep title centered */}
                    </div>

                    {/* Art - Uses currentTrack.cover */}
                    <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/40 my-6">
                        <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover" />
                    </div>

                    {/* Info - Uses currentTrack.title/artist */}
                    <div className="text-center w-full">
                        <h2 className="text-2xl font-bold truncate">{currentTrack.title}</h2>
                        <p className="text-gray-400 mt-1">{currentTrack.artist}</p>
                    </div>

                    {/* Progress */}
                    <div className="w-full mt-6">
                        <input 
                            type="range" 
                            min="0" max={duration} value={currentTime} 
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between w-full max-w-xs mb-8">
                        {/* 8. Wired up buttons and added disabled state */}
                        <button 
                            onClick={playPrevious} 
                            disabled={!hasPlaylist}
                            className="text-4xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ⏮
                        </button>
                        <button onClick={togglePlay} className="w-20 h-20 bg-white rounded-full text-black flex items-center justify-center text-4xl shadow-lg hover:scale-105 transition">
                            {isPlaying ? "⏸" : "▶"}
                        </button>
                        <button 
                            onClick={playNext} 
                            disabled={!hasPlaylist}
                            className="text-4xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ⏭
                        </button>
                    </div>

                    {/* Blackout Toggle */}
                    <button 
                        onClick={() => setBlackoutMode(true)}
                        className="mb-4 px-6 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 flex items-center gap-2 hover:bg-gray-700 transition"
                    >
                        💡 Dim Screen (Sleep Mode)
                    </button>
                </div>
            )}
        </div>
    );
}

export default MusicPlayerFixed;