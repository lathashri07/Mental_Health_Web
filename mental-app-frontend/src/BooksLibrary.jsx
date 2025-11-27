import { useNavigate } from 'react-router-dom';

// Dummy Data
const magazines = [
  { id: 'mag1', title: 'Mindful Living', type: 'magazine', color: 'bg-red-200' },
  { id: 'mag2', title: 'Nature Weekly', type: 'magazine', color: 'bg-green-200' },
  { id: 'mag3', title: 'Tech Detox', type: 'magazine', color: 'bg-blue-200' },
  { id: 'mag4', title: 'Art & Soul', type: 'magazine', color: 'bg-purple-200' },
];

const novels = [
  { id: 'nov1', title: 'The Silent Hill', type: 'novel', color: 'bg-amber-100' },
  { id: 'nov2', title: 'Journey Within', type: 'novel', color: 'bg-orange-100' },
  { id: 'nov3', title: 'Ocean Whisper', type: 'novel', color: 'bg-cyan-100' },
  { id: 'nov4', title: 'Lost in Time', type: 'novel', color: 'bg-slate-200' },
];

const jokes = [
  { id: 'joke1', title: 'Dad Jokes 101', type: 'joke', color: 'bg-yellow-200' },
  { id: 'joke2', title: 'Office Humor', type: 'joke', color: 'bg-pink-200' },
  { id: 'joke3', title: 'Animal Puns', type: 'joke', color: 'bg-lime-200' },
  { id: 'joke4', title: 'Daily Giggles', type: 'joke', color: 'bg-fuchsia-200' },
];

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