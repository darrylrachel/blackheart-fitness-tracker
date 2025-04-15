/**
 * Smart Coach Logic
 * Compare last set and current performance
 */

export function getSmartCoachSuggestion({
  previousSet,
  currentSet,
  targetReps = 10,
  minRepsToProgress = 10,
  weightIncrement = 5,
}) {
  if (!previousSet || !currentSet) return 'Keep training and logging to get Smart Coach tips!';

  const lastReps = Number(previousSet.reps || 0);
  const lastWeight = Number(previousSet.weight || 0);
  const currentReps = Number(currentSet.reps || 0);
  const currentWeight = Number(currentSet.weight || 0);

  if (currentReps >= minRepsToProgress && currentWeight >= lastWeight) {
    return `You hit ${currentReps} reps at ${currentWeight} lbs — time to level up! Try ${currentWeight + weightIncrement} lbs next session.`;
  } else if (currentReps < targetReps) {
    return `You logged ${currentReps} reps at ${currentWeight} lbs. Let’s aim for ${targetReps} reps next time before increasing weight.`;
  } else {
    return `Solid effort! Stay consistent at ${currentWeight} lbs or push to ${currentWeight + weightIncrement} lbs next time.`;
  }
}
