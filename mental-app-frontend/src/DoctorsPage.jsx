import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
// Replace this with actual API call results later.
const mockDoctors = [
  { id: 1, name: 'Dr. Anjali Rao', gender: 'Female', fees: 1500, rating: 4.8, location: 'Koramangala' },
  { id: 2, name: 'Dr. Vikram Singh', gender: 'Male', fees: 2000, rating: 4.9, location: 'Indiranagar' },
  { id: 3, name: 'Dr. Priya Sharma', gender: 'Female', fees: 1200, rating: 4.5, location: 'Jayanagar' },
  { id: 4, name: 'Dr. Rohan Gupta', gender: 'Male', fees: 1800, rating: 4.7, location: 'HSR Layout' },
  { id: 5, name: 'Dr. Sunita Desai', gender: 'Female', fees: 2200, rating: 4.6, location: 'Whitefield' }
];
// --- END MOCK DATA ---

function DoctorsPage() {
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [error, setError] = useState('');

  // Filter states
  const [feeRange, setFeeRange] = useState(2500); // Max fee
  const [gender, setGender] = useState('any');
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
    if (location) {
      // **IMPORTANT**: In a real app, you would make an API call here.
      // You'd send `location.lat` and `location.lng` to your backend or
      // directly to an API like Google Places to find nearby psychiatrists.
      console.log('Fetching doctors near:', location);
      // For now, we just use the mock data.
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors); // Initially, show all doctors
    }
  }, [location]);

  // --- 3. Apply Filters When a Filter Changes ---
  useEffect(() => {
    let result = doctors;

    // Filter by fee
    result = result.filter(doctor => doctor.fees <= feeRange);

    // Filter by gender
    if (gender !== 'any') {
      result = result.filter(doctor => doctor.gender.toLowerCase() === gender);
    }

    // Filter by rating
    result = result.filter(doctor => doctor.rating >= minRating);

    setFilteredDoctors(result);
  }, [feeRange, gender, minRating, doctors]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Psychiatrist Near You</h1>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {!location && !error && <p className="text-blue-500">Getting your location...</p>}

        {location && (
          <>
            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fee Filter */}
              <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Max Fee: ₹{feeRange}</label>
                <input
                  type="range"
                  id="fee"
                  min="500"
                  max="3000"
                  step="100"
                  value={feeRange}
                  onChange={(e) => setFeeRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                 <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="0">Any</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="4.5">4.5 Stars & Up</option>
                </select>
              </div>
            </div>

            {/* Doctor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.gender}</p>
                    <p className="text-gray-600">{doctor.location}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-semibold text-green-600">₹{doctor.fees}</span>
                      <span className="text-yellow-500 font-bold">⭐ {doctor.rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="md:col-span-3 text-center text-gray-500">No doctors found with the selected filters.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorsPage;