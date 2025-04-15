import BottomTabLayout from '../layouts/BottomTabLayout';
import { useNavigate } from 'react-router-dom';
import { Flame, Dumbbell } from 'lucide-react';

export default function CalculatorPage() {
  const navigate = useNavigate();

  return (
    <BottomTabLayout>
      <div className="pb-24 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Calculators</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/calculator/macro')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            <Flame size={20} /> Macro & Calorie Calculator
          </button>

          <button
            onClick={() => navigate('/calculator/1rm')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Dumbbell size={20} /> One Rep Max Calculator
          </button>
        </div>

        {/* Calculator Notes Placeholder */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">What are these?</h2>
          <p className="text-sm text-gray-600">
            Use the macro calculator to estimate daily calories and macronutrients based on your goal. Use the 1RM calculator to estimate your max lift.
          </p>
        </div>
      </div>
    </BottomTabLayout>
  );
}
