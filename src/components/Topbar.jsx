import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import MobileDrawer from './MobileDrawer';
import UserMenu from './UserMenu';
import { useUserProfile } from '../hooks/useUserProfile';

export default function Topbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const { profile } = useUserProfile();

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.username) {
        setUsername(profile.username);
      }
    };

    fetchUsername();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    }
  }

  return (
    <header className='bg-surface border-b border-border px-4 py-3 flex items-center justify-between shadow-sm'>
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileDrawer />
        </div>
        <h1 className="text-base sm:text-lg font-semibold text-textPrimary">
          {profile?.username ? `Welcome, ${profile.username}` : 'Dashboard'}
        </h1>
      </div>


      <div className="md:block hidden">
        <UserMenu />
      </div>

    </header>
  );
}
