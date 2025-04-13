
import { useState } from 'react';
import Button from './Button';

const BODY_PARTS = [
  'chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs', 'glutes'
];

export default function RandomWorkoutModal({ onClose, onUseWorkout }) {
  const [selectedPart, setSelectedPart] = useState('');
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateWorkout() {
    if (!selectedPart) return alert('Please select a body part.');

    setLoading(true);
    try {
      const res = await fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPart/' + selectedPart, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid API response');

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5).map(ex => ({
        name: ex.name,
        gifUrl: ex.gifUrl,
        sets: [{ reps: '10-12', weight: '', notes: '' }],
      }));

      setGenerated(selected);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      alert('Failed to generate workout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-textPrimary">🎲 Generate Random Workout</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">Close</button>
        </div>

        <select
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value)}
          className="w-full border p-2 rounded text-sm"
        >
          <option value="">Select Body Part</option>
          {BODY_PARTS.map((part) => (
            <option key={part} value={part}>{part.charAt(0).toUpperCase() + part.slice(1)}</option>
          ))}
        </select>

        <Button onClick={generateWorkout} variant="primary">
          🎧 Generate Workout
        </Button>

        {loading && <p className="text-sm text-gray-500">Generating...</p>}

        {generated.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold text-sm text-textPrimary mb-2">Generated Workout</h3>
            {generated.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 border rounded p-3 bg-surface text-sm">
                <img
                  src={ex.gifUrl || 'https://via.placeholder.com/60'}
                  alt={ex.name}
                  className="w-14 h-14 rounded object-contain"
                />
                <div className="flex-1">
                  <p className="font-semibold capitalize">{ex.name}</p>
                  <p className="text-xs text-gray-500">Reps: {ex.sets[0].reps}</p>
                </div>
              </div>

            ))}
            <Button
              variant="success"
              onClick={() => onUseWorkout(generated)}
            >
              ✅ Use This Workout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
