import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Topbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

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
    <header className='bg-surface border-b border-border px-6 py-4 flex items-center justify-between shadow-sm'>
      <h1 className="text-xl font-bold text-textPrimary">
        {username ? `Welcome, ${username}` : 'Dashboard'}
      </h1>

      <div className='flex items-center gap-4'>
        <Button variant='danger' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
