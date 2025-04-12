import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    weight_unit: 'lbs',
    water_unit: 'oz',
    macro_goal: 'maintenance',
    gender: '',
    age: '',
    height: '',
    target_weight: ''
  });

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
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...profile, id: user.id });

    if (!error) {
      alert('Profile updated!');
    } else {
      console.error('Failed to save profile', error);
      alert('Error saving profile');
    }
  };

  if (loading) return <p className='text-textSecondary'>Loading profile...</p>;

  return (
    <div className='max-w-xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold text-textPrimary'>Your Profile</h1>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-textSecondary'>Weight Unit</label>
        <select
          value={profile.weight_unit}
          onChange={(e) => handleChange('weight_unit', e.target.value)}
          className='w-full p-2 rounded border border-border bg-background'
        >
          <option value="lbs">Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
        </select>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-textSecondary'>Water Unit</label>
        <select
          value={profile.water_unit}
          onChange={(e) => handleChange('water_unit', e.target.value)}
          className='w-full p-2 rounded border border-border bg-background'
        >
          <option value="oz">Ounces (oz)</option>
          <option value="ml">Milliliters (ml)</option>
        </select>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-textSecondary'>Macro Goal</label>
        <select
          value={profile.macro_goal}
          onChange={(e) => handleChange('macro_goal', e.target.value)}
          className='w-full p-2 rounded border border-border bg-background'
        >
          <option value="cutting">Cutting</option>
          <option value="bulking">Bulking</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Optional: Gender, Age, Height, Target Weight */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-textSecondary'>Gender</label>
          <input
            type="text"
            value={profile.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className='w-full p-2 rounded border border-border bg-background'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-textSecondary'>Age</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className='w-full p-2 rounded border border-border bg-background'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-textSecondary'>Height</label>
          <input
            type="text"
            value={profile.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className='w-full p-2 rounded border border-border bg-background'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-textSecondary'>Target Weight</label>
          <input
            type="text"
            value={profile.target_weight}
            onChange={(e) => handleChange('target_weight', e.target.value)}
            className='w-full p-2 rounded border border-border bg-background'
          />
        </div>
      </div>

      <Button onClick={handleSave}>💾 Save Profile</Button>
    </div>
  );
}
