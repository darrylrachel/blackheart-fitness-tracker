import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function EditProfilePage() {
  const [profile, setProfile] = useState({ username: '', weight_unit: 'lbs', water_unit: 'oz', macro_goal: '' });
  const [loading, setLoading] = useState(true);

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

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  async function saveProfile() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
    });

    if (!error) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
      console.error(error);
    }
  }

  if (loading) return <p className="text-sm text-textSecondary">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Edit Profile</h1>

      <label className="block">
        <span className="text-sm text-textPrimary">Username</span>
        <input
          type="text"
          value={profile.username || ''}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          className="w-full p-2 border border-border rounded bg-background text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm text-textPrimary">Weight Unit</span>
        <select
          value={profile.weight_unit || 'lbs'}
          onChange={(e) => setProfile({ ...profile, weight_unit: e.target.value })}
          className="w-full p-2 border border-border rounded bg-background text-sm"
        >
          <option value="lbs">Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-textPrimary">Water Unit</span>
        <select
          value={profile.water_unit || 'oz'}
          onChange={(e) => setProfile({ ...profile, water_unit: e.target.value })}
          className="w-full p-2 border border-border rounded bg-background text-sm"
        >
          <option value="oz">Ounces (oz)</option>
          <option value="ml">Milliliters (ml)</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-textPrimary">Macro Goal</span>
        <select
          value={profile.macro_goal || ''}
          onChange={(e) => setProfile({ ...profile, macro_goal: e.target.value })}
          className="w-full p-2 border border-border rounded bg-background text-sm"
        >
          <option value="">Select a goal</option>
          <option value="cutting">Cutting</option>
          <option value="bulking">Bulking</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </label>

      <Button onClick={saveProfile} variant="primary">
        💾 Save Profile
      </Button>
    </div>
  );
}
