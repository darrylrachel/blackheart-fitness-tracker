
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';

export default function StartBlankWorkoutPage() {
  const location = useLocation();
  const preload = location.state?.exercises ?? [];
  const [exercises, setExercises] = useState(preload);

  function handleAddExercise() {
    setExercises(prev => [
      ...prev,
      {
        name: '',
        search: '',
        sets: [{ weight: '', reps: '', notes: '' }]
      }
    ]);
  }

  function handleSetChange(index, setIndex, field, value) {
    setExercises(prev => {
      const copy = [...prev];
      copy[index].sets[setIndex][field] = value;
      return copy;
    });
  }

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">📝 Build Your Workout</h1>

      <Button variant="primary" onClick={handleAddExercise}>
        ➕ Add Exercise
      </Button>

      {exercises.map((exercise, i) => (
        <div key={i} className="bg-white shadow rounded p-4 space-y-2">

          {exercise.gifUrl && (
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-16 h-16 object-contain rounded mb-2"
            />
          )}


          <input
            type="text"
            className="border p-2 w-full text-sm rounded"
            placeholder="Exercise Name"
            value={toTitleCase(exercise.name)}
            onChange={(e) => {
              const updated = [...exercises];
              updated[i].name = e.target.value;
              setExercises(updated);
            }}
          />

          {exercise.sets.map((set, j) => (
            <div key={j} className="flex gap-2 text-sm">
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) =>
                  handleSetChange(i, j, 'weight', e.target.value)
                }
                className="border p-1 rounded w-24"
              />
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) =>
                  handleSetChange(i, j, 'reps', e.target.value)
                }
                className="border p-1 rounded w-24"
              />
              <input
                type="text"
                placeholder="Notes"
                value={set.notes}
                onChange={(e) =>
                  handleSetChange(i, j, 'notes', e.target.value)
                }
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={() => {
                  setExercises((prev) => prev.filter((_, idx) => idx !== i));
                }}
                className="ml-2 text-sm text-red-600 hover:underline"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
