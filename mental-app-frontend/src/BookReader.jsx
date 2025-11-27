import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BookReader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {};

  // -- STATE FOR JOKES --
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [reaction, setReaction] = useState(null);

  // -- STATE FOR MAGAZINE --
  const [isFlipped, setIsFlipped] = useState(false);

  if (!book) return <div className="p-10">No book selected.</div>;

  // -------------------------
  // 1. MAGAZINE VIEW (Flip & Full Screen)
  // -------------------------
  if (book.type === 'magazine') {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center text-white z-50 overflow-hidden">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white z-50 bg-black/50 px-3 py-1 rounded">✕ Close</button>
        
        <h2 className="absolute top-4 text-xl font-bold opacity-50">{book.title}</h2>
        
        {/* Flip Container */}
        <div className="relative w-[90vw] md:w-[600px] h-[80vh] cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front Page */}
            <div className="absolute inset-0 bg-white text-black p-8 shadow-2xl rounded-l-md backface-hidden flex flex-col justify-between">
                <div className="border-4 border-black h-full p-4">
                    <h1 className="text-6xl font-black uppercase text-center mt-10">VOGUE</h1>
                    <p className="text-center text-gray-500 mt-2">Mental Health Edition</p>
                    <div className="w-full h-64 bg-gray-200 mt-10 flex items-center justify-center text-gray-400">
                        [Cover Image]
                    </div>
                    <p className="absolute bottom-10 right-10 text-sm font-bold animate-bounce">Click to Flip ➔</p>
                </div>
            </div>

            {/* Back Page (Content) */}
            <div className="absolute inset-0 bg-yellow-100 text-black p-10 shadow-2xl rounded-r-md backface-hidden rotate-y-180">
                <h3 className="text-3xl font-serif font-bold mb-4">Top 10 Ways to Relax</h3>
                <div className="columns-2 gap-4 text-sm font-serif leading-relaxed">
                    <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p className="mb-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
                <div className="mt-8 p-4 bg-white border border-gray-300 shadow-sm">
                    <h4 className="font-bold">Editor's Note</h4>
                    <p className="italic text-xs">"Healing comes from within."</p>
                </div>
                <p className="absolute bottom-10 left-10 text-sm font-bold">Click to Close ↺</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // 2. NOVEL VIEW (Reading Environment)
  // -------------------------
  if (book.type === 'novel') {
    return (
      <div className="min-h-screen bg-[#fdf6e3] text-[#586e75] font-serif leading-loose p-6 md:p-12">
        <div className="max-w-2xl mx-auto bg-white p-10 shadow-lg border border-gray-100 min-h-[90vh]">
          
          <div className="flex justify-between items-center mb-10 border-b pb-4">
            <button onClick={() => navigate(-1)} className="text-sm uppercase tracking-widest hover:text-orange-500">← Library</button>
            <span className="text-xs uppercase text-gray-400">Chapter 1</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">{book.title}</h1>

          <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
            The morning sun filtered through the curtains, casting a warm golden glow across the room. It was a quiet day, the kind where time seemed to slow down just enough for you to catch your breath.
          </p>
          <p className="mb-6">
            She sat by the window, a warm cup of tea in her hands, watching the leaves dance in the gentle breeze. For the first time in a long while, her mind wasn't racing. The noise of the world had faded into a distant hum, replaced by the rhythmic ticking of the old grandfather clock in the hallway.
          </p>
          <p className="mb-6">
            "Peace," she whispered to herself, testing the word on her tongue. It felt foreign, yet welcome. Like an old friend returning after a long journey.
          </p>
          <p className="mb-6">
            She opened her book and began to read, letting the words wash over her like a gentle tide.
          </p>
          
          <div className="flex justify-center mt-12">
            <span className="text-2xl text-gray-300">***</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // 3. JOKES VIEW (Interactive Emojis)
  // -------------------------
  const jokeList = [
    "Why don't scientists trust atoms?\n\nBecause they make up everything!",
    "I told my wife she was drawing her eyebrows too high.\n\nShe looked surprised.",
    "Parallel lines have so much in common.\n\nIt’s a shame they’ll never meet.",
    "Why did the scarecrow win an award?\n\nBecause he was outstanding in his field!"
  ];

  const emojis = ['😂', '🤣', '😝', '🤯', '💀', '😊'];

  const handleEmojiClick = (emoji) => {
    setReaction(emoji);
    // Simple animation effect reset
    setTimeout(() => setReaction(null), 1000);
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full font-bold shadow-sm hover:shadow-md">← Back</button>
      
      {/* Joke Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl text-center transform transition-all hover:scale-105">
        <span className="text-6xl mb-4 block">🤡</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 whitespace-pre-line leading-relaxed">
          {jokeList[currentJokeIndex]}
        </h2>
        
        <button 
          onClick={() => setCurrentJokeIndex((prev) => (prev + 1) % jokeList.length)}
          className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition mb-8"
        >
          Next Joke ➔
        </button>

        {/* Reaction Section */}
        <div className="border-t pt-6">
            <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-bold">React to this joke!</p>
            <div className="flex justify-center gap-2 md:gap-4">
                {emojis.map((emoji) => (
                    <button 
                        key={emoji} 
                        onClick={() => handleEmojiClick(emoji)}
                        className={`text-3xl md:text-4xl hover:scale-125 transition-transform duration-200 p-2 rounded-full hover:bg-yellow-100 ${reaction === emoji ? 'scale-150 bg-yellow-200' : ''}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            {reaction && <div className="mt-2 text-green-600 font-bold animate-pulse">Thanks for laughing! +1 Serotonin</div>}
        </div>
      </div>
    </div>
  );
}

// Add these utility classes for the flip effect to your CSS or use style tags if Tailwind config isn't accessible
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(-180deg); }
`;
document.head.appendChild(style);

export default BookReader;