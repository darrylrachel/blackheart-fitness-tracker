import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { supabase } from "../utils/supabase";

export default function WorkoutReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { workoutName, exercises } = location.state || {};

  // ✅ Corrected the condition: show error when data is missing
  if (!workoutName || !exercises || !Array.isArray(exercises)) {
    return (
      <div className="text-red text-sm">
        No workout data found. Please start from the workout builder.
      </div>
    );
  }

  async function handleSaveWorkout() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("You must be logged in to save workouts.");
      return;
    }

    const { error } = await supabase.from("user_workouts").insert([
      {
        user_id: user.id,
        name: workoutName,
        exercises: exercises, // Stored as JSONB
      },
    ]);

    if (error) {
      console.error("Error saving workout:", error);
      alert("Something went wrong saving your workout.");
    } else {
      alert("Workout saved successfully!");
      navigate("/workouts");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Review Your Workout</h1>
      <p className="text-textSecondary">
        Workout Name: <strong>{workoutName}</strong>
      </p>

      {exercises.map((exercise, i) => (
        <div
          key={i}
          className="bg-surface p-4 rounded shadow-md space-y-2"
        >
          <h2 className="font-semibold text-textPrimary">{exercise.name}</h2>
          {exercise.sets.map((set, j) => (
            <div key={j} className="text-sm text-textSecondary">
              Set {j + 1}: {set.reps} reps @ {set.weight} lbs
              {set.complete ? ' ✅' : ' ❌'}
              {set.notes && <> — Notes: {set.notes}</>}
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          🔙 Go Back
        </Button>
        <Button variant="primary" onClick={handleSaveWorkout}>
          ✅ Confirm & Save
        </Button>
      </div>
    </div>
  );
}
