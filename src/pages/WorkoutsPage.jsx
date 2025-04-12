import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import GoalDonut from '../components/GoalDonut';
import Button from '../components/Button';

export default function WorkoutsPage() {
  const [activeProgram, setActiveProgram] = useState(null);
  const [dayProgress, setDayProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const fetchProgram = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: programs, error } = await supabase
        .from('user_programs')
        .select('*, workout_programs(name)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (programs) {
        setActiveProgram(programs);
        const currentDay = programs?.current_day || 0;
        const totalDays = programs?.total_days || 42;
        setDayProgress({ current: currentDay, total: totalDays });
      }
    };

    fetchProgram();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Your Workouts</h1>

      <div className="flex gap-4 flex-wrap">
        <Button>Start New Workout</Button>
        <Button variant="secondary">📒 Pre-Built Programs</Button>
        <Button variant="secondary">🧱 Build Your Own</Button>
        <Button variant="secondary">🎲 Generate Random Workout</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {activeProgram ? (
          <GoalDonut
            label={activeProgram.workout_programs?.name || 'My Program'}
            value={dayProgress.current}
            total={dayProgress.total}
            color="#bfa85d"
          />
        ) : (
          <div className="col-span-3 bg-surface p-6 rounded-xl shadow text-center text-textSecondary text-sm">
            <p>You haven't selected a workout program yet.</p>
            <p className="mt-2">Choose a program to begin tracking your progress.</p>
          </div>
        )}
      </div>
    </div>
  );
}
