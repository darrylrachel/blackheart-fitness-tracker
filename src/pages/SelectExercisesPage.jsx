import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const EXERCISE_API_HOST = 'exercisedb.p.rapidapi.com';
const EXERCISE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

export default function SelectExercisesPage() {
  const navigate = useNavigate();
  const [bodyPart, setBodyPart] = useState('chest');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      console.log('🔑 RapidAPI Key:', EXERCISE_API_KEY);

      const response = await axios.get(
        `https://${EXERCISE_API_HOST}/exercises/bodyPart/${bodyPart}?limit=20`,
        {
          headers: {
            'X-RapidAPI-Key': EXERCISE_API_KEY,
            'X-RapidAPI-Host': EXERCISE_API_HOST,
          },
        }
      );
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]);

  const handleSelect = (exercise) => {
    navigate('/workouts/new', { state: { selectedExercise: exercise } });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="px-4 py-4 flex items-center gap-2 text-xl font-bold text-textPrimary border-b border-gray-200">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-[#BFA85D]" />
        </button>
        Select Exercise
      </header>

      <div className="px-4 py-2">
        <select
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 mb-4"
        >
          {['chest', 'back', 'legs', 'arms', 'shoulders', 'abs', 'cardio'].map((part) => (
            <option key={part} value={part}>{part.charAt(0).toUpperCase() + part.slice(1)}</option>
          ))}
        </select>

        {loading ? (
          <p className="text-sm text-gray-500">Loading exercises...</p>
        ) : (
          <ul className="space-y-3">
            {exercises.map((ex) => (
              <li
                key={ex.id}
                className="border p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelect(ex)}
              >
                <div className="flex items-center gap-4">
                  <img src={ex.gifUrl} alt={ex.name} className="w-16 h-16 rounded object-cover" />
                  <div>
                    <p className="font-medium text-textPrimary">{ex.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{ex.bodyPart} • {ex.target}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
