import { supabase } from '../supabase';

export async function getActiveWorkout() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { data: userProgram, error: programError } = await supabase
    .from("user_programs")
    .select(`current_day_index, program_id`)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (programError || !userProgram?.program_id) {
    return { error: "No active program found" };
  }

  const { data: program, error: workoutError } = await supabase
    .from("workout_programs")
    .select("title, days")
    .eq("id", userProgram.program_id)
    .single();

  if (workoutError || !program?.days) return { error: "Program not found" };

  const dayKey = `day${userProgram.current_day_index}`;
  const todayWorkout = program.days?.[dayKey];

  return {
    programTitle: program.title,
    day: userProgram.current_day_index,
    workout: todayWorkout,
  };
}
