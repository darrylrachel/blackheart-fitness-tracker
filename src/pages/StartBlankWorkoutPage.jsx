import Button from '..//components/Button';
import { useState } from "react";

export default function StartBlankWorkoutPage() {
  const [workoutName, setWorkoutName] = useState();
  const [exercises, setExercises] = useState();

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
            type='text'
            placeholder='Exercise name'
            value={exercise.name}
            onChange={(e) => updateExerciseName(exIndex, e.target.value)}
            className='w-full p-2 rounded border border-border bg-background text-textPrimary'
          />

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

          <Button variant='primary' onClick={() => console.log({ workoutName, exercises })}>
            💾 Finish and Save
          </Button>
    </div>
  );
}
