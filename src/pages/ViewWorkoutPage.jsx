import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import BottomTabLayout from '../layouts/BottomTabLayout';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { getSmartCoachSuggestion } from '../logic/smartCoachLogic';

export default function ViewWorkoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousSets, setPreviousSets] = useState({});

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) {
        setWorkout(data);
        fetchPreviousWorkoutSets(data);
      }
      setLoading(false);
    };

    fetchWorkout();
  }, [id]);

  const fetchPreviousWorkoutSets = async (currentWorkout) => {
    const { data } = await supabase
      .from('workouts')
      .select('exercises, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    for (let entry of data) {
      if (entry.id === currentWorkout.id) continue;
      for (let exercise of currentWorkout.exercises) {
        const match = entry.exercises.find((ex) => ex.name === exercise.name);
        if (match && !previousSets[exercise.name]) {
          setPreviousSets((prev) => ({ ...prev, [exercise.name]: match.sets.at(-1) }));
        }
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading workout...</div>;
  }

  if (!workout) {
    return <div className="p-4 text-red-500">Workout not found.</div>;
  }

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-[#BFA85D]" />
          </button>
          <h1 className="text-xl font-bold text-textPrimary">{workout.name}</h1>
        </div>

        <div className="text-sm text-gray-500">
          {dayjs(workout.created_at).format('MMMM D, YYYY')} • Muscles: {workout.muscles?.join(', ')}
        </div>

        {workout.exercises.map((ex, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-textPrimary mb-2 capitalize">{ex.name}</h2>
            <ul className="text-sm text-gray-600 space-y-3">
              {ex.sets.map((set, i) => (
                <li key={i}>
                  <div>Set {i + 1}: {set.reps} reps @ {set.weight} lbs</div>
                  {profile?.show_tips && (
                    <p className="text-xs text-gray-500 italic">
                      {getSmartCoachSuggestion({
                        previousSet: previousSets[ex.name],
                        currentSet: set,
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BottomTabLayout>
  );
}
