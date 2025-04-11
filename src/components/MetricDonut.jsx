import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function MetricDonut({ label, value, total, color = '#6366f1'}) {
  const data = [
    { name: 'Complete', value: value },
    { name: 'Remaining', value: total - value },
  ];

  const percentage = Math.round((value / total) * 100);

  return (
    <div className='bg-surface p-6 rounded-xl shadow-md text-center space-y-2'>
      <h3 className='text-sm font-semibold text-textPrimary'>{label}</h3>
      <ResponsiveContainer width='100%' height={160}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            innerRadius={40}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={color} />
            <Cell fill='#e5e7eb' />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className='text-xs text-textSecondary'>
        {value} of {total} ({percentage}%)
      </div>
    </div>
  );
}