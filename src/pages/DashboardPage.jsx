import Button from '../components/Button';
import Layout from '../components/Layout';
import { Dumbbell, Flame, CalendarHeart } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProgressChart from '../components/ProgressChart';

export default function  DashboardPage() {
  
  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
        <StatCard 
          title="Workout complete"
          value="Chest + Back"
          icon={<Dumbbell size={24} />}
        />
        <StatCard 
          title="Calories Remaining"
          value="540 kcal"
          icon={<Flame size={24} />}
          iconBg='bg-red'
        />
        <StatCard 
          title="Steps Today"
          value="7,842"
          icon={<CalendarHeart size={24} />}
          iconBg='bg-slate'
        />
        <StatCard 
          title="Mood"
          value="Feeling Great 😎"
          icon={<Flame size={24} />}
          iconBg='bg-green'
        />
      </div>
      <ProgressChart />
    </div>
  )
}