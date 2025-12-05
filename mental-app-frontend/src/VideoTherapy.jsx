import { useState } from 'react';

import { useNavigate } from 'react-router-dom';



// Dummy Video Data

const yogaVideos = Array(8).fill({

  category: "Yoga",

  duration: "15:00",

  thumb: "https://placehold.co/600x400/teal/white?text=Yoga+Session",

  url: "https://www.w3schools.com/html/mov_bbb.mp4" // Sample Video

}).map((v, i) => ({ ...v, id: `yoga-${i}`, title: `Morning Yoga Flow ${i+1}` }));



const meditationVideos = Array(8).fill({

  category: "Meditation",

  duration: "10:00",

  thumb: "https://placehold.co/600x400/indigo/white?text=Meditation",

  url: "https://www.w3schools.com/html/movie.mp4" // Sample Video

}).map((v, i) => ({ ...v, id: `med-${i}`, title: `Deep Meditation ${i+1}` }));



function VideoTherapy() {

  const navigate = useNavigate();

  const [showAllYoga, setShowAllYoga] = useState(false);

  const [showAllMeditation, setShowAllMeditation] = useState(false);



  // Helper to render section

  const renderSection = (title, videos, showAll, setShowAll) => {

    const visibleVideos = showAll ? videos : videos.slice(0, 4);



    return (

      <div className="mb-12">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">

            {title}

          </h2>

          <button

            onClick={() => setShowAll(!showAll)}

            className="text-teal-600 hover:text-teal-800 font-semibold transition"

          >

            {showAll ? "Show Less" : "See More"}

          </button>

        </div>

       

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {visibleVideos.map((video) => (

            <div

              key={video.id}

              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"

              onClick={() => navigate("/video-player", { state: { video, allVideos: videos } })}

            >

              <div className="relative">

                <img src={video.thumb} alt={video.title} className="w-full h-40 object-cover" />

                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">

                  {video.duration}

                </span>

                {/* Play Icon overlay */}

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">

                  <span className="text-white text-4xl opacity-80 group-hover:scale-110 transition">▶</span>

                </div>

              </div>

              <div className="p-4">

                <h3 className="font-bold text-gray-800 truncate">{video.title}</h3>

                <p className="text-sm text-gray-500 mt-1">{video.category}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    );

  };



  return (

    <div className="min-h-screen bg-gray-50 p-6 pb-20">

      <div className="max-w-6xl mx-auto">

        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-gray-900 font-medium">

          ← Back to Dashboard

        </button>

       

        <div className="bg-teal-600 text-white p-8 rounded-2xl mb-10 shadow-lg">

          <h1 className="text-3xl font-bold mb-2">Wellness Studio 🧘‍♀️</h1>

          <p className="opacity-90">Curated video guides to help you move your body and calm your mind.</p>

        </div>

       

        {renderSection("Yoga Guides", yogaVideos, showAllYoga, setShowAllYoga)}

        {renderSection("Meditation Sessions", meditationVideos, showAllMeditation, setShowAllMeditation)}

      </div>

    </div>

  );

}



export default VideoTherapy;

