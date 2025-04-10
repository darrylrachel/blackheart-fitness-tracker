export default function StatCard({ title, value, icon, iconBg = 'bg-green' }) {
  return (
    // bg-white
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-gray">{title}</h4>
        <p className="text-2xl font-bold text-dark mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBg} text-white`}>
        {icon}
      </div>
    </div>
  )
}