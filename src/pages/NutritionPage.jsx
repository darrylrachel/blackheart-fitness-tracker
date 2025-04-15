import BottomTabLayout from '../layouts/BottomTabLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Flame } from 'lucide-react';

export default function NutritionPage() {
  const navigate = useNavigate();

  return (
    <BottomTabLayout>
      <div className="pb-24 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Nutrition</h1>

        {/* Macro Summary Placeholder */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Today's Macros</h2>
          <p className="text-sm text-gray-600">No food logged yet.</p>
          {/* Future: Add donut chart with protein/carbs/fats */}
        </div>

        {/* Meal Planner Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/nutrition/add-meal')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            <Plus size={20} /> Add Meal
          </button>

          <button
            onClick={() => navigate('/nutrition/plan')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Calendar size={20} /> Plan Meals
          </button>
        </div>

        {/* Calorie Goal */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Calorie Target</h2>
          <p className="text-sm text-gray-600">Your goal is 2,200 calories per day.</p>
          {/* Future: Calculate dynamically from profile */}
        </div>

        {/* Recent Meals Placeholder */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Recent Meals</h2>
          <p className="text-sm text-gray-600">No meals added yet.</p>
        </div>
      </div>
    </BottomTabLayout>
  );
}
