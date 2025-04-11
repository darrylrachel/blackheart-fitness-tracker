export default function ProgramPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-textPrimary">Current Program</h1>
      <p className="text-textSecondary text-sm">
        You're currently following the <strong>Push/Pull/Legs</strong> program
      </p>
      {/* Add exercises by day, progress, etc. here */}
    </div>
  )
}