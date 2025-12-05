import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------
// UPDATED DATA SECTION
// ---------------------------------------------------------

const magazines = [
  { 
    id: 'mag1', 
    title: 'Peace', 
    type: 'magazine', 
    color: 'bg-red-200',
    // ✅ ADDED: Specific pages for this magazine
    pages: [
      '/Buddha/slide1.jpg', 
      '/Buddha/slide2.jpg',
      '/Buddha/slide3.jpg',
      '/Buddha/slide4.jpg',
      '/Buddha/slide5.jpg',
      '/Buddha/slide6.jpg',
      '/Buddha/slide7.jpg',
      '/Buddha/slide8.jpg'
    ]
  },
  { 
    id: 'mag2', 
    title: 'Beach Vibes', 
    type: 'magazine', 
    color: 'bg-green-200',
    // ✅ ADDED: Different pages for the second magazine
    pages: [
      '/Beach/slide1.jpg', 
      '/Beach/slide2.jpg',
      '/Beach/slide3.jpg',
      '/Beach/slide4.jpg',
      '/Beach/slide5.jpg',
      '/Beach/slide6.jpg',
      '/Beach/slide7.jpg',
      '/Beach/slide8.jpg'
    ]
  },
  { 
    id: 'mag3', 
    title: 'Dream', 
    type: 'magazine', 
    color: 'bg-blue-200',
    // ✅ ADDED: Pages for third magazine
    pages: [
      '/Motivation/slide1.jpg', 
      '/Motivation/slide2.jpg',
      '/Motivation/slide3.jpg',
      '/Motivation/slide4.jpg',
      '/Motivation/slide5.jpg',
      '/Motivation/slide6.jpg',
      '/Motivation/slide7.jpg',
      '/Motivation/slide8.jpg'
    ]
  },
  { 
    id: 'mag4', 
    title: 'Nature', 
    type: 'magazine', 
    color: 'bg-purple-200',
    pages: [
      '/Nature/slide1.jpg', 
      '/Nature/slide2.jpg',
      '/Nature/slide3.jpg',
      '/Nature/slide4.jpg',
      '/Nature/slide5.jpg',
      '/Nature/slide6.jpg',
      '/Nature/slide7.jpg',
      '/Nature/slide8.jpg'
    ]
  },
];

// (Novels and Jokes stay mostly the same, but we ensure they have IDs)
const novels = [
  { 
    id: 'nov1', 
    title: 'The Silent Hill', 
    type: 'novel', 
    color: 'bg-amber-100',
    // ✅ ADDED: Path to your PDF file
    pdf: '/Novels/AsAManThinketh.pdf' 
  },
  { 
    id: 'nov2', 
    title: 'Journey Within', 
    type: 'novel', 
    color: 'bg-orange-100',
    pdf: '/novels/journey-within.pdf'
  },
  { 
    id: 'nov3', 
    title: 'Ocean Whisper', 
    type: 'novel', 
    color: 'bg-cyan-100',
    pdf: '/novels/ocean-whisper.pdf'
  },
  { 
    id: 'nov4', 
    title: 'Lost in Time', 
    type: 'novel', 
    color: 'bg-slate-200',
    pdf: '/novels/lost-in-time.pdf'
  },
];

const jokes = [
  { id: 'joke1', title: 'Dad Jokes 101', type: 'joke', color: 'bg-yellow-200' },
  { id: 'joke2', title: 'Office Humor', type: 'joke', color: 'bg-pink-200' },
  { id: 'joke3', title: 'Animal Puns', type: 'joke', color: 'bg-lime-200' },
  { id: 'joke4', title: 'Daily Giggles', type: 'joke', color: 'bg-fuchsia-200' },
];

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

function BooksLibrary() {
  const navigate = useNavigate();

  const renderSection = (title, items) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-amber-500 inline-block pb-1">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            // THIS LINE SENDS THE DATA (including the new pages array)
            onClick={() => navigate('/book-reader', { state: { book: item } })}
            className={`${item.color} h-40 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-white`}
          >
            <span className="text-4xl mb-2">
              {item.type === 'magazine' ? '📰' : item.type === 'novel' ? '📖' : '🃏'}
            </span>
            <h3 className="font-bold text-center text-gray-800">{item.title}</h3>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Click to Open</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-amber-800 font-bold hover:underline">
          ← Back to Dashboard
        </button>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-amber-700">Library 📚</h1>
          <p className="text-gray-600">Select a category to start reading.</p>
        </div>

        {renderSection("Magazines (Flip Mode)", magazines)}
        {renderSection("Novels (Reading Mode)", novels)}
        {renderSection("Jokes (Laugh Mode)", jokes)}
      </div>
    </div>
  );
}

export default BooksLibrary;