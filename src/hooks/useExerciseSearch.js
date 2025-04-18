import { useEffect, useState } from 'react';

export default function ExerciseSearchModal({ onClose, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Using API key:", import.meta.env.VITE_RAPIDAPI_KEY);

    const searchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://exercisedb.p.rapidapi.com/exercises?limit=200&offset=0',
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },
          }
        );

        const data = await res.json();
        console.log('🔍 API Response:', data);

        if (!Array.isArray(data)) {
          throw new Error(data.message || 'Unexpected response from API');
        }

        const filtered = data.filter((ex) =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setResults(filtered.slice(0, 10));
      } catch (err) {
        console.error('❌ API Error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 shadow max-w-xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Search Exercises</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No results found.</p>
          ) : (
            filtered.map((exercise) => (
              <div key={exercise.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    Target: {exercise.target} | Equipment: {exercise.equipment}
                  </p>
                </div>
                <button
                  onClick={() => onAdd(exercise)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Add to Workout
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
