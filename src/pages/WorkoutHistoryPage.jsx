
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setWorkouts(data);
      }

      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">📜 Workout History</h1>
      <p className="text-sm text-textSecondary">All workouts you've logged will appear below.</p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : workouts.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No workouts logged yet.</p>
      ) : (
        <div className="space-y-4">
          {workouts.map((w, i) => (
            <div key={i} className="border rounded bg-surface p-4 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  {w.title || `Workout on ${new Date(w.created_at).toLocaleDateString()}`}
                </h2>
                <span className="text-xs text-gray-500">
                  {new Date(w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {w.exercises.map((ex, j) => (
                  <div key={j} className="border p-2 rounded bg-background">
                    <strong className="capitalize">{ex.name}</strong>
                    <ul className="ml-4 list-disc text-xs mt-1">
                      {ex.sets.map((s, k) => (
                        <li key={k}>
                          {s.weight} lbs × {s.reps} reps
                          {s.notes && <> — <em>{s.notes}</em></>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
