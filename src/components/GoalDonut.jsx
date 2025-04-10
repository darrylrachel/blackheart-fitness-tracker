import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function GoalDonut({ label, value, total, color = '#27ae60' }) {
  const data = [
    { name: 'Completed', value },
    { name: 'Remaining', value: total - value },
  ];

  return (
    <div className='bg-white p-6 rounded-xl shadow-md text-center space-y-2'>
      <h3 className='text-darkBlue font-bold text-lg'>{label}</h3>
      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            outerRadius={60}
            innerRadius={40}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={color} />
            <Cell fill='#ecf0f1' />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <p className='text-slate text-sm'>
        {value}/{total}
      </p>
    </div>
  )
}