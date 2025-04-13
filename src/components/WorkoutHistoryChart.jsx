
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function WorkoutHistoryChart() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: history } = await supabase
        .from('user_workouts')
        .select('id, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const counts = {};
      history?.forEach(entry => {
        const day = new Date(entry.created_at).toISOString().split('T')[0];
        counts[day] = (counts[day] || 0) + 1;
      });

      const formatted = Object.entries(counts).map(([date, count]) => ({
        date,
        count,
      }));

      setHistoryData(formatted);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-400">Loading workout history...</div>;
  }

  return (
    <div className="bg-surface p-4 rounded-xl shadow">
      <h3 className="text-base font-semibold text-textPrimary mb-2">📅 Workout History (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={historyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
