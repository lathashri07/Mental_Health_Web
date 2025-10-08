import React, { useState, useEffect } from 'react';

function DoctorsPage() {
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [minRating, setMinRating] = useState(0);

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
    // This function will run only when 'location' is set.
    if (location) {
      const fetchDoctors = async () => {
        setIsLoading(true);
        try {
          // Get the JWT token from local storage to authorize the request
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found. Please log in.');
          }

          // Make the API call to your backend with lat/lng as query params
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
          setDoctors(data); // Store the original, unfiltered list
          setFilteredDoctors(data); // Set the list to be displayed
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false); // Stop loading, whether successful or not
        }
      };

      fetchDoctors();
    }
  }, [location]); // This effect depends on the 'location' state

  // --- 3. Apply Filters When a Filter Changes ---
  useEffect(() => {
    let result = doctors;

    // Filter by rating
    result = result.filter(doctor => doctor.rating >= minRating);

    setFilteredDoctors(result);
  }, [minRating, doctors]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Psychiatrist Near You</h1>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

        {/* --- NEW: Show loading message --- */}
        {isLoading && <p className="text-blue-500 text-center">Loading doctors near you...</p>}

        {!isLoading && !error && (
          <>
            {/* --- MODIFIED: Filter Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700">Minimum Rating</label>
              <select
                id="rating-filter"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="0">Any Rating</option>
                <option value="4">4 Stars & Up</option>
                <option value="4.5">4.5 Stars & Up</option>
              </select>
            </div>

            {/* --- MODIFIED: Doctor List --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                      {/* Use 'address' field from the API */}
                      <p className="text-gray-600 mt-1">{doctor.address}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      {/* Show rating and total number of ratings */}
                      <span className="text-yellow-500 font-bold">⭐ {doctor.rating} ({doctor.total_ratings} ratings)</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="md:col-span-3 text-center text-gray-500">No doctors found matching your criteria.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorsPage;