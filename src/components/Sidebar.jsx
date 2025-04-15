import { NavLink } from "react-router-dom";
import UserMenu from './UserMenu';
import MobileDrawer from "./MobileDrawer";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex bg-surface text-Primary w-64 min-h-screen flex-col shadow-lg">
      <div className="md:flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-textPrimary">Blackheart Coach</h1>
      </div>



      {/* NavLink Items */}
      <nav className="flex-1 px-4 py-6 space-y-4 text-sm ">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Dashboard
        </NavLink>

        <NavLink
          to="/workouts"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Workouts
        </NavLink>

        <NavLink
          to="/nutrition"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Nutrition
        </NavLink>

        <NavLink
          to="/calculator"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Calculator
        </NavLink>

        <NavLink
          to="/journal"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Journal
        </NavLink>

        <NavLink
          to="/workouts/history"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            History
        </NavLink>

        <NavLink
          to="/coach"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Coach
        </NavLink>

        <NavLink
          to="https://blackheartlabs.com/" // progress
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Shop
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Profile
        </NavLink>
        
      </nav>

    </aside>
  )
}