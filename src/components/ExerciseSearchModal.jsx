
import { useEffect, useState } from 'react';

export default function ExerciseSearchModal({ onClose, onAdd, selectedExercises, onContinue }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchExercises = async () => {
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
        if (!Array.isArray(data)) {
          throw new Error(data.message || 'Unexpected API response');
        }

        const filtered = data.filter((ex) =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setResults(filtered.slice(0, 20));
      } catch (err) {
        console.error('API Error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchExercises();
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 shadow max-w-3xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Search Exercises</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">Close</button>
        </div>

        <input
          type="text"
          placeholder="e.g. squat, push up, curl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded text-sm border-gray-300"
        />

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No results found.</p>
          ) : (
            results.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center gap-4 p-3 border rounded-lg bg-surface shadow-sm hover:bg-gray-50"
              >
                <img
                  src={exercise.gifUrl || 'https://via.placeholder.com/60'}
                  alt={exercise.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm capitalize text-textPrimary">{exercise.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    Target: {exercise.target} | Equipment: {exercise.equipment}
                  </p>
                </div>
                <button
                  onClick={() => onAdd(exercise)}
                  className="text-sm px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark"
                >
                  ➕ Add
                </button>
              </div>
            ))
          )}
        </div>

        {selectedExercises?.length > 0 && (
          <div className="pt-4 border-t mt-4 flex justify-end">
            <button
              onClick={onContinue}
              className="text-sm px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              ✅ Continue with Selected ({selectedExercises.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
