import BottomTabLayout from '../layouts/BottomTabLayout';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../components/AuthProvider';
import dayjs from 'dayjs';

export default function WorkoutHistoryPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user]);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setWorkouts(data);
    }
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Workout History</h1>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-lg font-semibold text-textPrimary">No workouts logged yet</p>
            <p className="text-sm text-gray-600 mt-1">Your past workouts will appear here once you start tracking them.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {workouts.map((workout) => (
              <li key={workout.id} className="bg-white rounded-2xl shadow-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-textPrimary">{workout.name}</p>
                    <p className="text-sm text-gray-500">{dayjs(workout.created_at).format('MMMM D, YYYY')}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">Muscles: {workout.muscles?.join(', ')}</p>
                  </div>
                  <button
                    className="text-sm text-[#BFA85D] underline"
                    onClick={() => alert('Workout viewer coming soon')}
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BottomTabLayout>
  );
}
