import { useEffect, useState } from "react";
import { getActiveWorkout } from "../utils/supabaseHelpers/getActiveWorkout";
import { advanceProgramDay } from "../utils/supabaseHelpers/advanceProgramDay";
import Button from '../components/Button';

export default function WorkoutOverview() {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveWorkout().then((result) => {
      setActiveWorkout(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading workout...</p>;
  if (!activeWorkout || activeWorkout?.error) return <p>No active program found.</p>;
  console.log(activeWorkout);

  return (
    <div className="p-4 bg-surface rounded shadow">
      <h2 className="text-lg font-semibold text-textPrimary mb-2">
        {activeWorkout.programTitle} – Day {activeWorkout.day}
      </h2>

      {activeWorkout.workout?.exercises?.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-textSecondary space-y-1">
          {activeWorkout.workout.exercises.map((ex, idx) => (
            <li key={idx}>{ex.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-textSecondary">No exercises for this day yet.</p>
      )}

      <Button
        className="mt-4"
        onClick={async () => {
          const result = await advanceProgramDay();
          if (result.success) {
            alert("Workout complete! Next day loaded.");
            window.location.reload();
          } else {
            alert(result.error);
          }
        }}
      >
        ✅ Finish Workout
      </Button>
    </div>
  );
}
