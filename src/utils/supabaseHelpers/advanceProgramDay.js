// lib/supabaseHelpers/advanceProgramDay.js
import { supabase } from "../supabase";

export async function advanceProgramDay() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("program_day, active_program_id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile?.active_program_id) {
    return { error: "No active program set" };
  }

  // Get active program's days
  const { data: program, error: programError } = await supabase
    .from("workout_programs")
    .select("days")
    .eq("id", profile.active_program_id)
    .single();

  if (programError || !program?.days) {
    return { error: "Program not found or missing days" };
  }

  const totalDays = Object.keys(program.days).length;
  const currentDay = profile.program_day || 1;
  const nextDay = currentDay >= totalDays ? 1 : currentDay + 1;

  // Update profile with next program day
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ program_day: nextDay })
    .eq("user_id", user.id);

  if (updateError) return { error: "Failed to advance program day" };

  return { success: true, nextDay };
}