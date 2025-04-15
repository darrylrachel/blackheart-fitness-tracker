import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Logo from '../assets/Logo.png';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    gender: '',
    weight: '',
    height: '',
    activity: '',
    fitness: '',
    goal: '',
    targetWeight: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 rounded-2xl shadow-xl p-6 space-y-4"
      >
        <div className="flex justify-center">
          <img src={Logo} alt="App Logo" className="h-24 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-center text-textPrimary mb-2">
          🎯 Let's personalize your experience
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <select name="gender" value={form.gender} onChange={handleChange} required className="rounded-xl border-gray-300 px-3 py-2">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select name="activity" value={form.activity} onChange={handleChange} required className="rounded-xl border-gray-300 px-3 py-2">
            <option value="">Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
          </select>

          <input
            type="number"
            name="weight"
            placeholder="Current Weight (lbs)"
            value={form.weight}
            onChange={handleChange}
            required
            className="col-span-2 rounded-xl border-gray-300 px-3 py-2"
          />

          <input
            type="number"
            name="targetWeight"
            placeholder="Target Weight (lbs)"
            value={form.targetWeight}
            onChange={handleChange}
            required
            className="col-span-2 rounded-xl border-gray-300 px-3 py-2"
          />

          <input
            type="number"
            name="height"
            placeholder="Height (inches)"
            value={form.height}
            onChange={handleChange}
            required
            className="col-span-2 rounded-xl border-gray-300 px-3 py-2"
          />

          <select name="fitness" value={form.fitness} onChange={handleChange} required className="col-span-2 rounded-xl border-gray-300 px-3 py-2">
            <option value="">Fitness Level</option>
            <option value="newbie">Newbie (0-1 year)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>

          <select name="goal" value={form.goal} onChange={handleChange} required className="col-span-2 rounded-xl border-gray-300 px-3 py-2">
            <option value="">Main Goal</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle_gain">Muscle Gain</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow-md hover:opacity-90 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
