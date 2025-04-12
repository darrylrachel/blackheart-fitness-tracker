import ProgramProgressDonut from '../components/ProgramProgressDonut';
import MetricDonut from '../components/MetricDonut';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false});

      if (!error) setWorkouts(data);
        setLoading(false);
    };

    fetchWorkouts();

    const fetchPrograms = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', user.id);

    if (!error) setPrograms(data);
  };

  fetchPrograms();


  }, []);

  async function saveTestProgram() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert('User not logged in');
      return;
    }

    const sampleProgram = {
      name: 'Push / Pull / Legs',
      description: 'Classic 3-day split',
      days: [
        {
          name: 'Push Day',
          muscles: 'Chest, Shoulders, Triceps',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '8-10' },
            { name: 'Overhead Shoulder Press', sets: 3, reps: '10-12' },
            { name: 'Tricep Dips', sets: 3, reps: '12-15' },
          ],
        },
        {
          name: 'Pull Day',
          muscles: 'Back, Biceps',
          exercises: [
            { name: 'Deadlifts', sets: 4, reps: '5-8' },
            { name: 'Pull-ups', sets: 3, reps: 'Max' },
            { name: 'Barbell Rows', sets: 3, reps: '8-10' },
          ],
        },
        {
          name: 'Leg Day',
          muscles: 'Quads, Glutes, Hamstrings',
          exercises: [
            { name: 'Squats', sets: 4, reps: '6-10' },
            { name: 'Leg Press', sets: 3, reps: '10-12' },
            { name: 'Romanian Deadlifts', sets: 3, reps: '10-12' },
          ],
        }
      ]
    };

    const { error } = await supabase.from('programs').insert([
      {
        user_id: user.id,
        name: sampleProgram.name,
        description: sampleProgram.description,
        days: sampleProgram.days,
      }
    ]);

    if (error) {
      console.error('Failed to save program', error);
      alert('Error saving program.');
    } else {
      alert('Program saved!');
    }
}

  return (
    <div className='space-y-6'>
      <h1 className="text-textPrimary text-2xl font-bold">Your Workouts</h1>
      <Button variant='primary' onClick={() => navigate('/workouts/new')}>
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

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <ProgramProgressDonut 
          name='Push/Pull/Legs'
          currentDay={12}
          totalDays={42}
        />

        <MetricDonut
          label='Strength Progress'
          value={75} // maybe 75% of a 1RM target
          total={100}
          color='#10b981'
        />

        <MetricDonut
          label='Workout Consistency'
          value={9} // 9 workouts dont this month
          total={12} // 12 expected
          color='#f59e0b'
        />

      </div>

      <Button onClick={() => navigate('/program')}>
        View Program
      </Button>

      {programs.length > 0 && (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-textPrimary">Saved Programs</h2>
        {programs.map((program) => (
          <div key={program.id} className="bg-background p-4 rounded shadow space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-textPrimary">{program.name}</h3>
              <Button
                variant="secondary"
                onClick={() => setSelectedProgramId(program.id)}
              >
                {selectedProgramId === program.id ? '✅ Selected' : 'Set Active'}
              </Button>
            </div>
            <p className="text-sm text-textSecondary">{program.description}</p>
            <p className="text-sm text-textSecondary">
              {program.days?.length} Day Split
            </p>
          </div>
        ))}
      </div>
    )}


      <div className='bg-surface rounded-lg p-4 shadow-md mt-4'>
        <h2 className='text-lg font-semibold mb-2 text-darkBlue'>Recent</h2>
        {loading ? (
          <p className='text-sm text-textSecondary'>Loading...</p>
        ) : workouts.length === 0 ? (
          <p className='text-sm text-textSecondary'>No workouts logged yet.</p>
        ) : (
          <div className="space-y-4">
            {workouts.slice(0, 5).map((workout) => {
              const exercises = typeof workout.exercises === 'string'
                ? JSON.parse(workout.exercises)
                : workout.exercises;

              return (
                <div key={workout.id} className="bg-background p-4 rounded shadow space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-textPrimary text-md">{workout.name}</h3>
                    <span className="text-xs text-gray">
                      {new Date(workout.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {exercises.map((exercise, i) => (
                    <div key={i}>
                      <p className="font-medium text-textPrimary mt-2">{exercise.name}</p>
                      {exercise.sets.map((set, j) => (
                        <p key={j} className="text-sm text-textSecondary ml-2">
                          Set {j + 1}: {set.reps} reps @ {set.weight} lbs
                          {set.complete ? ' ✅' : ' ❌'}
                          {set.notes && ` — Notes: ${set.notes}`}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

        )}
      </div>
    </div>
  );
}