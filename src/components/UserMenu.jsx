import {
  ChevronDown,
  LogOut,
  Moon,
  Settings,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className='relative mt-auto px-4 pt-6'>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-background transition"
      >
        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
          BH
        </div>
        <span className="text-sm text-textPrimary font-medium">My Account</span>
        <ChevronDown className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className='absolute left-4 right-4 mt-2 bg-surface rounded-lg shadow-lg z-10'>
          <ul className='text-sm text-textSecondary divide-y divide-border'>
            <li>
              <button
                onClick={() => navigate('/profile')}
                className='flex items-center gap-2 w-full px-4 py-2 hover:bg-background'
              >
                <User size={16} />
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/settings')}
                className='flex items-center gap-2 w-full px-4 py-2 hover:bg-background'
              >
                <Settings size={16} />
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => alert('Dark mode toggle coming soon!')}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-background"
              >
                <Moon size={16} />
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-textPrimary"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

    </div>
  )
}