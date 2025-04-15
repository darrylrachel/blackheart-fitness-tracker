export default function DashboardPage() {

  const [caloriesToday, setCaloriesToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [macrosToday, setMacrosToday] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [metrics, setMetrics] = useState({ weight: null, water: null, mood: null });
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [profile, setProfile] = useState(null);
  const [trendHistory, setTrendHistory] = useState([]);

  


  const today = getLocalDate();

  useEffect(() => {
    const fetchProfileAndData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profileData) return;
      setProfile(profileData);

      // Fetch daily metrics
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
          mood: metricsData.mood,
        });
      }

      const { data: metricHistory } = await supabase
      .from('daily_metrics')
      .select('date, weight, water')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());


      function getLocalDate(date) {
        const local = new Date(date);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toISOString().split('T')[0];
      }

      const trends = metricHistory?.reduce((acc, entry) => {
        const dateKey = getLocalDate(entry.date);
        acc[dateKey] = {
          date: dateKey, // include formatted date in object for chart
          weight: entry.weight ?? null,
          water: entry.water ?? null,
        };
        return acc;
      }, {}) ?? {};

      setTrendHistory(Object.values(trends)); // convert object to array for chart

      // Fetch calories + macros
      const { data: meals } = await supabase
        .from('nutrition_logs')
        .select('calories, protein, carbs, fats, quantity')
        .eq('user_id', user.id)
        .eq('date', today);

      const totals = meals?.reduce(
        (acc, item) => {
          const qty = parseFloat(item.quantity) || 1;
          acc.calories += (item.calories || 0) * qty;
          acc.protein += (item.protein || 0) * qty;
          acc.carbs += (item.carbs || 0) * qty;
          acc.fats += (item.fats || 0) * qty;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      setCaloriesToday(Math.round(totals.calories));
      setMacrosToday({
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fats: Math.round(totals.fats),
      });

      // Fetch 30-day nutrition history
      const { data: history } = await supabase
        .from('nutrition_logs')
        .select('date, calories, quantity')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      function getLocalDate(date) {
        const local = new Date(date);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toISOString().split("T")[0];
      }

      const grouped = {};
      history?.forEach((entry) => {
        const dateKey = getLocalDate(entry.date);
        const qty = parseFloat(entry.quantity) || 1;
        const cals = (entry.calories || 0) * qty;
        if (!grouped[dateKey]) grouped[dateKey] = 0;
        grouped[dateKey] += cals;
      });

      setNutritionHistory(grouped);
    };

    fetchProfileAndData();
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
    setInputValue(metrics[field] || '');
  };

  const saveMetric = async (value = inputValue) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

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
    } else {
      console.error('Error saving metric', error);
    }
  };

  if (!profile) {
    return <div className="text-sm text-textSecondary p-4">Loading dashboard...</div>;
  }


  return (
    <div className="space-y-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Weight"
          value={
            profile?.current_weight
              ? `${profile.current_weight} ${profile?.weight_unit || 'lbs'}`
              : '—'
          }
          icon={<Dumbbell size={24} color='#ffffff'  />}
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
        <MacroDonut
          data={macrosToday}
          totals={{
            protein: profile?.macro_goal_protein ?? 150,
            carbs: profile?.macro_goal_carbs ?? 200,
            fats: profile?.macro_goal_fats ?? 70,
          }}
        />
        <ProgressCalendar history={nutritionHistory} dailyGoal={profile?.calorie_goal ?? 2000} />
        </div> {/* close existing grid */}

        {/* Add WorkoutOverview separately */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded shadow space-y-2">
            <WorkoutOverview />
          </div>

          <div className="bg-surface p-4 rounded shadow space-y-4">
            <h3 className="text-base font-semibold text-textPrimary">📉 Weight Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => format(parseISO(str), "MMM d")}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <YAxis
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  width={40}
                />
                <Tooltip
                  labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  formatter={(value) => [`${value} ${profile?.weight_unit ?? 'lbs'}`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  dot={false}
                  name="Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
  );
}