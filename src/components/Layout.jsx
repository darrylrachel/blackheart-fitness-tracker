export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark text-light font-sans">
      <div className="max-w-4xl mx-auto px4 py-8">
        {children}
      </div>
    </div>
  );
}