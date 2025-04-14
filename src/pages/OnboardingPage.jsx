
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [waterUnit, setWaterUnit] = useState('oz');
  const [activityLevel, setActivityLevel] = useState('1.55');
  const [fitnessLevel, setFitnessLevel] = useState('newbie');
  const [goalType, setGoalType] = useState('maintenance');
  const [targetWeight, setTargetWeight] = useState('');

  const calculateMacros = (weightLbs) => {
    const weightKg = weightUnit === 'kg' ? weightLbs : weightLbs * 0.4536;
    const heightCm = weightUnit === 'kg' ? height : height * 2.54;

    // Mifflin-St Jeor BMR
    let bmr =
      gender === 'male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * 25 + 5 // assuming avg age 25
        : 10 * weightKg + 6.25 * heightCm - 5 * 25 - 161;

    const tdee = bmr * parseFloat(activityLevel);

    // Adjust TDEE for goal
    let adjustedCalories = tdee;
    if (goalType === 'fat_loss') adjustedCalories *= 0.8;
    if (goalType === 'muscle_gain') adjustedCalories *= 1.15;

    // Macro distribution based on fitness level
    let proteinPerLb = fitnessLevel === 'advanced' ? 1.2 : fitnessLevel === 'intermediate' ? 1 : 0.8;
    const protein = Math.round(proteinPerLb * weightLbs);
    const fats = Math.round((adjustedCalories * 0.25) / 9);
    const remainingCalories = adjustedCalories - (protein * 4 + fats * 9);
    const carbs = Math.round(remainingCalories / 4);

    return {
      calories: Math.round(adjustedCalories),
      protein,
      carbs,
      fats,
    };
  };

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert('Not logged in');

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || isNaN(height)) return alert('Invalid weight or height');

    const macros = calculateMacros(weightNum);

    const updates = {
      id: user.id,
      username,
      gender,
      weight_unit: weightUnit,
      water_unit: waterUnit,
      goal_type: goalType,
      current_weight: weightNum,
      target_weight: targetWeight ? Number(targetWeight) : null,
      height: parseFloat(height),
      activity_level: activityLevel,
      fitness_level: fitnessLevel,
      macro_goal_protein: macros.protein,
      macro_goal_carbs: macros.carbs,
      macro_goal_fats: macros.fats,
      calorie_goal: macros.calories,
      onboarding_complete: true,
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      console.error('Error saving onboarding:', error);
      alert('Something went wrong');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Welcome to Blackheart Coach 🧠</h1>
      <p className="text-sm text-textSecondary">Let’s personalize your fitness journey.</p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border p-2 rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="w-full border p-2 rounded">
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Current Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Height (in/cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full border p-2 rounded">
          <option value="1.2">Sedentary (little or no exercise)</option>
          <option value="1.375">Lightly active (1–3 days/week)</option>
          <option value="1.55">Moderately active (3–5 days/week)</option>
          <option value="1.725">Very active (6–7 days/week)</option>
          <option value="1.9">Extremely active (daily + physical job)</option>
        </select>

        <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} className="w-full border p-2 rounded">
          <option value="newbie">Newbie (0–1 year)</option>
          <option value="intermediate">Intermediate (1–3 years)</option>
          <option value="advanced">Advanced (3+ years)</option>
        </select>

        <select value={goalType} onChange={(e) => setGoalType(e.target.value)} className="w-full border p-2 rounded">
          <option value="maintenance">Maintenance</option>
          <option value="fat_loss">Fat Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
        </select>

        <input
          type="number"
          placeholder="Target Weight (optional)"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <Button variant="primary" onClick={handleSubmit}>🚀 Finish Setup</Button>
      </div>
    </div>
  );
}
