import { useNavigate } from 'react-router-dom';
import BottomTabLayout from '../layouts/BottomTabLayout';
import { Clock, ArrowLeft } from 'lucide-react';

export default function WorkoutHistoryPage() {
  const navigate = useNavigate();
  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <button onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} className="text-[#BFA85D]" />
        </button>
        <h1 className="text-xl font-bold text-textPrimary mb-2">Workout History</h1>

        {/* Placeholder for when no workouts are logged */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <Clock size={32} className="mx-auto text-[#BFA85D] mb-2" />
          <p className="text-lg font-semibold text-textPrimary">No workouts logged yet</p>
          <p className="text-sm text-gray-600 mt-1">Your past workouts will appear here once you start tracking them.</p>
        </div>

        {/* Future: List of past workouts with dates, summary, and a view button */}
      </div>
    </BottomTabLayout>
  );
}
