import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

function DoctorsPage() {
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [minRating, setMinRating] = useState(0);

  // ✅ Initialize Navigation
  const navigate = useNavigate();

  // --- 1. Get User's Location ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError('');
        },
        () => {
          setError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  // --- 2. Fetch Doctors Based on Location (Simulated) ---
  useEffect(() => {
    if (location) {
      const fetchDoctors = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found. Please log in.');
          }

          const response = await fetch(
            `http://localhost:3000/doctors?lat=${location.lat}&lng=${location.lng}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch doctors from the server.');
          }

          const data = await response.json();
          setDoctors(data);
          setFilteredDoctors(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [location]);

  // --- 3. Apply Filters ---
  useEffect(() => {
    let result = doctors;
    result = result.filter(doctor => doctor.rating >= minRating);
    setFilteredDoctors(result);
  }, [minRating, doctors]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* =======================================================
            SECTION 1: VIRTUAL DOCTOR (AI)
           ======================================================= */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-3xl font-bold mb-2">Need to talk right now?</h2>
                <p className="text-purple-100 text-lg">
                    Our AI Virtual Psychiatrist, <strong>Dr. Nova</strong>, is available 24/7 to listen and help you cope.
                </p>
            </div>
            <button 
                onClick={() => navigate("/virtual-doctor")}
                className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 whitespace-nowrap"
            >
                Start Video Session 🤖
            </button>
        </section>

        {/* =======================================================
            SECTION 2: FIND A REAL DOCTOR (NEARBY)
           ======================================================= */}
        <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Find a Psychiatrist Near You</h1>
                    <p className="text-gray-500 mt-2">Based on your current location</p>
                </div>
                
                {/* Filter Dropdown */}
                <div className="mt-4 md:mt-0">
                    <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
                    <select
                        id="rating-filter"
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    >
                        <option value="0">Show All</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                    </select>
                </div>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-4 rounded-md mb-6">{error}</p>}
            {isLoading && <p className="text-blue-500 text-center text-lg animate-pulse">Locating clinics near you...</p>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between border border-gray-100">
                        <div>
                        <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600 mt-2 text-sm">📍 {doctor.address}</p>
                        </div>
                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                        <span className="flex items-center text-yellow-500 font-bold">
                            ⭐ {doctor.rating} <span className="text-gray-400 font-normal ml-1">({doctor.total_ratings})</span>
                        </span>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.name + " " + doctor.address)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                        >
                            Get Directions &rarr;
                        </a>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
                        <button onClick={() => setMinRating(0)} className="mt-2 text-indigo-600 hover:underline">Clear Filters</button>
                    </div>
                )}
                </div>
            )}
        </section>

      </div>
    </div>
  );
}

export default DoctorsPage;