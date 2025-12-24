import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- YOGA VIDEOS DATA (8 Items) ---
const yogaVideos = [
  {
    id: "yoga-1",
    title: "Morning Yoga Flow",
    category: "Yoga",
    duration: "15:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Morning+Flow", 
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557496/15-Minute_Morning_Yoga_Full_Body_Stretch___%E0%A4%B0%E0%A5%8B%E0%A5%9B_%E0%A4%B8%E0%A5%81%E0%A4%AC%E0%A4%B9_%E0%A4%95%E0%A5%87_%E0%A4%B2%E0%A4%BF%E0%A4%8F_15_%E0%A4%AE%E0%A4%BF%E0%A4%A8%E0%A4%9F_%E0%A4%95%E0%A4%BE_%E0%A4%AF%E0%A5%8B%E0%A4%97_satvicyoga_pvoc7p.mp4" 
  },
  {
    id: "yoga-2",
    title: "Yoga for Panic & Anxiety",
    category: "Yoga",
    duration: "12:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Panic+Anxiety",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557493/Yoga_For_Panic_And_Anxiety___15_Minute_Yoga_Practice_rxz9va.mp4"
  },
  {
    id: "yoga-3",
    title: "Yoga for neck, shoulders & upper back",
    category: "Yoga",
    duration: "18:00",
    thumb: "https://placehold.co/600x400/teal/white?text=neck+shoulders",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766556192/Yoga_For_Neck_Shoulders_Upper_Back___10-Minute_Yoga_Quickie_dy6ji0.mp4"
  },
  {
    id: "yoga-4",
    title: "Full body yoga flow",
    category: "Yoga",
    duration: "20:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Anxiety+Relief",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557478/15_Minute_Morning_Yoga_For_Beginners___Full_Body_Stretch_oihmtf.mp4"
  },
  {
    id: "yoga-5",
    title: "Balance & Core",
    category: "Yoga",
    duration: "10:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Balance+Core",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557477/15-Min_Self-Compassion_Yoga___Gentle_Stretch_to_Reduce_Stress_Build_Self-Love_xo3vif.mp4"
  },
  {
    id: "yoga-6",
    title: "Bedtime Yoga",
    category: "Yoga",
    duration: "15:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Bedtime+Yoga",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557459/15_MIN_HIP_RELEASE_STRETCH___Stretches_For_Low_Back_Pain_Relief_Tight_Hips_Yoga_With_Nancy_ry1ymi.mp4"
  },
  {
    id: "yoga-7",
    title: "Flexibility Booster",
    category: "Yoga",
    duration: "25:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Flexibility+Booster",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557440/15_min_Gentle_Yoga_for_Flexibility_Stress_Reduction_oyh4mp.mp4"
  },
  {
    id: "yoga-8",
    title: "Power yoga session",
    category: "Yoga",
    duration: "14:00",
    thumb: "https://placehold.co/600x400/teal/white?text=Power+Yoga",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766557379/10-Minute_Yoga_for_Beginners___Daily_Fitness___Saurabh_Bothra_hxcsx2.mp4"
  },
];

// --- MEDITATION/MUSIC DATA (8 Items) ---
const meditationVideos = [
  {
    id: "med-1",
    title: "Pranayama for beginners",
    category: "Meditation",
    duration: "10:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Pranayama",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558665/Pranayama_For_Beginners___10_mins_to_release_stress_tptizw.mp4"
  },
  {
    id: "med-2",
    title: "Meditation for inner peace",
    category: "Meditation",
    duration: "05:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Inner+Peace",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558663/Guided_Morning_Meditation___15_Minutes_For_Inner_Peace_A_Guaranteed_Perfect_Day_lyfgdy.mp4"
  },
  {
    id: "med-3",
    title: "Sky sounds for relaxation",
    category: "Meditation",
    duration: "30:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Sky+Sounds",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558650/Guided_Mindfulness_Meditation_for_the_Morning__Starting_the_Day_15_minutes_u4zlea.mp4"
  },
  {
    id: "med-4",
    title: "Guided Mindfulness",
    category: "Meditation",
    duration: "12:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Mindfulness",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558638/FOCUS_Meditation___7_mins_l4ap07.mp4"
  },
  {
    id: "med-5",
    title: "Positive Energy",
    category: "Meditation",
    duration: "15:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Positive+Energy",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558634/15_Minute_Meditation_for_Intuition_Confidence_Inner_Strength___30_Day_Meditation_Challenge_wgc1r4.mp4"
  },
  {
    id: "med-6",
    title: "Breathing Exercises",
    category: "Meditation",
    duration: "08:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Breathing",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558621/15_Minute_Guided_Meditation___Strength_Grounding_In_Stressful_Times_h3wnfi.mp4"
  },
  {
    id: "med-7",
    title: "Chakra Balance",
    category: "Meditation",
    duration: "20:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Chakra+Balance",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558605/15_Minute_Chakra_Balance_Guided_Meditation_i8uzam.mp4"
  },
  {
    id: "med-8",
    title: "Meditation for reducing overthinking",
    category: "Meditation",
    duration: "18:00",
    thumb: "https://placehold.co/600x400/indigo/white?text=Reduce+Overthinking",
    url: "https://res.cloudinary.com/dvqthpmp6/video/upload/v1766558597/10_Min_Meditation_to_Quiet_Your_Thoughts_Relax_ibfbzp.mp4"
  },
];

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

