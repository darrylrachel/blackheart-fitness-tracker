import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../components/AuthProvider';
import BottomTabLayout from '../layouts/BottomTabLayout';

export default function AddMealPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedFood = location.state?.selectedFood;

  const [form, setForm] = useState({
    meal: '',
    food_name: '',
    serving_unit: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFood) {
      setForm({
        ...form,
        food_name: selectedFood.food_name,
        serving_unit: selectedFood.serving_unit,
        quantity: selectedFood.serving_qty,
        calories: Math.round(selectedFood.nf_calories),
        protein: Math.round(selectedFood.nf_protein),
        carbs: Math.round(selectedFood.nf_total_carbohydrate),
        fats: Math.round(selectedFood.nf_total_fat),
      });
    }
  }, [selectedFood]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const date = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      date,
      ...form,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/nutrition');
    }
    setLoading(false);
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10">
        <h1 className="text-xl font-bold text-textPrimary mb-4">Add Meal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="meal"
            value={form.meal}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          >
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>

          <input
            name="food_name"
            type="text"
            placeholder="Food Name"
            value={form.food_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <input
            name="serving_unit"
            type="text"
            placeholder="Serving Unit (e.g., oz, cup)"
            value={form.serving_unit}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <input
            name="calories"
            type="number"
            placeholder="Calories"
            value={form.calories}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              name="protein"
              type="number"
              placeholder="Protein (g)"
              value={form.protein}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 px-4 py-2"
            />
            <input
              name="carbs"
              type="number"
              placeholder="Carbs (g)"
              value={form.carbs}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 px-4 py-2"
            />
            <input
              name="fats"
              type="number"
              placeholder="Fats (g)"
              value={form.fats}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 px-4 py-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </button>
        </form>
      </div>
    </BottomTabLayout>
  );
}
