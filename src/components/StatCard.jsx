export default function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-primary',
  onClick,
  isEditing = false,
  inputElement = null,
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 bg-surface rounded-xl shadow-md hover:ring-2 hover:ring-accent transition space-y-2"
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="text-sm text-textSecondary font-medium">{title}</div>
      
      {isEditing ? (
        inputElement
      ) : (
        <div className="text-lg font-bold text-textPrimary">{value}</div>
      )}
    </div>
  );
}
