import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Dumbbell, Flame } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import GoalDonut from '../components/GoalDonut';
import MacroDonut from '../components/MacroDonut';
import ProgressCalendar from '../components/ProgressCalendar';
import WorkoutOverview from '../components/WorkoutOverview';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
   Tooltip, 
   ResponsiveContainer
} from 'recharts';


function getLocalDate() {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split('T')[0];
}

export default function DashboardPage() {
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [macrosToday, setMacrosToday] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [metrics, setMetrics] = useState({ weight: null, water: null, mood: null });
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [profile, setProfile] = useState(null);
  const [trendHistory, setTrendHistory] = useState({});

  const today = getLocalDate();

  async function fetchEverything() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (profileData) setProfile(profileData);

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
    setMacrosToday(totals);

    const { data: history } = await supabase
      .from('nutrition_logs')
      .select('date, calories, quantity')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    const grouped = {};
    history?.forEach((entry) => {
      const date = entry.date;
      const qty = parseFloat(entry.quantity) || 1;
      const cals = (entry.calories || 0) * qty;
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += cals;
    });
    setNutritionHistory(grouped);

    const { data: workouts } = await supabase
      .from('user_workouts')
      .select('id, created_at')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo);
    setWorkoutsThisWeek(workouts?.length || 0);

    const { data: metricsData } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();
    if (metricsData) {
      setMetrics({
        weight: metricsData.weight,
        water: metricsData.water,
        mood: metricsData.mood
      });
    }

    const { data: metricHistory } = await supabase
      .from('daily_metrics')
      .select('date, weight, water')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 *1000).toISOString());

    const trends = (metricHistory || [])
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        water: entry.water ?? null,
        weight: entry.weight ?? null,
      }));
    setTrendHistory(trends);

  }

  useEffect(() => {
    fetchEverything();
  }, []);

  async function saveMetric(value = inputValue) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const today = getLocalDate();

    const update = {
      weight: editingField === 'weight' ? value : metrics.weight ?? null,
      water: editingField === 'water' ? value : metrics.water ?? null,
      mood: editingField === 'mood' ? value : metrics.mood ?? null,
      weight_unit: profile?.weight_unit ?? 'lbs',
      water_unit: profile?.water_unit ?? 'oz',
    };

    const { data: existing } = await supabase
      .from('daily_metrics')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

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
      setMetrics((prev) => ({ ...prev, [editingField]: value }));
      setEditingField(null);
      setInputValue('');
      await fetchEverything(); // refresh data
    } else {
      console.error('Error saving metric', error);
    }
  }

  function handleEdit(field) {
    setEditingField(field);
    setInputValue(metrics[field] || '');
  }

  if (!profile) {
    return <div className="text-sm text-textSecondary">Loading profile...</div>;
  }

  return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Weight"
            value={
              metrics.weight
                ? `${metrics.weight} ${profile?.weight_unit || 'lbs'}`
                : '—'
            }
            icon={<Dumbbell size={24} color='#ffffff' />}
            iconBg="bg-gray-800"
            onClick={() => handleEdit('weight')}
            isEditing={editingField === 'weight'}
            inputElement={
              editingField === 'weight' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Weight"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="p-2 border rounded bg-background w-24 text-sm"
                  />
                  <span className="text-sm text-gray-600">{profile?.weight_unit || 'lbs'}</span>
                  <Button size="sm" onClick={() => saveMetric()}>Save</Button>
                </div>
              )
            }
          />
  
          <StatCard
            title="Water"
            value={
              metrics.water
                ? `${metrics.water} ${profile?.water_unit || 'oz'}`
                : '—'
            }
            icon={<Flame size={24} color='#ffffff' />}
            iconBg="bg-blue-500"
            onClick={() => handleEdit('water')}
            isEditing={editingField === 'water'}
            inputElement={
              editingField === 'water' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Water"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="p-2 border rounded bg-background w-24 text-sm"
                  />
                  <span className="text-sm text-gray-600">{profile?.water_unit || 'oz'}</span>
                  <Button size="sm" onClick={() => saveMetric()}>Save</Button>
                </div>
              )
            }
          />
  
          <StatCard
            title="Mood"
            value={metrics.mood || '—'}
            icon={<span className="text-xl">{metrics.mood || '🙂'}</span>}
            iconBg="bg-yellow-400"
            onClick={() => handleEdit('mood')}
            isEditing={editingField === 'mood'}
            inputElement={
              editingField === 'mood' && (
                <div className="flex gap-2 text-2xl">
                  {['😐', '🙂', '😄', '😤', '🥱'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setInputValue(emoji);
                        saveMetric(emoji);
                      }}
                      className={`p-1 rounded ${inputValue === emoji ? 'ring-2 ring-primary' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )
            }
          />
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GoalDonut 
            label="Calories Today" 
            value={Math.round(caloriesToday)} 
            total={profile?.calorie_goal ?? 2000}
            color="#e74c3c" 
          />
          <MacroDonut data={macrosToday} totals={
            { 
              protein: profile?.macro_goal_protein, 
              carbs: profile?.macro_goal_carbs, 
              fats: profile?.macro_goal_fats
            }
            }/>
          <ProgressCalendar 
            history={nutritionHistory} 
            dailyGoal={2000}
          />
          <WorkoutOverview />
  
          {/* Water & Weight Trends */}
          <div className="sm:col-span-1 lg:col-span-2 bg-surface p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-textPrimary mb-4">📈 Water & Weight Trends (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#6366f1" name="Weight" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="water" stroke="#38bdf8" name="Water" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    );
}
