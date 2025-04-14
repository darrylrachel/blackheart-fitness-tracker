
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

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

      if (!data) {
        // Auto-create profile for new users
        await supabase.from('profiles').insert({
          id: user.id,
          onboarding_complete: false
        });
        navigate('/onboarding');
        return;
      }

      setProfile(data);

      if (!data.onboarding_complete) {
        navigate('/onboarding');
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-sm text-textSecondary p-6">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Topbar username={profile?.username} />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
