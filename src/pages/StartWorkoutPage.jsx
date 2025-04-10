import { useState } from 'react';
import Button from '../components/Button';

const mockWorkouts = [
  { id: 1, name: 'Push Day', muscles: 'Chest, Shoulders, Triceps' },
  { id: 2, name: 'Pull Day', muscles: 'Back, Biceps' },
  { id: 3, name: 'Leg Day', muscles: 'Quads, Hamstrings, Glutes' },
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
            <Button onClick={handleStart}>Begin Workout</Button>
          </div>
        )}
      </div>
    );
  }