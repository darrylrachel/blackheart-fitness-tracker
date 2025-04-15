import BottomTabLayout from '../layouts/BottomTabLayout';
import { useState } from 'react';

export default function OneRepMaxPage() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [result, setResult] = useState(null);

  const calculate1RM = () => {
    const w = Number(weight);
    const r = Number(reps);
    if (!w || !r || r > 30) return setResult(null);

    const estimated1RM = Math.round(w * (1 + r / 30));
    setResult(estimated1RM);
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10">
        <h1 className="text-xl font-bold text-textPrimary mb-4">1RM Calculator</h1>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Weight lifted (lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <input
            type="number"
            placeholder="Reps performed (1-30)"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />

          <button
            onClick={calculate1RM}
            className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            Calculate
          </button>

          {result && (
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-lg font-semibold text-textPrimary mb-1">Estimated 1RM: {result} lbs</p>
              <p className="text-sm text-gray-500">Use this to guide strength programming percentages.</p>
            </div>
          )}
        </div>
      </div>
    </BottomTabLayout>
  );
}
