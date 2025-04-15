import { useLocation, useNavigate } from 'react-router-dom';
import BottomTabLayout from '../layouts/BottomTabLayout';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../components/AuthProvider';
import { getSmartCoachSuggestion } from '../logic/smartCoachLogic';

export default function WorkoutBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [saving, setSaving] = useState(false);
  const [previousSets, setPreviousSets] = useState({});

  useEffect(() => {
    const newExercise = location.state?.selectedExercise;
    if (newExercise) {
      fetchPreviousSetAndAdd(newExercise);
    }
  }, [location.state]);

  const fetchPreviousSetAndAdd = async (exercise) => {
    const { data } = await supabase
      .from('workouts')
      .select('exercises')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    let lastSet = null;
    if (data?.length) {
      for (let w of data) {
        const match = w.exercises.find((ex) => ex.name === exercise.name);
        if (match) {
          lastSet = match.sets.at(-1);
          setPreviousSets((prev) => ({ ...prev, [exercise.name]: lastSet }));
          break;
        }
      }
    }

    const prefilledSets = [1, 2, 3].map(() => ({
      reps: lastSet?.reps || '',
      weight: lastSet?.weight || '',
    }));

    setExercises((prev) => [
      ...prev,
      { ...exercise, sets: prefilledSets },
    ]);
  };

  const addSet = (exerciseIndex) => {
    const previous = previousSets[exercises[exerciseIndex].name];
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({
      reps: previous?.reps || '',
      weight: previous?.weight || '',
    });
    setExercises(updated);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleSaveWorkout = async () => {
    if (!user || exercises.length === 0) return;
    setSaving(true);

    const uniqueMuscles = [...new Set(exercises.map(ex => ex.target))];

    const enrichedExercises = exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => ({
        ...set,
        coach_tip: getSmartCoachSuggestion({
          previousSet: previousSets[ex.name],
          currentSet: set,
        })
      }))
    }));

    const { error } = await supabase.from('workouts').insert({
      user_id: user.id,
      name: workoutName.trim() || 'Untitled Workout',
      muscles: uniqueMuscles,
      exercises: enrichedExercises,
    });

    setSaving(false);

    if (!error) {
      navigate('/workouts/history');
    } else {
      alert('Error saving workout: ' + error.message);
    }
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10">
        <h1 className="text-xl font-bold text-textPrimary mb-4">New Workout</h1>

        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Workout Name (e.g. Push Day, Leg Burner)"
          className="w-full mb-4 rounded-xl border border-gray-300 px-4 py-2"
        />

        {exercises.length === 0 ? (
          <div className="text-center text-gray-500 mb-4">
            <p>No exercises selected yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-4">
                <h2 className="font-semibold text-textPrimary text-lg mb-2 capitalize">{ex.name}</h2>

                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className="mb-3">
                    <div className="flex gap-2 mb-1">
                      <input
                        type="number"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) => updateSet(idx, setIdx, 'reps', e.target.value)}
                        className="w-1/2 rounded-xl border border-gray-300 px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Weight (lbs)"
                        value={set.weight}
                        onChange={(e) => updateSet(idx, setIdx, 'weight', e.target.value)}
                        className="w-1/2 rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </div>
                    {profile?.show_tips && (
                      <p className="text-xs text-gray-500 italic">
                        {getSmartCoachSuggestion({
                          previousSet: previousSets[ex.name],
                          currentSet: set,
                        })}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addSet(idx)}
                  className="text-sm text-[#BFA85D] underline mt-1"
                >
                  + Add Set
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/workouts/select-exercises')}
          className="mt-6 w-full py-2 rounded-xl bg-white text-[#BFA85D] font-medium border border-[#BFA85D] shadow hover:bg-[#BFA85D]/10"
        >
          + Add Exercise
        </button>

        <button
          className="mt-4 w-full py-3 rounded-xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          onClick={handleSaveWorkout}
          disabled={saving || exercises.length === 0}
        >
          {saving ? 'Saving...' : 'Finish Workout'}
        </button>
      </div>
    </BottomTabLayout>
  );
}
