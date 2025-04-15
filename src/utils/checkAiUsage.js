// checkAiUsage.js
import { supabase } from '../utils/supabase';

export async function checkAiUsageLimit(user_id, isPro) {
  if (isPro) return { allowed: true };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .gte('timestamp', startOfMonth.toISOString());

  if (error) {
    console.error('Error checking AI usage:', error);
    return { allowed: false, error: true };
  }

  const limit = 10;
  const remaining = limit - count;

  return {
    allowed: remaining > 0,
    remaining,
  };
}
