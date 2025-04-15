
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import BackButton from '../components/BackButton';

export default function WorkoutSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercises = [], workoutName = '' } = location.state || {};

  async function handleSaveWorkout() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert('Not logged in');

    const { error } = await supabase.from('user_workouts').insert([
      {
        user_id: user.id,
        created_at: new Date().toISOString(),
        name: workoutName,
        exercises,
      },
    ]);

    if (error) {
      console.error('Failed to save workout:', error);
      alert('Error saving workout');
      return;
    }

    // Advance program day if user is on an active program
    const { data: active } = await supabase
      .from('user_programs')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (active) {
      await supabase
        .from('user_programs')
        .update({ current_day_index: active.current_day_index + 1 })
        .eq('id', active.id);
    }

    alert('Workout saved!');
    navigate('/workouts');
  }

  return (
    <div className="space-y-6">
      <BackButton fallback='workouts'/>
      <h1 className="text-2xl font-bold text-textPrimary">📋 Workout Summary</h1>
      <p className="text-sm text-textSecondary">Review your workout before saving</p>

      <div className="space-y-6">
        {exercises.map((exercise, i) => (
          <div key={i} className="border rounded bg-surface p-4 space-y-2 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg capitalize">{exercise.name}</h3>
              {exercise.gifUrl && (
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-20 h-20 object-contain rounded"
                />
              )}
            </div>
            <div className="space-y-2">
              {exercise.sets.map((set, j) => (
                <div key={j} className="text-sm bg-background rounded p-2 border">
                  <strong>Set {j + 1}:</strong> {set.weight} lbs × {set.reps} reps
                  {set.notes && <> — <em className="text-xs">{set.notes}</em></>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={() => navigate('/workouts/new')}>
          ← Back to Edit
        </Button>
        <Button variant="primary" onClick={handleSaveWorkout}>
          ✅ Confirm & Save
        </Button>
      </div>
    </div>
  );
}
