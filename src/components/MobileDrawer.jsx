
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/workouts', label: '💪 Workouts' },
    { to: '/nutrition', label: '🥗 Nutrition' },
    { to: '/journal', label: '📝 Journal' },
    { to: '/profile', label: '⚙️ Profile' },
    // { to: '/settings', label: '🔧 Settings' },
    // { to: '/billing', label: '💳 Billing' },
    { to: '/logout', label: '🚪 Logout' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-3 text-gray-700"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-textPrimary">Menu</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        <h1 className="text-lg font-bold px-4 pt-4">Blackheart Coach</h1>


        <nav className="p-4 space-y-4 text-sm">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block text-textPrimary hover:underline ${location.pathname === to ? 'font-semibold' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
