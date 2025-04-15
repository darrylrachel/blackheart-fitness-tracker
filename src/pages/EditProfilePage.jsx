import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../utils/supabase';
import BottomTabLayout from '../layouts/BottomTabLayout';

export default function EditProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) setForm({ ...profile });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('profiles').update(form).eq('id', user.id);
    if (error) {
      setError(error.message);
    } else {
      navigate('/profile');
    }
    setLoading(false);
  };

  return (
    <BottomTabLayout>
      <form onSubmit={handleSubmit} className="min-h-[calc(100vh-88px)] pb-10 px-4 space-y-4">
        <h1 className="text-xl font-bold text-textPrimary">Edit Profile</h1>

        <label className="flex items-center gap-3 text-sm text-textPrimary">
            Username
        <input name="username" type="text" value={form.username || ''} onChange={handleChange} placeholder="Username" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
        </label>

        <label className="flex items-center gap-3 text-sm text-textPrimary">
            Weight
        <input name="current_weight" type="number" value={form.current_weight || ''} onChange={handleChange} placeholder="Current Weight (lbs)" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
        </label>

        <label className="flex items-center gap-3 text-sm text-textPrimary">
            Goal
        <input name="target_weight" type="number" value={form.target_weight || ''} onChange={handleChange} placeholder="Target Weight (lbs)" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
        </label>

        <label className="flex items-center gap-3 text-sm text-textPrimary">
            Age
        <input name="age" type="number" value={form.age || ''} onChange={handleChange} placeholder="Age" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
        </label>

        <label className="flex items-center gap-3 text-sm text-textPrimary">
            Height
        <input name="height" type="number" value={form.height || ''} onChange={handleChange} placeholder="Height (inches)" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
        </label>

        <select name="goal_type" value={form.goal_type || ''} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2">
          <option value="">Goal</option>
          <option value="fat_loss">Fat Loss</option>
          <option value="maintenance">Maintenance</option>
          <option value="muscle_gain">Muscle Gain</option>
        </select>

        <select name="fitness_level" value={form.fitness_level || ''} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2">
          <option value="">Fitness Level</option>
          <option value="newbie">Newbie (0-1 year)</option>
          <option value="intermediate">Intermediate (1-3 years)</option>
          <option value="advanced">Advanced (3+ years)</option>
        </select>

        <select name="activity_level" value={form.activity_level || ''} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2">
          <option value="">Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="active">Very Active</option>
        </select>

        <button type="submit" className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </BottomTabLayout>
  );
}
