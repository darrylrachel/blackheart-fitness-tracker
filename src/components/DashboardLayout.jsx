import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-white text-dark'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className='flex-1 flex flex-col'>
        <Topbar />

        <main className='flex-1 p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}