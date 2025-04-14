import { supabase } from '../supabase'

/**
 * Get the most recent logged sets for a given user + exercise name.
 */
export async function getLastExerciseLog(userId, exerciseName) {
  const { data, error } = await supabase
    .from('user_workouts')
    .select('exercises, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10); // search last 10 workouts

  if (error) {
    console.error('Error fetching workout history:', error);
    return null;
  }

  for (const workout of data) {
    const match = workout.exercises?.find(
      (ex) => ex.name.toLowerCase() === exerciseName.toLowerCase()
    );
    if (match) {
      return {
        name: match.name,
        sets: match.sets,
        date: workout.created_at,
      };
    }
  }

  return null;
}
