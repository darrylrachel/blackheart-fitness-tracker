import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { Dumbbell, Flame, CalendarHeart } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function  DashboardPage() {
  // const navigate = useNavigate();

  // async function handleLogout() {
  //   const { error } = await supabase.auth.signOut();
  //   if (!error) {
  //     navigate('/login');
  //   } else {
  //     console.error('Logout failed:', error.message);
  //   }
    
  // }


  // return (
  //   <Layout>
  //     <div className='min-h-screen flex flex-col justify-center item-center bg-darkBlue text-lightGray px-4'>
  //       <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
  //       <Button variant='danger' onClick={handleLogout}>Log Out</Button>
  //     </div>
  //   </Layout>
  // );

  return (
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
  )
}