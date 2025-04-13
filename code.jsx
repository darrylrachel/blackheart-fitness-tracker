import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import CurrentProgramCard from '../components/CurrentProgramCard';
import WorkoutHistoryChart from '../components/WorkoutHistoryChart';
import WorkoutsPerWeekChart from '../components/WorkoutsPerWeekChart';
import ExerciseSearchModal from '../components/ExerciseSearchModal';


export default function WorkoutsPage() {
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from('workout_programs')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setError('Failed to load programs');
        console.error(error);
      } else {
        setAvailablePrograms(data);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, []);

  async function activateProgram(programId) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert('Please log in.');

    // Step 1: Mark any existing user_programs inactive
    await supabase
      .from('user_programs')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Step 2: Insert new active program
    const { error } = await supabase.from('user_programs').insert([
      {
        user_id: user.id,
        program_id: programId,
        current_day_index: 1, // Start at day 1
        is_active: true,
        started_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to activate program:', error);
      alert('Error activating program');
    } else {
      alert('Program activated!');
      setShowModal(false);
    }
  }


  function openModal(program) {
    setSelectedProgram(program);
    setShowModal(true);
  }

  function handleAddExercise(exercise) {
    setSelectedExercises(prev => [...prev, exercise]);
    setShowSearchModal(false); // optional: auto-close
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Your Workouts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Button variant="primary" onClick={() => alert('Coming soon: Generate Random Workout')}>
          🎲 Blank Workout
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          🗂️ Pre-Built Programs
        </Button>
        <Button variant="secondary" onClick={() => alert('Coming soon: Build your own Program')}>
          🧱 Build Your Own
        </Button>
        <Button variant="secondary" onClick={() => alert('Coming soon: Generate Random Workout')}>
          🎲 Random Workout
        </Button>
        <Button onClick={() => setShowSearchModal(true)}>
          🔍 Search Exercises
        </Button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrentProgramCard />
        <WorkoutHistoryChart />
        <WorkoutsPerWeekChart />

      </div>



      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-textPrimary">Pre-Built Programs</h2>
            {loading ? (
              <p className="text-sm text-textSecondary">Loading programs...</p>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {availablePrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-surface rounded-xl shadow-md p-4 space-y-2"
                  >
                    <h3 className="text-lg font-semibold text-textPrimary">{program.title}</h3>
                    <p className="text-sm text-textSecondary">{program.description}</p>
                    <p className="text-xs text-textSecondary italic">
                      Duration: {program.duration_days} days — Goal: {program.goal_type}
                    </p>
                    <Button variant="primary" onClick={() => activateProgram(program.id)}>
                      Start This Program
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSearchModal && (
        <ExerciseSearchModal
          onAdd={handleAddExercise}
          onClose={() => setShowSearchModal(false)}
        />
      )}

    </div>
  );
}



