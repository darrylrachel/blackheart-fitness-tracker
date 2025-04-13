
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from './Button';

export default function CurrentProgramCard() {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgram = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // Step 1: Get active user program
      const { data: userProgram } = await supabase
        .from('user_programs')
        .select('program_id, program_name, current_day_index')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!userProgram) {
        setLoading(false);
        return;
      }

      // Step 2: Fetch full program with days
      const { data: fullProgram } = await supabase
        .from('workout_programs')
        .select('title, duration_days, days')
        .eq('id', userProgram.program_id)
        .maybeSingle();

      if (!fullProgram || !fullProgram.days) {
        setLoading(false);
        return;
      }

      const todayKey = `day${userProgram.current_day_index}`;
      const todaysWorkout = fullProgram.days[todayKey];

      setProgram({
        title: userProgram.program_name,
        currentDay: userProgram.current_day_index,
        duration: fullProgram.duration_days,
        workout: todaysWorkout,
      });

      setLoading(false);
    };

    fetchProgram();
  }, []);

  if (loading) return <div className="text-sm text-gray-400">Loading current program...</div>;
  if (!program) return <div className="text-sm italic text-gray-400">No active workout program.</div>;

  const progress = Math.round((program.currentDay / program.duration) * 100);

  return (
    <div className="bg-surface p-6 rounded-xl shadow space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-textPrimary">{program.title}</h3>
        <span className="text-xs text-gray-500">Day {program.currentDay} of {program.duration}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {program.workout ? (
        <>
          <p className="text-sm text-gray-500">Today's workout: <strong>{program.workout.name}</strong></p>
          <ul className="text-xs text-textSecondary space-y-1 list-disc list-inside">
            {program.workout.exercises.map((ex, i) => (
              <li key={i}>{ex.name} – {ex.sets} sets of {ex.reps}</li>
            ))}
          </ul>
          <Button
            onClick={() => {
              navigate('/workouts/new', {
                state: {
                  title: program.workout.name,
                  exercises: program.workout.exercises,
                  fromProgram: true
                }
              });
            }}
          >
            ▶️ Start Today’s Workout
          </Button>
        </>
      ) : (
        <p className="text-sm italic text-gray-400">No exercises found for today.</p>
      )}
    </div>
  );
}
