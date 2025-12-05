import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';

function BookReader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {};

  // -- STATE FOR JOKES --
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [reaction, setReaction] = useState(null);

  // -- STATE FOR MAGAZINE --
  const [isFullScreen, setIsFullScreen] = useState(false);
  const bookRef = useRef();

  const enterFullScreen = () => {
    setIsFullScreen(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.log(err));
    }
  };

  const exitFullScreen = () => {
    setIsFullScreen(false);
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  if (!book) return <div className="p-10">No book selected.</div>;

  // -------------------------
  // 1. MAGAZINE VIEW (Dynamic & Flip)
  // -------------------------
  if (book.type === 'magazine') {
    const pages = book.pages || [];
    
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        
        {/* --- PREVIEW MODE --- */}
        {!isFullScreen && (
          <div className="text-center">
            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              ← Back to Library
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">{book.title}</h1>

            <div 
              className="relative w-[300px] h-[400px] mx-auto cursor-pointer shadow-2xl hover:scale-105 transition-transform duration-300"
              onClick={enterFullScreen}
            >
               {/* Cover Image */}
              <img 
                src={pages[0]} 
                alt="Cover" 
                // ✅ CHANGED: object-cover ensures preview looks nice without whitespace
                className="w-full h-full object-cover rounded-md border border-gray-300" 
              />
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                <span className="bg-white text-black px-6 py-2 font-bold rounded-full shadow-lg">
                  Read Full Screen ⤢
                </span>
              </div>
            </div>
            <p className="mt-4 text-gray-500">Click the cover to start reading</p>
          </div>
        )}

        {/* --- FULL SCREEN READING MODE --- */}
        {isFullScreen && (
          <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Top Controls */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/70 to-transparent">
               <h2 className="text-white font-bold text-lg">{book.title}</h2>
               <button 
                 onClick={exitFullScreen}
                 className="bg-white/20 hover:bg-white/40 text-white px-4 py-1 rounded border border-white/50 backdrop-blur-sm"
               >
                 ✕ Close View
               </button>
            </div>

            {/* The Flip Book */}
            <div className="flex items-center justify-center h-full w-full py-10">
                <HTMLFlipBook 
                    width={450} 
                    height={600} 
                    showCover={true}
                    mobileScrollSupport={true}
                    className="shadow-2xl"
                    ref={bookRef}
                >
                    {pages.map((pageUrl, index) => (
                        // ✅ CHANGED: Removed border and bg-white to prevent white lines
                        <div key={index} className="h-full w-full overflow-hidden">
                            <img 
                                src={pageUrl} 
                                alt={`Page ${index + 1}`} 
                                // ✅ CHANGED: 'object-fill' stretches image to exact size (no whitespace)
                                // If you prefer it not to stretch but cut off edges, use 'object-cover'
                                className="w-full h-full object-fill" 
                            />
                            {/* Page Number (Optional - you can remove this if it covers content) */}
                            <span className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/50 px-1 rounded">
                                {index + 1}
                            </span>
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>

            <div className="absolute bottom-5 text-white/50 text-sm animate-pulse">
                Click pages or drag corners to flip
            </div>

          </div>
        )}
      </div>
    );
  }

  // -------------------------
  // 2. NOVEL VIEW (Reading Environment)
  // -------------------------
  if (book.type === 'novel') {
    return (
      <div className="h-screen flex flex-col bg-gray-900">
        
        {/* Navigation Bar */}
        <div className="bg-white p-4 flex justify-between items-center shadow-md z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-orange-500 flex items-center gap-2"
          >
            <span>←</span> Back to Library
          </button>
          <span className="font-bold text-gray-800">{book.title}</span>
        </div>

        {/* PDF Viewer (Iframe) */}
        <div className="flex-grow w-full h-full bg-gray-200">
          {book.pdf ? (
            <iframe
              src={book.pdf}
              title={book.title}
              className="w-full h-full border-none"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              PDF file not found. Please check the path.
            </div>
          )}
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
  ];
  const emojis = ['😂', '🤣', '😝', '🤯', '💀', '😊'];
  const handleEmojiClick = (emoji) => {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 1000);
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full font-bold shadow-sm hover:shadow-md">← Back</button>
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
        <div className="border-t pt-6">
            <div className="flex justify-center gap-2 md:gap-4">
                {emojis.map((emoji) => (
                    <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-3xl p-2 rounded-full hover:bg-yellow-100">{emoji}</button>
                ))}
            </div>
            {reaction && <div className="mt-2 text-green-600 font-bold animate-pulse">Thanks for laughing!</div>}
        </div>
      </div>
    </div>
  );
}

export default BookReader;