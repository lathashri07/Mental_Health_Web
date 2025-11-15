import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy Data (Replace with your actual audio URLs)
const instrumentalTracks = Array(8).fill({
  id: 1, title: "Calm Piano", artist: "Relaxing Sounds", 
  cover: "https://placehold.co/150/orange/white?text=Piano", 
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
}).map((t, i) => ({ ...t, id: `inst-${i}`, title: `Instrumental ${i+1}` }));

const spiritualTracks = Array(8).fill({
  id: 2, title: "Om Chanting", artist: "Spiritual Vibes", 
  cover: "https://placehold.co/150/purple/white?text=Om", 
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
}).map((t, i) => ({ ...t, id: `spir-${i}`, title: `Spiritual ${i+1}` }));


function MusicTherapy() {
  const navigate = useNavigate();
  const [showAllInstrumental, setShowAllInstrumental] = useState(false);
  const [showAllSpiritual, setShowAllSpiritual] = useState(false);

  // Helper to render card grid
  const renderSection = (title, tracks, showAll, setShowAll) => {
    const visibleTracks = showAll ? tracks : tracks.slice(0, 4);

    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visibleTracks.map((track) => (
            <div 
              key={track.id} 
              className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate("/music-player", { state: { track, allTracks: tracks } })}
            >
              <img src={track.cover} alt={track.title} className="w-full h-32 object-cover rounded-md mb-2" />
              <h3 className="font-bold text-gray-800 truncate">{track.title}</h3>
              <p className="text-sm text-gray-500 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-gray-900">← Back to Dashboard</button>
        <h1 className="text-3xl font-bold mb-8 text-center">Music Therapy 🎵</h1>
        
        {renderSection("Instrumental Music", instrumentalTracks, showAllInstrumental, setShowAllInstrumental)}
        {renderSection("Spirituality Music", spiritualTracks, showAllSpiritual, setShowAllSpiritual)}
      </div>
    </div>
  );
}

export default MusicTherapy;