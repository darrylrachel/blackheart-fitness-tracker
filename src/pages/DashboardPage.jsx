import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';

export default function  DashboardPage() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    } else {
      console.error('Logout failed:', error.message);
    }
    
  }


  return (
    <Layout>
      <div className='min-h-screen flex flex-col justify-center item-center bg-darkBlue text-lightGray px-4'>
        <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
        <Button variant='danger' onClick={handleLogout}>Log Out</Button>
      </div>
    </Layout>
  );
}