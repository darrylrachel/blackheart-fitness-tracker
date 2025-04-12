import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // protein, carbs, fats

export default function MacroDonut({ data, totals }) {
  const totalGoal = totals.protein + totals.carbs + totals.fats;
  const totalTracked = data.protein + data.carbs + data.fats;

  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fats', value: data.fats },
  ];

  return (
    <div className="bg-surface p-6 rounded-xl shadow-md text-center space-y-2">
      <h3 className="text-lg font-semibold text-textPrimary">Macros Tracked</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            dataKey="value"
            data={chartData}
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
            {/* Remaining section in gray */}
            <Cell fill="#e5e7eb" value={Math.max(totalGoal - totalTracked, 0)} />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></span>
          {Math.round(data.protein)}g Protein
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></span>
          {Math.round(data.carbs)}g Carbs
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span>
          {Math.round(data.fats)}g Fats
        </span>
      </div>

    </div>
  );
}
