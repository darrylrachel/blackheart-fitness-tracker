import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Topbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    const {error} = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    }
  }

  return (
    <header className='bg-surface border-b border-border px-6 py-4 flex items-center justify-between shadow-sm'>
      <div className='text-lg font-bold text-textPrimary'>Dashboard</div>

      <div className='flex items-center gap-4'>
        <Button variant='danger' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}