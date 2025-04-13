
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { startOfWeek, format } from 'date-fns';

export default function WorkoutsPerWeekChart() {
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: history } = await supabase
        .from('user_workouts')
        .select('id, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()); // last 60 days

      const weeks = {};

      history?.forEach(entry => {
        const week = format(startOfWeek(new Date(entry.created_at)), 'yyyy-MM-dd');
        weeks[week] = (weeks[week] || 0) + 1;
      });

      const formatted = Object.entries(weeks)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([week, count]) => ({
          week,
          count,
        }));

      setWeekData(formatted);
      setLoading(false);
    };

    fetchWeeklyData();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-400">Loading weekly workout stats...</div>;
  }

  return (
    <div className="bg-surface p-4 rounded-xl shadow">
      <h3 className="text-base font-semibold text-textPrimary mb-2">📆 Workouts Per Week</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={weekData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            tickFormatter={(str) => format(new Date(str), 'MMM d')}
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
