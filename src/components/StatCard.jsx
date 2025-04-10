export default function StatCard({ title, value, icon, iconBg = 'bg-green' }) {
  return (
    // bg-white
    <div className="bg-surface rounded-xl shadow-md p-4 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-textSecondary">{title}</h4>
        <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBg} text-white`}>
        {icon}
      </div>
    </div>
  )
}