
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { getLastExerciseLog } from '../utils/supabaseHelpers/getLastExerciseLog';
import Button from './Button';

export default function ExerciseCard({ index, exercise, onChange, onRemove }) {
  const [coachTip, setCoachTip] = useState(null);

  useEffect(() => {
    const fetchCoachTip = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user || !exercise.name) return;

      const result = await getLastExerciseLog(user.id, exercise.name);
      if (result) {
        const lastSet = result.sets[0];
        const suggestedWeight = Math.ceil(parseFloat(lastSet.weight || 0) * 1.025);
        const suggestedReps = lastSet.reps;

        setCoachTip(
          `Last: ${lastSet.weight} lbs for ${lastSet.reps} reps. Try ${suggestedWeight} lbs this time.`
        );

        // Autofill only if empty
        if (
          !exercise.sets[0].weight &&
          !exercise.sets[0].reps &&
          !exercise.sets[0].notes
        ) {
          const updatedSets = [...exercise.sets];
          updatedSets[0] = {
            weight: suggestedWeight.toString(),
            reps: suggestedReps,
            notes: '',
          };
          onChange(index, { ...exercise, sets: updatedSets });
        }
      }
    };

    fetchCoachTip();
  }, [exercise.name]);

  const handleSetChange = (field, value, setIndex) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex][field] = value;
    onChange(index, { ...exercise, sets: updatedSets });
  };

  return (
    <div className="border rounded p-4 bg-surface space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-textPrimary">Exercise {index + 1}</h3>
        <Button size="sm" variant="danger" onClick={() => onRemove(index)}>🗑 Remove</Button>
      </div>

      <input
        type="text"
        placeholder="Exercise Name"
        className="border p-2 rounded w-full text-sm"
        value={exercise.name}
        onChange={(e) => onChange(index, { ...exercise, name: e.target.value })}
      />

      {exercise.gifUrl && (
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          className="w-24 h-24 object-contain rounded mb-2"
        />
      )}


      {coachTip && (
        <div className="text-xs text-green-600 mt-1 italic">
          💡 Coach Tip: {coachTip}
        </div>
      )}

      {exercise.sets.map((set, setIndex) => (
        <div key={setIndex} className="flex gap-2 text-sm">
          <input
            type="number"
            placeholder="Weight"
            className="border p-2 rounded w-24"
            value={set.weight}
            onChange={(e) => handleSetChange('weight', e.target.value, setIndex)}
          />
          <input
            type="number"
            placeholder="Reps"
            className="border p-2 rounded w-24"
            value={set.reps}
            onChange={(e) => handleSetChange('reps', e.target.value, setIndex)}
          />
          <input
            type="text"
            placeholder="Notes"
            className="border p-2 rounded flex-1"
            value={set.notes}
            onChange={(e) => handleSetChange('notes', e.target.value, setIndex)}
          />
        </div>
      ))}
    </div>
  );
}
