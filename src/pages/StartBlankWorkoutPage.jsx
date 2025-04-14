
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ExerciseCard from '../components/ExerciseCardWithCoachTip';

export default function StartBlankWorkoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const preload = location.state?.exercises ?? [];
  const [exercises, setExercises] = useState(preload);
  const [workoutName, setWorkoutName] = useState(location.state?.title || '');

  function handleAddExercise() {
    setExercises(prev => [
      ...prev,
      {
        name: '',
        search: '',
        sets: [{ weight: '', reps: '', notes: '' }],
      },
    ]);
  }

  function handleFinishWorkout() {
    navigate('/workouts/summary', {
      state: {
        exercises,
        workoutName: workoutName || 'Custom Workout',
      }
    });
  }

  return (
    <div className="space-y-6 px-4 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold text-textPrimary">📝 Build Your Workout</h1>

      <input
        type="text"
        placeholder="Workout Title (optional)"
        className="border w-full p-2 rounded text-sm"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />

      <Button variant="primary" onClick={handleAddExercise} className="w-full sm:w-auto">
        ➕ Add Exercise
      </Button>

      <div className="space-y-6">
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={i}
            index={i}
            exercise={exercise}
            onChange={(idx, updated) => {
              const updatedExercises = [...exercises];
              updatedExercises[idx] = updated;
              setExercises(updatedExercises);
            }}
            onRemove={(idx) => {
              setExercises((prev) => prev.filter((_, j) => j !== idx));
            }}
          />
        ))}
      </div>

      {exercises.length > 0 && (
        <Button variant="success" onClick={handleFinishWorkout} className="w-full sm:w-auto">
          ✅ Finish Workout
        </Button>
      )}
    </div>
  );
}
