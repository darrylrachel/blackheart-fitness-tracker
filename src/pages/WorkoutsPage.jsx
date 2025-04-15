import { useNavigate } from 'react-router-dom';
import BottomTabLayout from '../layouts/BottomTabLayout';
import Button from '../components/Button';
import { Dumbbell, Plus, Shuffle, Search, Layers } from 'lucide-react';

export default function WorkoutsPage() {
  const navigate = useNavigate();

  return (
    <BottomTabLayout>
      <div className="pb-24 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Workouts</h1>

        {/* Workout Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/workouts/new')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            <Plus size={20} /> Start Blank Workout
          </button>

          <button
            onClick={() => navigate('/workouts/create')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Layers size={20} /> Build Custom Program
          </button>

          <button
            onClick={() => navigate('/workouts/history')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Dumbbell size={20} /> Workout History
          </button>

          <button
            onClick={() => navigate('/workouts/summary')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Shuffle size={20} /> Random Workout
          </button>
        </div>

        {/* Search Exercises (future modal) */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/search-exercises')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Search size={20} /> Search Exercises
          </button>
        </div>
      </div>
    </BottomTabLayout>
  );
}
