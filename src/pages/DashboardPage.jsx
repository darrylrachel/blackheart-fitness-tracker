import Button from '../components/Button';
import Layout from '../components/Layout';
import { Dumbbell, Flame, CalendarHeart } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProgressChart from '../components/ProgressChart';
import GoalDonut from '../components/GoalDonut';

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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <GoalDonut label='Calories Today' value={1480} total={2200} color='#e74c3c' />
        <GoalDonut label='Steps Today' value={7345} total={10000} color='#27ae60' />
        <GoalDonut label='Workouts This Week' value={3} total={5} color='#e2c3e50' />
      </div>
      {/* <ProgressChart /> */}
    </div>
  )
}