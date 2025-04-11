import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import { useState } from "react";

export default function StartBlankWorkoutPage() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [searchResultsByIndex, setSearchResultsByIndex] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);

  const navigate = useNavigate();

  function addExercise() {
    setExercises([
      ...exercises,
      {
        name: '',
        search: '',
        sets: [{ weight: '', reps: '', notes: '' }],
      }
    ]);
  }

  function removeExercise(index) {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated);
  }

  function addSet(exIndex) {
    const updated = [...exercises];
    updated[exIndex].sets.push({ reps: '', notes: '' });
    setExercises(updated);
  }

  function removeSet(exIndex, setIndex) {
    const updated = [...exercises];
    updated[exIndex].sets.splice(setIndex, 1);
    setExercises(updated);
  }

  function updateExerciseName(index, name) {
    const updated = [...exercises];
    updated[index].name = name;
    setExercises(updated);
  }

  function updateExerciseSearch(index, value) {
    const updated = [...exercises];
    updated[index].search = value;
    setExercises(updated);
  }

  function updateSetsReps(exIndex, setIndex, reps) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].reps = reps;
    setExercises(updated);
  }

  function updateSetNotes(exIndex, setIndex, note) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].notes = note;
    setExercises(updated);
  }

  function updateSetWeight(exIndex, setIndex, weight) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].weight = weight;
    setExercises(updated);
  }

  function updateSetComplete(exIndex, setIndex, checked) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].complete = checked;
    setExercises(updated);
  }


  async function handleSearch(query, index) {
    if (!query.trim()) {
      setSearchResultsByIndex((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    setLoadingIndex(index);

    try {
      const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${query.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      const data = await res.json();
      setSearchResultsByIndex((prev) => ({
        ...prev,
        [index]: Array.isArray(data) ? data.slice(0, 10) : []
      }));
    } catch (err) {
      console.error('Exercise search failed:', err);
    }

    setLoadingIndex(null);
  }

  async function handleSavedWorkout() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert('User not found');
      return;
    }

    const { error } = await supabase.from('user_workouts').insert([{
      user_id: user.id,
      name: workoutName,
      exercises: exercises,
    }]);

    if (error) {
      console.error('Failed to save workout');
    } else {
      alert('Workout saved!');
      navigate('/workouts');
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-textPrimary'>Start a New Workout</h1>

      <input
        type='text'
        placeholder='Workout name'
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className='w-full p-2 rounded border border-border bg-surface text-textPrimary'
      />

      {exercises.map((exercise, exIndex) => (
        <div key={exIndex} className='bg-surface p-4 rounded shadow-md space-y-4'>
          <input
            type="text"
            placeholder="Search exercises"
            value={exercise.search}
            onChange={(e) => {
              updateExerciseSearch(exIndex, e.target.value);
              handleSearch(e.target.value, exIndex);
            }}
            className="w-full p-2 rounded border border-border bg-background text-textPrimary"
          />

          {exercise.name && (
            <div className='flex justify-between items-center'>
              <h4 className='text-md font-semibold text-textPrimary'>
                Selected: {exercise.name}
              </h4>
              <button
                onClick={() => removeExercise(exIndex)}
                className='text-sm text-red hover:underline'
              >
                Remove
              </button>
            </div>
          )}

          <ul className="mt-2 space-y-1 text-sm text-textSecondary">
            {loadingIndex === exIndex && <li>Loading...</li>}
            {searchResultsByIndex[exIndex]?.map((ex, idx) => (
              <li
                key={idx}
                className="cursor-pointer hover:bg-surface p-2 rounded"
                onClick={() => {
                  updateExerciseName(exIndex, ex.name);
                  updateExerciseSearch(exIndex, '');
                  setSearchResultsByIndex((prev) => ({
                    ...prev,
                    [exIndex]: []
                  }));
                }}
              >
                {ex.name}
              </li>
            ))}
          </ul>

          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <span className="text-sm text-gray w-14">Set {setIndex + 1}</span>

            <input
              type="number"
              placeholder="Weight"
              value={set.weight}
              onChange={(e) => updateSetWeight(exIndex, setIndex, e.target.value)}
              className="p-2 rounded border border-border bg-background text-sm w-24"
            />
            
            
            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => updateSetsReps(exIndex, setIndex, e.target.value)}
              className="p-2 rounded border border-border bg-background text-sm w-20"
            />

            <label className='flex items-center gap-1 text-sm text-textSecondary cursor-pointer'>
            <input
              type="checkbox"
              checked={set.complete}
              onChange={(e) => updateSetComplete(exIndex, setIndex, e.target.checked)}
              className="w-4 h-4"
            />
              Complete
            </label>


            <input
              type="text"
              placeholder="Notes"
              value={set.notes}
              onChange={(e) => updateSetNotes(exIndex, setIndex, e.target.value)}
              className="p-2 rounded border border-border bg-background text-sm flex-1 min-w-[180px]"
            />

            <button
              onClick={() => removeSet(exIndex, setIndex)}
              className="text-xs text-red hover:underline"
            >
              Remove
            </button>
          </div>

          ))}

          <Button variant='secondary' onClick={() => addSet(exIndex)}>
            ➕ Add Set
          </Button>
        </div>
      ))}

      <Button variant="secondary" onClick={() => navigate('/workouts')}>
        ❌ Cancel Workout
      </Button>

      <div className='flex flex-col sm:flex-row gap-4'>
        <Button variant='primary' onClick={addExercise}>
          ➕ Add Exercise
        </Button>

        <Button
          variant='primary'
          onClick={() => navigate('/workouts/review', {
            state: { workoutName, exercises },
          })}
        >
          💾 Review and Save
        </Button>
      </div>
    </div>
  );
}
