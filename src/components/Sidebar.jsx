import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="bg-surface text-Primary w-64 min-h-screen flex flex-col shadow-lg">
      <div className="text-center p-6 text-2xl font-bold border-b border-slate">
        <span className="text-brand">Blackheart</span> Coach
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
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
          to="/progress"
          className={({ isActive }) => 
            `block px-4 py-2 rounded hover:bg-primary/20 transition ${isActive ? 'bg-accent text-white' : 'text-textSecondary'
            }`
          }>
            Progress
        </NavLink>
        
      </nav>
    </aside>
  )
}