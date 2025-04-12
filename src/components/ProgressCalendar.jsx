import { format, subDays } from 'date-fns';

// dailyGoal needs to be based on calculted daily goal (dynamic)
export default function ProgressCalendar({ history, dailyGoal = 2200 }) {
  // Build a list of past 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = subDays(new Date(), 27 - i);
    const key = format(date, 'yyyy-MM-dd');
    const calories = history?.[key] || 0;

    let status = 'none';
    const percent = (calories / dailyGoal) * 100;
    if (percent >= 100) status = 'full';
    else if (percent >= 50) status = 'partial';

    return {
      date: key,
      short: format(date, 'd'),
      status,
      calories: Math.round(calories)
    };
  });

  return (
    <div className="bg-surface p-6 rounded-xl shadow-md space-y-3">
      <h3 className="text-lg font-semibold text-textPrimary">📅 Last 28 Days</h3>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all
              ${day.status === 'full' ? 'bg-green-500 text-white' :
                day.status === 'partial' ? 'bg-yellow-400 text-white' :
                'bg-gray-300 text-gray-500'}
            `}
            title={`${day.date} — ${day.calories} cal`}
          >
            {day.short}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-xs text-textSecondary mt-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Goal Met
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span> Partial
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300 rounded-full inline-block"></span> Not Tracked
        </div>
      </div>
    </div>
  );
}
