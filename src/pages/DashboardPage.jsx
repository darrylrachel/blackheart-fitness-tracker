import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Dumbbell, Flame, CalendarHeart } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import GoalDonut from '../components/GoalDonut';
import MacroDonut from '../components/MacroDonut';
import ProgressCalendar from '../components/ProgressCalendar';


export default function  DashboardPage() {
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [macrosToday, setMacrosToday] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [journalNote, setJournalNote] = useState('');
  const [metrics, setMetrics] = useState({ 
    weight: null,
    water: null,
    mood: null
   });
  const [editingField, setEditingField] = useState(null); // // "weight" | "water" | "mood"
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    const fetchProgress = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get calories logged today
      const { data: meals } = await supabase
        .from('nutrition_logs')
        .select('calories, quantity')
        .eq('user_id', user.id)
        .eq('date', today);

      const totalCalories = meals?.reduce((acc, item) => {
        const qty = parseFloat(item.quantity) || 1;
        return acc + (item.calories || 0) * qty;
      }, 0) || 0;

      setCaloriesToday(totalCalories);

      // Get last 30 days of nutrition logs
      const { data: historyLogs } = await supabase
        .from('nutrition_logs')
        .select('date, calories, quantity')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const grouped = {};

      historyLogs?.forEach((entry) => {
        const date = entry.date;
        const qty = parseFloat(entry.quantity) || 1;
        const cals = (entry.calories || 0) * qty;

        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += cals;
      });

      setNutritionHistory(grouped);


      // Get workouts from past 7 days
      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('id, created_at')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo);

      setWorkoutsThisWeek(workouts?.length || 0);

      // Get today's macro breakdown
      const { data: macros } = await supabase
        .from('nutrition_logs')
        .select('protein, carbs, fats, quantity')
        .eq('user_id', user.id)
        .eq('date', today);

      const totals = macros?.reduce((acc, item) => {
        const qty = parseFloat(item.quantity) || 1;
        acc.protein += (item.protein || 0) * qty;
        acc.carbs += (item.carbs || 0) * qty;
        acc.fats += (item.fats || 0) * qty;
        return acc;
      }, { protein: 0, carbs: 0, fats: 0 });

      setMacrosToday({
        protein: totals?.protein || 0,
        carbs: totals?.carbs || 0,
        fats: totals?.fats || 0,
      });

      const { daily: daily, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

      if (daily) {
        setMetrics({
          weight: daily.weight,
          water: daily.water,
          mood: daily.mood
        });
      }

    };

    fetchProgress();
  }, []);

  

  async function saveJournalEntry() {
    if (!journalNote.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if(!user) {
      alert('Not logged in!');
      return;
    }

    const { error } = await supabase.from('journal_entries').insert([
      {
        user_id: user.id,
        date: new Date().toISOString(),
        content: journalNote.trim(),
      }
    ]);

    if (error) {
      console.error('Failed to save journal entry:', error);
      alert('Error saving journal entry');
    } else {
      alert('Journal saved!');
      setJournalNote('');
    }
  }

  async function saveMetric() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    const today = new Date().toISOString().split('T')[0];
    if (!user) return;

    const update = { [editingField]: inputValue };

    const { data: existing } = await supabase
      .from('daily_metrics')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from('daily_metrics')
        .update(update)
        .eq('id', existing.id));
    } else {
      ({ error } = await supabase
        .from('daily_metrics')
        .insert([{ ...update, user_id: user.id, date: today }]));
    }

    if (!error) {
      setMetrics(prev => ({ ...prev, [editingField]: inputValue }));
      setEditingField(null);
      setInputValue('');
    } else {
      console.error('Failed to save metric:', error);
    }
  }


  function handleEdit(field) {
    setEditingField(field);
    setInputValue(metrics[field] || '');
  }


  
  return (
    <div className='space-y-8'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Weight"
          value={metrics.weight ? `${metrics.weight} lbs` : '—'}
          icon={<Dumbbell size={24} />}
          onClick={() => handleEdit('weight')}
        />
        <StatCard
          title="Water"
          value={metrics.water ? `${metrics.water} oz` : '—'}
          icon={<Flame size={24} />}
          iconBg="bg-blue-500"
          onClick={() => handleEdit('water')}
        />
        <StatCard
          title="Mood"
          value={metrics.mood || '—'}
          icon={<span className="text-xl">{metrics.mood || '🙂'}</span>}
          iconBg="bg-yellow-400"
          onClick={() => handleEdit('mood')}
        />
      </div>

      {editingField && (
        <div className="bg-surface p-4 rounded shadow mt-4 space-y-2">
          <label className="block text-sm text-textPrimary font-medium">
            {`Update ${editingField.charAt(0).toUpperCase() + editingField.slice(1)}`}
          </label>

          {editingField === 'mood' ? (
            <div className="flex gap-2 text-2xl">
              {['😐', '🙂', '😄', '😤', '🥱'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputValue(emoji);
                    saveMetric();
                  }}
                  className={inputValue === emoji ? 'ring-2 ring-primary rounded' : ''}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="number"
              placeholder={`Enter ${editingField}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-sm"
            />
          )}

          {editingField !== 'mood' && (
            <div className="flex gap-2">
              <Button variant="primary" onClick={saveMetric}>Save</Button>
              <Button variant="secondary" onClick={() => setEditingField(null)}>Cancel</Button>
            </div>
          )}
        </div>
      )}


      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <GoalDonut label='Calories Today' value={Math.round(caloriesToday)} total={2200} color='#e74c3c' />
        <MacroDonut data={macrosToday} totals={{ protein: 150, carbs: 250, fats: 80 }} />
        <ProgressCalendar history={nutritionHistory} dailyGoal={2200} />
        <GoalDonut label='Workouts This Week' value={workoutsThisWeek} total={5} color='#6366f1' />

        {/* Journal Entry */}
        <div className='sm:col-span-1 lg:col-span-2 bg-surface p-4 rounded shadow space-y-4'>
          <h3 className='text-lg font-semibold text-textPrimary'>Quick Journal</h3>
          <textarea
            rows={4}
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            placeholder='Write something about today...'
            className='w-full p-3 rounded border border-border bg-background text-sm'
          />
          <Button
            onClick={saveJournalEntry}
            variant='primary'
          >
            💾 Save Journal Entry
          </Button>
        </div>
        {/* Journal Entry */}
        
      </div>

    </div>
  )
}