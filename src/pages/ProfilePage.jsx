import BottomTabLayout from '../layouts/BottomTabLayout';
import { useAuth } from '../components/AuthProvider';
import { Pencil, LogOut } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { profile } = useAuth();
  const [showTips, setShowTips] = useState(profile?.show_tips ?? true);
  const navigate = useNavigate();

  const handleToggleTips = async () => {
    const newValue = !showTips;
    setShowTips(newValue);
    await supabase.from('profiles').update({ show_tips: newValue }).eq('id', profile.id);
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Profile</h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Username</p>
            <p className="text-base font-semibold text-textPrimary">{profile?.username || '--'}</p>
          </div>

          <div>
            <p className="text-gray-500">Current Weight</p>
            <p>{profile?.current_weight || '--'} {profile?.weight_unit || 'lbs'}</p>
          </div>

          <div>
            <p className="text-gray-500">Target Weight</p>
            <p>{profile?.target_weight || '--'} {profile?.weight_unit || 'lbs'}</p>
          </div>

          <div>
            <p className="text-gray-500">Goal</p>
            <p className="capitalize">{profile?.goal_type || '--'}</p>
          </div>

          <div>
            <p className="text-gray-500">Fitness Level</p>
            <p className="capitalize">{profile?.fitness_level || '--'}</p>
          </div>

          <div>
            <p className="text-gray-500">Activity Level</p>
            <p className="capitalize">{profile?.activity_level || '--'}</p>
          </div>

          <div>
            <p className="text-gray-500">Calorie Goal</p>
            <p>{profile?.calorie_goal || '--'} cal</p>
          </div>

          <div>
            <p className="text-gray-500">Macros</p>
            <p>{profile?.macro_goal_protein || 0}P / {profile?.macro_goal_carbs || 0}C / {profile?.macro_goal_fats || 0}F</p>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-3 text-sm text-textPrimary">
              <input
                type="checkbox"
                checked={showTips}
                onChange={handleToggleTips}
                className="rounded"
              />
              Show Smart Coach Tips
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
            onClick={() => navigate('/profile/edit-profile')}
          >
            <Pencil size={20} /> Edit Profile
          </button>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-500 text-white font-semibold shadow hover:opacity-90"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </BottomTabLayout>
  );
}
