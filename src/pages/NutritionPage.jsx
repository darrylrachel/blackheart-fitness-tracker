import { useState, useEffect } from 'react';
import GoalDonut from '../components/GoalDonut';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';
import { Flame, Drumstick, EggFried, Leaf } from 'lucide-react';

function getLocalDate() {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split('T')[0];
}

const API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

export default function NutritionPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [log, setLog] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast'); // default meal

  const totals = log.reduce(
    (acc, food) => {
      const qty = parseFloat(food.quantity) || 1;
      acc.calories += (food.nf_calories || 0) * qty;
      acc.protein += (food.nf_protein || 0) * qty;
      acc.carbs += (food.nf_total_carbohydrate || 0) * qty;
      acc.fats += (food.nf_total_fat || 0) * qty;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  function toTitleCase(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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

  async function addToLog(food) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert('Not logged in!');
      return;
    }

    const quantity = parseFloat(food.quantity) || 1;

    const { error } = await supabase.from('nutrition_logs').insert([
      {
        user_id: user.id,
        date: getLocalDate(),
        meal: food.meal,
        food_name: food.food_name,
        serving_unit: food.serving_unit,
        quantity,
        calories: (food.nf_calories || 0) * quantity,
        protein: (food.nf_protein || 0) * quantity,
        carbs: (food.nf_total_carbohydrate || 0) * quantity,
        fats: (food.nf_total_fat || 0) * quantity,
      }
    ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      alert('Failed to save meal');
    } else {
      setLog([...log, { ...food, quantity }]);
      setResults([]);
      setQuery('');
    }
  };

  useEffect(() => {
    const fetchLoggedMeals = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', getLocalDate());

      if (error) {
        console.error("Failed to load logged meals:", error);
      } else {
        setLog(data || []);
      }
    };

    fetchLoggedMeals();
  }, []);




  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold text-textPrimary'>Nutrition Overview</h1>

      {/* Donut charts for macro goals */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <GoalDonut label="Calories" value={Math.round(totals.calories)} total={2200} color="#6366f1" />
        <GoalDonut label="Protein" value={Math.round(totals.protein)} total={150} color="#10b981" />
        <GoalDonut label="Carbs" value={Math.round(totals.carbs)} total={250} color="#f59e0b" />
        <GoalDonut label="Fats" value={Math.round(totals.fats)} total={80} color="#ef4444" />

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

      <div className="flex gap-2 items-center">
        <label htmlFor="meal" className="text-sm font-medium text-textSecondary">Logging for:</label>
        <select
          id="meal"
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(e.target.value)}
          className="p-2 rounded border border-border bg-background text-sm"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>


      {/* Search results */}
      {results.length > 0 && (
        <div className='space-y-4'>
          <h2 className="text-lg font-semibold text-textPrimary">Search Results</h2>
          {results.map((item, i) => {
  const quantity = quantities[i] !== undefined ? quantities[i] : '';


  // Calculate adjusted macros
  const adjusted = {
    calories: (item.nf_calories * quantity).toFixed(0),
    protein: (item.nf_protein * quantity).toFixed(1),
    carbs: (item.nf_total_carbohydrate * quantity).toFixed(1),
    fats: (item.nf_total_fat * quantity).toFixed(1),
  };

  return (
    <div key={i} className="p-4 bg-surface rounded shadow text-sm space-y-1">
      <p><strong>{toTitleCase(item.food_name)}</strong> ({item.serving_qty} {item.serving_unit})</p>
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor={`qty-${i}`} className="text-sm">Qty:</label>
        <input
          id={`qty-${i}`}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          value={quantity}
          onChange={(e) => {
            const raw = e.target.value;
            setQuantities({ ...quantities, [i]: raw === '' ? '' : parseFloat(raw) });
          }}
          placeholder="1"
          className="w-28 p-2 rounded border border-border bg-background text-sm"
        />

        <span className="text-xs text-textSecondary">servings of {item.serving_unit}</span>
      </div>

      <p>Calories: {adjusted.calories}</p>
      <p>
        Protein: {adjusted.protein}g • Carbs: {adjusted.carbs}g • Fats: {adjusted.fats}g
      </p>

      <Button onClick={() => addToLog({ ...item, quantity, meal: selectedMeal })} variant="secondary">
        ➕ Add {quantity} Serving{quantity !== 1 ? 's' : ''}
      </Button>
    </div>
  );
})}

        </div>
      )}

      {log.length > 0 && (
        <div className="bg-surface rounded-xl shadow-md p-6 mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Today's Meal Log</h2>

          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal) => {
            const items = log.filter((item) => item.meal === meal);
            if (items.length === 0) return null;

            const totals = items.reduce(
              (acc, food) => {
                const qty = parseFloat(food.quantity) || 1;
                acc.calories += (food.nf_calories || 0) * qty;
                acc.protein += (food.nf_protein || 0) * qty;
                acc.carbs += (food.nf_total_carbohydrate || 0) * qty;
                acc.fats += (food.nf_total_fat || 0) * qty;
                return acc;
              },
              { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );

            return (
              <div key={meal} className="space-y-2 mb-6">
                <h3 className="font-semibold text-md text-textPrimary">{meal}</h3>
                {items.map((item, i) => (
                  <div key={i} className="text-sm text-textSecondary">
                    ✅ {item.food_name} — {Math.round(item.nf_calories)} cal
                  </div>
                ))}

                <p className="text-sm font-medium text-textPrimary-600 mt-1">
                  🍽️ Totals: {Math.round(totals.calories)} cal • {Math.round(totals.protein)}g protein • {Math.round(totals.carbs)}g carbs • {Math.round(totals.fats)}g fats
                </p>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
