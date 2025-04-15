import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../utils/supabase';
import { Droplet, Smile, Dumbbell } from 'lucide-react';
import BottomTabLayout from '../layouts/BottomTabLayout';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [metrics, setMetrics] = useState({ weight: '', water: '', mood: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      fetchMetrics();
    }
  }, [loading, user]);

  const fetchMetrics = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('weight, water, mood')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data && !error) {
      setMetrics(data);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <BottomTabLayout>
      <div className="pb-24">
        <h1 className="text-xl font-bold text-textPrimary mb-4">
          Welcome back, {profile?.username || 'Athlete'} 💪
        </h1>

        <div className="grid gap-4 mb-6">
          {/* Daily Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-lg font-bold text-textPrimary">{metrics.weight || '--'} lbs</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <p className="text-xs text-gray-500">Water</p>
              <p className="text-lg font-bold text-textPrimary">{metrics.water || '--'} oz</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <p className="text-xs text-gray-500">Mood</p>
              <p className="text-lg font-bold text-textPrimary">{metrics.mood || '--'}</p>
            </div>
          </div>

          {/* Next Workout */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-textPrimary text-lg">Today's Workout</h2>
              <Dumbbell size={20} className="text-[#BFA85D]" />
            </div>
            <p className="text-sm text-gray-600 mt-2">You haven't selected a workout program yet.</p>
            <button className="mt-3 w-full py-2 rounded-xl bg-[#BFA85D] text-white font-medium shadow hover:opacity-90">
              Choose a Program
            </button>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="font-semibold text-textPrimary text-lg mb-2">Today's Nutrition</h2>
            <p className="text-sm text-gray-600">Calories and macros not yet logged.</p>
          </div>

          {/* Calendar Preview */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="font-semibold text-textPrimary text-lg mb-2">Progress Calendar</h2>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </div>

          {/* Quick Access */}
          <div>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/coach')}
                className="bg-white rounded-2xl shadow p-4 text-center"
              >
                <span className="text-2xl">🤖</span>
                <p className="text-sm mt-2 font-medium text-textPrimary">Smart Coach</p>
              </button>
              <button
                onClick={() => navigate('/workouts/history')}
                className="bg-white rounded-2xl shadow p-4 text-center"
              >
                <span className="text-2xl">📈</span>
                <p className="text-sm mt-2 font-medium text-textPrimary">Workout History</p>
              </button>
              <button
                onClick={() => navigate('/journal')}
                className="bg-white rounded-2xl shadow p-4 text-center"
              >
                <span className="text-2xl">📓</span>
                <p className="text-sm mt-2 font-medium text-textPrimary">Journal</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomTabLayout>
  );
}
