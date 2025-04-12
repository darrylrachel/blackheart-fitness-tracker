import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    weight_unit: 'lbs',
    water_unit: 'oz',
    macro_goal: 'maintenance',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  async function saveProfile() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...profile, id: user.id });

    if (error) {
      alert('Error saving profile');
    } else {
      alert('Profile updated!');
    }
  }

  if (loading) return <p className="text-sm text-textSecondary">Loading profile...</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-textPrimary">My Profile</h1>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-textSecondary">
          Preferred Weight Unit
        </label>
        <select
          value={profile.weight_unit}
          onChange={(e) => setProfile({ ...profile, weight_unit: e.target.value })}
          className="p-2 rounded border bg-background w-full"
        >
          <option value="lbs">lbs</option>
          <option value="kg">kg</option>
        </select>

        <label className="block text-sm font-medium text-textSecondary">
          Preferred Water Unit
        </label>
        <select
          value={profile.water_unit}
          onChange={(e) => setProfile({ ...profile, water_unit: e.target.value })}
          className="p-2 rounded border bg-background w-full"
        >
          <option value="oz">oz</option>
          <option value="liters">liters</option>
        </select>

        <label className="block text-sm font-medium text-textSecondary">
          Macro Goal
        </label>
        <select
          value={profile.macro_goal}
          onChange={(e) => setProfile({ ...profile, macro_goal: e.target.value })}
          className="p-2 rounded border bg-background w-full"
        >
          <option value="maintenance">Maintenance</option>
          <option value="cutting">Cutting</option>
          <option value="bulking">Bulking</option>
        </select>
      </div>

      <Button onClick={saveProfile}>💾 Save Profile</Button>
    </div>
  );
}
