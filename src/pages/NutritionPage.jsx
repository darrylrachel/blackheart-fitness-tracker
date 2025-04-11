import { useState } from 'react';
import GoalDonut from '../components/GoalDonut';
import Button from '../components/Button';
import { Flame, Drumstick, EggFried, Leaf } from 'lucide-react';

const API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

export default function NutritionPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [log, setLog] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const totals = log.reduce(
    (acc, food) => {
      const qty = food.quantity || 1;
      acc.calories += (food.nf_calories || 0) * qty;
      acc.protein += (food.nf_protein || 0) * qty;
      acc.carbs += (food.nf_total_carbohydrate || 0) * qty;
      acc.fats += (food.nf_total_fat || 0) * qty;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );


  async function searchFood() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': import.meta.env.VITE_NUTRITIONIX_APP_ID,
          'x-app-key': import.meta.env.VITE_NUTRITIONIX_API_KEY,
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.foods || []);
    } catch (err) {
      console.error('Search failed', err);
    }
    setLoading(false);
  }

  function addToLog(food) {
    setLog([...log, food]);
    setResults([]);
    setQuery('');
  }

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold text-textPrimary'>Nutrition Overview</h1>

      {/* Donut charts for macro goals */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <GoalDonut label="Calories" value={totals.calories} total={2200} color="#6366f1" />
        <GoalDonut label="Protein" value={totals.protein} total={150} color="#10b981" />
        <GoalDonut label="Carbs" value={totals.carbs} total={250} color="#f59e0b" />
        <GoalDonut label="Fats" value={totals.fats} total={80} color="#ef4444" />
      </div>

      {/* Search bar */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search food (e.g. chicken breast)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 rounded border border-border bg-background text-textPrimary"
        />
        <Button onClick={searchFood} variant="primary">Search</Button>
      </div>

      {loading && <p className="text-sm text-textSecondary">Searching...</p>}

      {/* Search results */}
      {results.length > 0 && (
        <div className='space-y-4'>
          <h2 className="text-lg font-semibold text-textPrimary">Search Results</h2>
          {results.map((item, i) => {
  const quantity = quantities[i] || 1;

  // Calculate adjusted macros
  const adjusted = {
    calories: (item.nf_calories * quantity).toFixed(0),
    protein: (item.nf_protein * quantity).toFixed(1),
    carbs: (item.nf_total_carbohydrate * quantity).toFixed(1),
    fats: (item.nf_total_fat * quantity).toFixed(1),
  };

  return (
    <div key={i} className="p-4 bg-surface rounded shadow text-sm space-y-1">
      <p><strong>{item.food_name}</strong> ({item.serving_qty} {item.serving_unit})</p>

      <div className="flex items-center gap-2 mb-2">
        <label htmlFor={`qty-${i}`} className="text-sm">Qty:</label>
        <input
          id={`qty-${i}`}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          value={quantity}
          onChange={(e) =>
            setQuantities({ ...quantities, [i]: parseFloat(e.target.value) || 1 })
          }
          placeholder="1"
          className="w-28 p-2 rounded border border-border bg-background text-sm"
        />

        <span className="text-xs text-textSecondary">servings of {item.serving_unit}</span>
      </div>

      <p>Calories: {adjusted.calories}</p>
      <p>
        Protein: {adjusted.protein}g • Carbs: {adjusted.carbs}g • Fats: {adjusted.fats}g
      </p>

      <Button onClick={() => addToLog({ ...item, quantity })} variant="secondary">
        ➕ Add {quantity} Serving{quantity !== 1 ? 's' : ''}
      </Button>
    </div>
  );
})}

        </div>
      )}

      {/* Meal Log */}
      {log.length > 0 && (
        <div className="bg-surface rounded-xl shadow-md p-6 mt-6 space-y-2">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Today's Meal Log</h2>
          {log.map((item, i) => (
            <div key={i} className="text-sm text-textSecondary">
              ✅ {item.food_name} — {item.nf_calories} cal
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
