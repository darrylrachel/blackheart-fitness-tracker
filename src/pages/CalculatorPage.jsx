
import { useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import BackButton from '../components/BackButton';


export default function CalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [goal, setGoal] = useState('maintenance');
  const [activity, setActivity] = useState('1.55');
  const [calories, setCalories] = useState(null);
  const [macros, setMacros] = useState(null);
  const [saving, setSaving] = useState(false);

  const calculateMacros = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const act = parseFloat(activity);

    if (!w || !h || !a) return;

    const heightCm = h * 2.54;
    const weightKg = w * 0.453592;

    // Mifflin-St Jeor BMR
    let bmr =
      gender === 'male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * a - 161;

    let tdee = bmr * act;

    if (goal === 'fat_loss') tdee -= 500;
    if (goal === 'muscle_gain') tdee += 250;

    const protein = w * 1;
    const fats = w * 0.4;
    const carbs = (tdee - (protein * 4 + fats * 9)) / 4;

    setCalories(Math.round(tdee));
    setMacros({
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    });
  };

  const saveToProfile = async () => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const update = {
      macro_goal_protein: macros.protein,
      macro_goal_carbs: macros.carbs,
      macro_goal_fats: macros.fats,
      calorie_goal: calories
    };

    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);

    setSaving(false);
    if (error) {
      alert('Failed to save macros.');
      console.error(error);
    } else {
      alert('Macros saved to profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <BackButton fallback='/dashboard' />
      <h1 className="text-2xl font-bold text-textPrimary">Fitness Calculators</h1>

      <section className="bg-surface p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold text-textPrimary">Macro & Calorie Calculator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Weight (lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Height (inches)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly active</option>
            <option value="1.55">Moderately active</option>
            <option value="1.725">Very active</option>
            <option value="1.9">Extremely active</option>
          </select>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="maintenance">Maintenance</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
          </select>
        </div>
        <Button onClick={calculateMacros}>Calculate</Button>
        {calories && (
          <div className="text-sm text-textSecondary space-y-2">
            <p>Daily Calories: <strong>{calories}</strong></p>
            <p>Protein: {macros.protein}g</p>
            <p>Carbs: {macros.carbs}g</p>
            <p>Fats: {macros.fats}g</p>
            <Button variant="secondary" onClick={saveToProfile} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save to Profile'}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
