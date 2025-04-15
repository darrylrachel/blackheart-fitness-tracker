import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomTabLayout from '../layouts/BottomTabLayout';

const APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;

export default function SearchFoodPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchFoods = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query },
        {
          headers: {
            'x-app-id': APP_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      setResults(data.foods);
    } catch (err) {
      console.error('Nutritionix Error:', err);
    }
    setLoading(false);
  };

  const selectFood = (food) => {
    navigate('/nutrition/add-meal', { state: { selectedFood: food } });
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 px-4">
        <h1 className="text-xl font-bold text-textPrimary mb-4">Search Food</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search for food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2"
          />
          <button
            onClick={searchFoods}
            className="bg-[#BFA85D] text-white px-4 py-2 rounded-xl font-medium"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {results.map((food, idx) => (
              <li
                key={idx}
                onClick={() => selectFood(food)}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-50"
              >
                <p className="font-semibold text-textPrimary">{food.food_name}</p>
                <p className="text-sm text-gray-500">
                  {food.serving_qty} {food.serving_unit} • {food.nf_calories} cal
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BottomTabLayout>
  );
}
