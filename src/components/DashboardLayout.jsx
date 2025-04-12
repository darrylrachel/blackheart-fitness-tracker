import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { supabase } from '../utils/supabase';

export default function DashboardLayout({ children }) {
  const [profile, setProfile] = useState(null);

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
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-textPrimary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Topbar profile={profile} />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
