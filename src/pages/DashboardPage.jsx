import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Dumbbell, Flame, CalendarHeart } from 'lucide-react';
import StatCard from '../components/StatCard';
import GoalDonut from '../components/GoalDonut';



export default function  DashboardPage() {
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get calories logged today
      const { data: meals } = await supabase
        .from('nutrition_logs')
        .select('calories, quantity')
        .eq('user_id', user.id)
        .eq('date', today);

      const totalCalories = meals?.reduce((acc, item) => {
        const qty = parseFloat(item.quantity) || 1;
        return acc + (item.calories || 0) * qty;
      }, 0) || 0;

      setCaloriesToday(totalCalories);

      // Get workouts from past 7 days
      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('id, created_at')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo);

      setWorkoutsThisWeek(workouts?.length || 0);
    };

    fetchProgress();
  }, []);


  
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
        <GoalDonut label='Calories Today' value={Math.round(caloriesToday)} total={2200} color='#e74c3c' />
        <GoalDonut label='Workouts This Week' value={workoutsThisWeek} total={5} color='#6366f1' />

        <GoalDonut label='Steps Today' value={7345} total={10000} color='#27ae60' />
        <GoalDonut label='Workouts This Week' value={3} total={5} color='#e2c3e50' />
      </div>
    </div>
  )
}