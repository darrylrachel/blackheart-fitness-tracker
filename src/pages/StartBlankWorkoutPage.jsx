import useExerciseSearch from '../hooks/useExerciseSearch';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '..//components/Button';
import { useState } from "react";

export default function StartBlankWorkoutPage() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const { exercises: searchResults, loading } = useExerciseSearch(search);
  const navigate = useNavigate();
  

  function addExercise() {
    setExercises([...exercises, {
      name: '',
      sets: [{ reps: ''}],
    }]);
  }

  function addSet(exerciseIndex) {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: ''});
    setExercises(updated);
  }

  function updateExerciseName(index, name) {
    const updated = [...exercises];
    updated[index].name = name;
    setExercises(updated);
  }

  function updateSetsReps(exIndex, setIndex, reps) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].reps = reps;
    setExercises(updated)
  }

  async function handleSavedWorkout() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert('User not found');
      return;
    }

    const { error } = await supabase.from('user_workouts').insert([
      {
        user_id: user.id,
        name: workoutName,
        exercises: exercises // JSONB in supabase
      },
    ]);

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
          {/* <input 
            type='text'
            placeholder='Exercise name'
            value={exercise.name}
            onChange={(e) => updateExerciseName(exIndex, e.target.value)}
            className='w-full p-2 rounded border border-border bg-background text-textPrimary'
          /> */}

          <input
            type="text"
            placeholder="Search exercises"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded border border-border bg-background text-textPrimary"
          />

            <ul className="mt-2 space-y-1 text-sm text-textSecondary">
              {loading && <li>Loading...</li>}
              {searchResults.map((ex, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:bg-surface p-2 rounded"
                  onClick={() => {
                    updateExerciseName(exIndex, ex.name);
                    setSearch(''); // reset after select
                  }}
                >
                  {ex.name}
                </li>
              ))}
            </ul>


          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className='flex items-center gap-4'>
              <span className='text-sm text-gray w-14'>Set {setIndex + 1}</span>
              <input 
                type='number'
                placeholder='Reps'
                value={set.reps}
                onChange={(e) => updateSetsReps(exIndex, setIndex, e.target.value)}
                className='p-2 rounded border border-border bg-background text-sm w-24'
              />
            </div>
          ))}

          <Button variant='secondary' onClick={() => addSet(exIndex)}>
            ➕ Add Set
          </Button>
        </div>
      ))}

          <Button variant='primary' onClick={addExercise}>
            ➕ Add Exercise
          </Button>

          <Button variant='primary' onClick={handleSavedWorkout}>
            💾 Finish and Save
          </Button>
    </div>
  );
}
