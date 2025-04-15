import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import CurrentProgramCard from '../components/CurrentProgramCard';
import WorkoutHistoryChart from '../components/WorkoutHistoryChart';
import WorkoutsPerWeekChart from '../components/WorkoutsPerWeekChart';
import ExerciseSearchModal from '../components/ExerciseSearchModal';
import RandomWorkoutModal from '../components/RandomWorkoutModal';
import BackButton from '../components/BackButton';

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRandomWorkoutModal, setShowRandomWorkoutModal] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from('workout_programs')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load programs:', error);
        setError('Failed to load programs');
      } else {
        setAvailablePrograms(data);
      }

      setLoading(false);
    };

    if (showModal) {
      fetchPrograms();
    }
  }, [showModal]);

  function handleAddExercise(exercise) {
    const formatted = {
      name: exercise.name,
      search: '',
      sets: [{ weight: '', reps: '', notes: '' }],
    };
    setSelectedExercises((prev) => [...prev, formatted]);
  }

  async function activateProgram(program) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert('Please log in.');

    const { error } = await supabase.from('user_programs').insert([
      {
        user_id: user.id,
        program_id: program.id,
        program_name: program.title,
        current_day_index: 0,
        is_active: true,
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

  return (
    <div className="space-y-6 px-4 max-w-screen-xl mx-auto">
      <BackButton fallback='/dashboard' />
      <h1 className="text-2xl font-bold text-textPrimary">💪 Workouts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-0">
        <Button variant="primary" onClick={() => navigate('/workouts/new')}>
          ➕ Start Blank Workout
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          🗂️ Pre-Built Programs
        </Button>
        <Button variant="secondary" onClick={() => navigate('/workouts/create')}>
          🧱 Build Your Own Program
        </Button>
        <Button variant="secondary" onClick={() => setShowRandomWorkoutModal(true)}>
          🎲 Random Workout
        </Button>
        <Button variant="secondary" onClick={() => setShowSearchModal(true)}>
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
              <p className="text-sm text-gray-500">Loading programs...</p>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {availablePrograms.map((program) => (
                  <div key={program.id} className="bg-surface rounded-xl shadow-md p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-textPrimary">{program.title}</h3>
                    <p className="text-sm text-textSecondary">{program.description}</p>
                    <p className="text-xs text-textSecondary italic">
                      Duration: {program.duration_days} days — Goal: {program.goal_type}
                    </p>
                    <Button variant="primary" onClick={() => activateProgram(program)}>
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

      {selectedExercises.length > 0 && (
        <Button
          variant="success"
          onClick={() =>
            navigate('/workouts/new', {
              state: { exercises: selectedExercises },
            })
          }
        >
          ✅ Continue with Selected ({selectedExercises.length})
        </Button>
      )}

      {showSearchModal && (
        <ExerciseSearchModal
          onAdd={handleAddExercise}
          onClose={() => setShowSearchModal(false)}
          selectedExercises={selectedExercises}
          onContinue={() =>
            navigate('/workouts/new', {
              state: { exercises: selectedExercises },
            })
          }
        />
      )}

      {showRandomWorkoutModal && (
        <RandomWorkoutModal
          onClose={() => setShowRandomWorkoutModal(false)}
          onUseWorkout={(exercises) => {
            setShowRandomWorkoutModal(false);
            navigate('/workouts/new', {
              state: { exercises }
            });
          }}
        />
      )}
    </div>
  );
}
