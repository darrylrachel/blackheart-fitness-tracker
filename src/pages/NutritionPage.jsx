import GoalDonut from '../components/GoalDonut';
import { Flame, Drumstick, EggFried, Leaf } from 'lucide-react';

export default function NutritionPage() {
  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold text-textPrimary'>Nutrition Overview</h1>

      {/* Donut charts for macro goals */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <GoalDonut label="Calories" value={1480} total={2200} color="#6366f1" />
        <GoalDonut label="Protein" value={110} total={150} color="#10b981" />
        <GoalDonut label="Carbs" value={180} total={250} color="#f59e0b" />
        <GoalDonut label="Fats" value={60} total={80} color="#ef4444" />
      </div>

      {/* Placeholder section for meal plan/logs */}
      <div className="bg-surface rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-textPrimary mb-2">Meal Plan</h2>
        <ul className="text-sm text-textSecondary space-y-1">
          <li>🍳 Breakfast – 2 eggs, toast, black coffee</li>
          <li>🥗 Lunch – Chicken, quinoa, spinach salad</li>
          <li>🍝 Dinner – Pasta, meat sauce, veggies</li>
          <li>🍌 Snack – Banana + protein shake</li>
        </ul>
      </div>
    </div>
  )
}