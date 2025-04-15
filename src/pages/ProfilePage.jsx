import BottomTabLayout from '../layouts/BottomTabLayout';
import { useAuth } from '../components/AuthProvider';
import { Pencil, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useAuth();

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Profile</h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Username</div>
          <div className="text-lg font-semibold text-textPrimary">{profile?.username || '...'}</div>

          <div className="text-sm text-gray-600 mt-4 mb-1">Goal</div>
          <div className="text-base text-textPrimary capitalize">{profile?.goal || '--'}</div>

          <div className="text-sm text-gray-600 mt-4 mb-1">Fitness Level</div>
          <div className="text-base text-textPrimary capitalize">{profile?.fitness || '--'}</div>

          <div className="text-sm text-gray-600 mt-4 mb-1">Activity Level</div>
          <div className="text-base text-textPrimary capitalize">{profile?.activity || '--'}</div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white shadow text-textPrimary font-medium border border-gray-200"
            onClick={() => alert('Edit profile coming soon')}
          >
            <Pencil size={20} /> Edit Profile
          </button>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-500 text-white font-semibold shadow hover:opacity-90"
            onClick={() => alert('Logout coming soon')}
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </BottomTabLayout>
  );
}