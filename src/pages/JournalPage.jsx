import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Dumbbell, Flame } from 'lucide-react';
import Button from '../components/Button';

export default function ProgressPage() {

    const [journalNote, setJournalNote] = useState('');
  


  return (
    <>
      {/* Journal Entry */}
    <div className="sm:col-span-1 lg:col-span-2 bg-surface p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold text-textPrimary">Quick Journal</h3>
      <textarea
        rows={4}
        value={journalNote}
        onChange={(e) => setJournalNote(e.target.value)}
        placeholder="Write something about today..."
        className="w-full p-3 rounded border border-border bg-background text-sm"
      />
      <Button onClick={async () => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        await supabase.from('journal_entries').insert([
          { user_id: user.id, date: new Date().toISOString(), content: journalNote }
        ]);

        setJournalNote('');
      }} variant="primary">
        💾 Save Journal Entry
      </Button>
    </div>
    </>
  )
}









