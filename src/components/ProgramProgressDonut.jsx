import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function ProgramProgressDonut({ name, currentDay, totalDays }) {
  const percentage = Math.round((currentDay / totalDays) * 100);
  const data = [
    { name: 'Complete', value: currentDay },
    { name: 'Remaining', value: totalDays - currentDay },
  ];

  return (
    <div className='bg-surface p-6 rounded-xl shadow-md text-center space-y-3'>
      <h3 className='text-sm font-semibold text-textPrimary'>{name}</h3>
      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            innerRadius={40}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
          >
            {/* #6366f1 */}
            <Cell fill='#bfa85d' /> 
            <Cell fill='#e5e7eb' />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className='text-sm text-textSecondary'>
        Day {currentDay} of {totalDays} ({percentage}%)
      </div>
    </div>
  );
}