import { useState } from 'react';
import Button from '../components/Button';

const mockWorkouts = [
  {
    id: 1,
    name: 'Push Day',
    muscles: 'Chest, Shoulders, Triceps',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10' },
      { name: 'Overhead Shoulder Press', sets: 3, reps: '10-12' },
      { name: 'Tricep Dips', sets: 3, reps: '12-15' },
    ],
  },
  {
    id: 2,
    name: 'Pull Day',
    muscles: 'Back, Biceps',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '5-8' },
      { name: 'Pull-ups', sets: 3, reps: 'Max' },
      { name: 'Barbell Rows', sets: 3, reps: '8-10' },
    ],
  },
  {
    id: 3,
    name: 'Leg Day',
    muscles: 'Quads, Hamstrings, Glutes',
    exercises: [
      { name: 'Squats', sets: 4, reps: '6-10' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-12' },
      { name: 'Walking Lunges', sets: 3, reps: '12 steps' },
    ],
  },
];


export default function StartWorkoutPage() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  function handleStart() {
    console.log('Workout started:', selectedWorkout);
    // Late: save to supabase, redirect to workout tracker
  }

    return (
      <div className=''space-y-6>
        <h1 className='text-2xl font-bold text-textPrimary'>Start a New Workout</h1>

        {!selectedWorkout ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {mockWorkouts.map((workout) => (
              <div
                key={workout.id}
                className='bg-surface rounded-xl shadow-md p-4 cursor-pointer hover:ring-2 hover:ring-accent transition' onClick={() => setSelectedWorkout(workout)}
              >
                <h2 className='text-lg font-semibold text-textPrimary'>{workout.name}</h2>
                <p className='text-sm text-textSecondary'>{workout.muscles}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-surface p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-textPrimary">{selectedWorkout.name}</h2>
              <p className="text-sm text-textSecondary">{selectedWorkout.muscles}</p>
            </div>
            {selectedWorkout.exercises && (
              <div className='bg-surface rounded-xl shadow-md-p4'>
                <h3 className='text-lg font-bold text-textPrimary mb-2'>Exercise</h3>
                <ul className='text-sm text-textSecondary space-y-2'>
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <li key={index}>
                      <span className='font-medium text-textPrimary'>{exercise.name}</span> - {exercise.sets} sets X {exercise.reps}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleStart}>Begin Workout</Button>
          </div>
        )}
      </div>
    );
  }