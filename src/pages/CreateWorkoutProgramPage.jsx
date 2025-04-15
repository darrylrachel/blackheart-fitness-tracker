
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';
import BackButton from '../components/BackButton';

export default function CreateWorkoutProgramPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [goalType, setGoalType] = useState('');
  const [days, setDays] = useState([]);

  function addDay() {
    setDays(prev => [
      ...prev,
      {
        name: '',
        muscles: '',
        exercises: [{ name: '', sets: '', reps: '' }],
      },
    ]);
  }

  function removeDay(index) {
    setDays(prev => prev.filter((_, i) => i !== index));
  }

  function updateDay(index, field, value) {
    const copy = [...days];
    copy[index][field] = value;
    setDays(copy);
  }

  function updateExercise(dayIndex, exIndex, field, value) {
    const copy = [...days];
    copy[dayIndex].exercises[exIndex][field] = value;
    setDays(copy);
  }

  function addExerciseToDay(dayIndex) {
    const copy = [...days];
    copy[dayIndex].exercises.push({ name: '', sets: '', reps: '' });
    setDays(copy);
  }

  async function handleSubmit() {
    const { error } = await supabase.from('workout_programs').insert([
      {
        title,
        description,
        duration_days: duration,
        goal_type: goalType,
        days,
      },
    ]);

    if (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program');
    } else {
      alert('Program created!');
      navigate('/workouts');
    }
  }

  return (
    <div className="space-y-6">
      <BackButton fallback='/workouts' />
      <h1 className="text-2xl font-bold text-textPrimary">🛠️ Build Your Own Program</h1>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Program Title"
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Duration (days)"
          className="border p-2 rounded w-full"
          value={duration}
          onChange={(e) => {
            const val = e.target.value;
            setDuration(val === '' ? '' : Number(val));
          }}
        />

        <select
          className="border p-2 rounded w-full"
          value={goalType}
          onChange={(e) => setGoalType(e.target.value)}
        >
          <option value="">Select Goal Type</option>
          <option value="strength">Strength</option>
          <option value="hypertrophy">Hypertrophy</option>
          <option value="fat_loss">Fat Loss</option>
          <option value="general_fitness">General Fitness</option>
        </select>

        <div className="space-y-6">
          {days.map((day, i) => (
            <div key={i} className="border rounded p-4 space-y-3 bg-surface shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-textPrimary">Day {i + 1}</h3>
                <Button size="sm" variant="danger" onClick={() => removeDay(i)}>🗑 Remove Day</Button>
              </div>

              <input
                type="text"
                placeholder="Day Name (e.g. Push Day)"
                className="border p-2 rounded w-full"
                value={day.name}
                onChange={(e) => updateDay(i, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Target Muscles (e.g. Chest, Shoulders)"
                className="border p-2 rounded w-full"
                value={day.muscles}
                onChange={(e) => updateDay(i, 'muscles', e.target.value)}
              />

              {day.exercises.map((ex, j) => (
                <div key={j} className="grid grid-cols-3 gap-2 text-sm">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, j, 'name', e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Reps"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, j, 'reps', e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Sets"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, j, 'sets', e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
              ))}

              <Button size="sm" onClick={() => addExerciseToDay(i)}>➕ Add Exercise</Button>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={addDay}>➕ Add Day</Button>
        <Button variant="primary" onClick={handleSubmit}>💾 Save Program</Button>
      </div>
    </div>
  );
}
