
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import BackButton from '../components/BackButton';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id);

    if (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } else {
      alert('Profile updated');
    }

    setSaving(false);
  };

  if (loading || !profile) {
    return <div className="p-4 text-sm text-textSecondary">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <BackButton fallback='/dashboard' />
      <h1 className="text-2xl font-bold text-textPrimary">My Profile</h1>
      <p className="text-sm text-textSecondary">This is your fitness hub. Update your personal metrics and macro targets here.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={profile.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Weight</label>
            <input
              type="number"
              value={profile.current_weight || ''}
              onChange={(e) => handleChange('current_weight', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight Unit</label>
            <select
              value={profile.weight_unit || 'lbs'}
              onChange={(e) => handleChange('weight_unit', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="lbs">Pounds (lbs)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Target Weight</label>
          <input
            type="number"
            value={profile.target_weight || ''}
            onChange={(e) => handleChange('target_weight', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Height (in or cm)</label>
          <input
            type="number"
            value={profile.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fitness Goal</label>
          <select
            value={profile.goal_type || ''}
            onChange={(e) => handleChange('goal_type', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="maintenance">Maintenance</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select
            value={profile.activity_level || ''}
            onChange={(e) => handleChange('activity_level', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (1–3 days/week)</option>
            <option value="1.55">Moderately active (3–5 days/week)</option>
            <option value="1.725">Very active (6–7 days/week)</option>
            <option value="1.9">Extremely active (daily + physical job)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fitness Level</label>
          <select
            value={profile.fitness_level || ''}
            onChange={(e) => handleChange('fitness_level', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="newbie">Newbie (0–1 year)</option>
            <option value="intermediate">Intermediate (1–3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Daily Calorie Goal</label>
          <input
            type="number"
            value={profile.calorie_goal || ''}
            onChange={(e) => handleChange('calorie_goal', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Macro Goals (in grams)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500">Protein</label>
              <input
                type="number"
                value={profile.macro_goal_protein || ''}
                onChange={(e) => handleChange('macro_goal_protein', e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Carbs</label>
              <input
                type="number"
                value={profile.macro_goal_carbs || ''}
                onChange={(e) => handleChange('macro_goal_carbs', e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Fats</label>
              <input
                type="number"
                value={profile.macro_goal_fats || ''}
                onChange={(e) => handleChange('macro_goal_fats', e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          </div>
        </div>

        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </Button>
      </div>
    </div>
  );
}
