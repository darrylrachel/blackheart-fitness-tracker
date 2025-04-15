import { useEffect, useState } from 'react';
import BottomTabLayout from '../layouts/BottomTabLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Search } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../utils/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function NutritionPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  const fetchMeals = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMeals(data);
      calculateTotals(data);
    }
  };

  const calculateTotals = (entries) => {
    const totals = entries.reduce(
      (acc, meal) => {
        acc.calories += Math.round(Number(meal.calories || 0));
        acc.protein += Math.round(Number(meal.protein || 0));
        acc.carbs += Math.round(Number(meal.carbs || 0));
        acc.fats += Math.round(Number(meal.fats || 0));
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    setTotals(totals);
  };

  const chartData = [
    { name: 'Protein', value: totals.protein },
    { name: 'Carbs', value: totals.carbs },
    { name: 'Fats', value: totals.fats },
  ];

  const goal = {
    protein: profile?.protein || 0,
    carbs: profile?.carbs || 0,
    fats: profile?.fats || 0,
  };

  const colors = ['#5D9CEC', '#A0D568', '#FC6E51'];

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Nutrition</h1>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Macro Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-sm text-center text-gray-600 mt-2">
            {totals.protein}P / {goal.protein}P • {totals.carbs}C / {goal.carbs}C • {totals.fats}F / {goal.fats}F
          </div>
        </div>

        {/* Macro Summary */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Today's Macros</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Calories: {totals.calories} / {Math.round(profile?.calories || 0)}</li>
            <li>Protein: {totals.protein}g / {Math.round(profile?.protein || 0)}g</li>
            <li>Carbs: {totals.carbs}g / {Math.round(profile?.carbs || 0)}g</li>
            <li>Fats: {totals.fats}g / {Math.round(profile?.fats || 0)}g</li>
          </ul>
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

          <button
            onClick={() => navigate('/nutrition/search')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
          >
            <Search size={20} /> Search Foods
          </button>
        </div>

        {/* Calorie Goal */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Calorie Target</h2>
          {profile?.calories ? (
            <p className="text-sm text-gray-600">Your goal is {Math.round(profile.calories)} calories per day.</p>
          ) : (
            <p className="text-sm text-gray-600">Set your calorie target in your profile to begin tracking.</p>
          )}
        </div>

        {/* Recent Meals */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Recent Meals</h2>
          {meals.length === 0 ? (
            <p className="text-sm text-gray-600">No meals added yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-textPrimary">
              {meals.map((meal) => (
                <li key={meal.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{meal.food_name}</p>
                    <p className="text-xs text-gray-500">{meal.meal} • {meal.quantity} {meal.serving_unit}</p>
                  </div>
                  <div className="text-right">
                    <p>{Math.round(meal.calories)} cal</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(meal.protein)}P / {Math.round(meal.carbs)}C / {Math.round(meal.fats)}F
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BottomTabLayout>
  );
}
