import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- INSTRUMENTAL TRACKS DATA (8 Items) ---
const instrumentalTracks = [
  {
    id: "inst-1",
    title: "Gentle Guitar",
    artist: "Calm Strings",
    cover: "/CoverPages/tumbnail1.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766560287/WhatsApp_Video_2025-12-05_at_11.45.32_AM_rgwts4.mp4" 
  },
  {
    id: "inst-2",
    title: "Deep Sleep Piano",
    artist: "Brainwave Music",
    cover: "/CoverPages/tumbnail2.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562663/Instru2_xvaom8.mp4"
  },
  {
    id: "inst-3",
    title: "Acoustic Morning",
    artist: "Piano Vibes",
    cover: "/CoverPages/tumbnail3.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562668/Instru3_jdxh2j.mp4"
  },
  {
    id: "inst-4",
    title: "Lo-Fi Beats",
    artist: "Chill Hop",
    cover: "/CoverPages/tumbnail4.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562676/Instru4_tddlky.mp4"
  },
  {
    id: "inst-5",
    title: "Forest Ambience",
    artist: "Nature Sounds",
    cover: "/CoverPages/tumbnail5.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562683/Instru5_tp22ak.mp4"
  },
  {
    id: "inst-6",
    title: "Ocean Waves",
    artist: "Deep Sleep",
    cover: "/CoverPages/tumbnail6.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562691/Instru6_e0z19a.mp4"
  },
  {
    id: "inst-7",
    title: "Soft Strings",
    artist: "Orchestra",
    cover: "/CoverPages/tumbnail7.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562697/Instru7_h7espf.mp4"
  },
  {
    id: "inst-8",
    title: "Night Cricket",
    artist: "Relaxing Sounds",
    cover: "/CoverPages/tumbnail8.png",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766562703/Instru8_tbsxlj.mp4"
  },
];

// --- SPIRITUAL TRACKS DATA (8 Items) ---
const spiritualTracks = [
  {
    id: "spir-1",
    title: "Hare Krishna Chanting",
    artist: "Spiritual Vibes",
    cover: "/CoverPages/cover.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567275/Maha_Mantras-_HARE_KRISHNA_HARE_RAMA___Divine_Maha_Mantra___Sound_of_Mantras___Krishan_Bhajan___21_lcgyqm.mp4"
  },
  {
    id: "spir-2",
    title: "Tibetan Bowls",
    artist: "Healing Sound",
    cover: "/CoverPages/coverb1.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567304/The_Bliss_of_Nirvana_l_Full_Chant_l_Jaymangal_Atthagatha_l_Pawa_l_Greatest_Buddha_Meditation_Music_jsdcln.mp4"
  },
  {
    id: "spir-3",
    title: "Theme of Lord Shiva",
    artist: "Divine Melodies",
    cover: "/CoverPages/covers1.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567989/Theme_of_Lord_Shiva____Powerful_Fusion_Music____s0hx2r.mp4"
  },
  {
    id: "spir-4",
    title: "jesus love of god",
    artist: "Christian Hymns",
    cover: "/CoverPages/coverj1.webp",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766568509/jesus_cd3n1k.mp3"
  },
  {
    id: "spir-5",
    title: "Cosmic Energy",
    artist: "Universe Sounds",
    cover: "/CoverPages/coverg1.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567270/Gajananam_-_Armonian_wkua19.mp4"
  },
  {
    id: "spir-6",
    title: "Shree Ram Stuti",
    artist: "Devotional Bhajans",
    cover: "/CoverPages/coverR1.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567294/Shree_Ram_Stuti___Sonika_Sharma_Agarwal___Ram_Bhajan___Vickky_Agarwal___Full_Video_-_Lyrical_fzsfde.mp4"
  },
  {
    id: "spir-7",
    title: "Hanuman power of devotion",
    artist: "Spiritual Beats",
    cover: "/CoverPages/coverh1.webp",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567281/Raghunandan_Slowed_Reverb___HanuMan_2023___pslofi_gnauex.mp4"
  },
  {
    id: "spir-8",
    title: "Flute of Peace",
    artist: "Radha Krishna",
    cover: "/CoverPages/coverk2.jpg",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766567555/Flute_of_Peace___Shri_Krishna_Relaxing_Instrumental_bblpix.mp4"
  },
];

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