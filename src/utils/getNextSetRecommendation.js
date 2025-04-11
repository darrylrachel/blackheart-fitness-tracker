export function getNextSetRecommendation(prevSet, targetRange = { min: 8, max: 12}) {
  const reps = parseInt(prevSet.reps, 10);
  const weight = parseInt(prevSet.weight);
  const completed = prevSet.completed;
  
  if (isNaN(reps) || isNaN(weight)) return { weight, repsRange: targetRange };

  // Default progression step (could be based on exercise type later)
  const step = 5;

  if (!completed || reps < targetRange.min) {
    return { weight: weight - step, repsRange: targetRange }; // reduce
  }

  if (reps >= targetRange.max) {
    return { weight: weight + step, repsRange: targetRange}; // increase
  }

  return { weight, repsRange: targetRange }; // maintain
}