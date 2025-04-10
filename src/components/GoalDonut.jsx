import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Flame, Footprints, Dumbbell} from 'lucide-react';
import { motion } from 'framer-motion';

const ICONS = {
  Calories: <Flame className='w-6 h-6' />,
  Steps: <Footprints className='w-6 h-6' />,
  'Workouts This Week': <Dumbbell className='w-6 h-6' />,
};

export default function GoalDonut({ label, value, total, color = '#27ae60' }) {
  const data = [
    { name: 'Completed', value },
    { name: 'Remaining', value: total - value },
  ];

  const percentage = Math.round((value / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0}}
      transition={{duration: 0.4}}
      whileHover={{ scale: 1.02 }}
    >
      <div className='bg-white p-6 rounded-xl shadow-md text-center space-y-2'>
        <div className='flex justify-center items-center gap-2 text-darkBlue font-semiBold text-lg'>
          {ICONS[label]} {label}
        </div>
        {/* <h3 className='text-dark font-bold text-lg'>{label}</h3> */}
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
        <p className='text-gray text-sm'>
          {value} of {total} ({percentage}%)
        </p>
      </div>
    </motion.div>
  )
}