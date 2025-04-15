import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Salad, Calculator, User } from 'lucide-react';

const TABS = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={24} /> },
  { name: 'Workouts', path: '/workouts', icon: <Dumbbell size={24} /> },
  { name: 'Nutrition', path: '/nutrition', icon: <Salad size={24} /> },
  { name: 'Calculator', path: '/calculator', icon: <Calculator size={24} /> },
  { name: 'Profile', path: '/profile', icon: <User size={24} /> },
];

export default function BottomTabLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = TABS.find(tab => location.pathname.startsWith(tab.path))?.name || '';

  return (
    <div className="min-h-screen scroll-pb-32 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl text-gray-900 font-[Inter] relative">
      {/* Top header */}
      <header className="px-4 py-4 text-xl font-semibold text-center">
        {activeTab}
      </header>

      {/* Main content */}
      <main className="pb-32 px-4">
        {children || (
          <div className="text-center text-gray-600 pt-20">
            <p className="text-lg">This is the <strong>{activeTab}</strong> page layout.</p>
            <p className="text-sm mt-2">Swipe or tap below to explore more sections.</p>
          </div>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="sticky bottom-0 inset-x-0 z-50 bg-white/40 backdrop-blur-md border-t border-white/30 shadow-xl rounded-t-2xl">
        <div className="flex justify-around py-2">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center text-xs font-medium transition-all duration-200 ${
                activeTab === tab.name ? 'text-[#BFA85D]' : 'text-gray-500'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
