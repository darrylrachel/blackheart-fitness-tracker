import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function WorkoutPage() {
  const navigate = useNavigate();

  return (
    <div className='space-y-6'>
      <h1 className="text-textPrimary text-2xl font-bold">Your Workouts</h1>
      <Button variant='primary' onClick={() => navigate('/workouts/start')}>
          Start New Workout</Button>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Button variant='primary' onClick={() => alert('Coming soon: Pre-Built Program')}>
          🗂️ Pre-Built Programs
        </Button>
        <Button variant='secondary' onClick={() => alert('Coming soon: Build your own Program')}>
          🧱 Build Your Own
        </Button>
        <Button variant='secondary' onClick={() => alert('Coming soon: Generate Random Workout')}>
          🎲 Generate Random Workout
        </Button>
      </div>

      <div className='bg-surface rounded-lg p-4 shadow-md mt-4'>
        <h2 className='text-lg font-semibold mb-2 text-darkBlue'>Recent</h2>
        <ul className='text-textSecondary text-sm space-y-2'>
          <li>✅ Apr 8 - Push Day (Chest, Shoulders, Triceps)</li>
          <li>✅ Apr 6 - Legs</li>
          <li>✅ Apr 4 - Pull Day (Back, Biceps)</li>
        </ul>
      </div>
    </div>
  );
}