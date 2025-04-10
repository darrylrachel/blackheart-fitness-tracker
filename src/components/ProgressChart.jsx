import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { date: 'Apr 1', weight: 190 },
  { date: 'Apr 3', weight: 185 },
  { date: 'Apr 6', weight: 180 },
  { date: 'Apr 9', weight: 175 },
];

export default function ProgressChart({ data = mockData }) {
  return (
    <div className='bg-dark p-6 rounded-xl shadow-md'>
      <h2 className='text-lg font-bold mb-4 text-dark'>Weight Loss</h2>
      <ResponsiveContainer width='100%' height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
          <XAxis dataKey='data' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='weight'
            strok='#27ae60'
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}