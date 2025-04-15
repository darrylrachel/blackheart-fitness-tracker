import { useState } from 'react';
import BottomTabLayout from '../layouts/BottomTabLayout';
import { SmilePlus, ArrowLeft } from 'lucide-react';

export default function JournalPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 space-y-6">
        <h1 className="text-xl font-bold text-textPrimary mb-2">Journal</h1>

        {/* Mood Selector */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">How are you feeling today?</h2>
          <div className="flex gap-4 justify-center">
            {['😃', '🙂', '😐', '😞', '😡'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                className={`text-3xl transition transform ${mood === emoji ? 'scale-125' : 'opacity-60'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Input */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-textPrimary mb-2">Write a note</h2>
          <textarea
            rows={5}
            placeholder="Today I crushed my workout..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BFA85D]"
          ></textarea>
        </div>

        {/* Save Button */}
        <div>
          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
          >
            <SmilePlus size={20} /> Save Entry
          </button>
        </div>
      </div>
    </BottomTabLayout>
  );
}
