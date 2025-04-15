
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import WorkoutsPage from '../pages/WorkoutsPage';
import NutritionPage from '../pages/NutritionPage';
import CalculatorPage from '../pages/CalculatorPage';
import WorkoutHistoryPage from '../pages/WorkoutHistoryPage';
import JournalPage from '../pages/JournalPage';
import ProfilePage from '../pages/ProfilePage';
import CoachPage from '../pages/CoachPage';



import SignupPage from '../pages/SignupPage';
import DashboardLayout from '../components/DashboardLayout';
import WorkoutSummaryPage from '../pages/WorkoutSummaryPage';
import StartBlankWorkoutPage from '../pages/StartBlankWorkoutPage';
import CreateWorkoutProgramPage from '../pages/CreateWorkoutProgramPage';




const router = createBrowserRouter([
  
  {
    path: '/',
    element: <LoginPage />,
  },
  

  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/workouts',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <WorkoutsPage />,
        
      },
    ],
  },
  {
    path: '/calculator',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <CalculatorPage />,
        
      },
    ],
  },
  {
    path: '/nutrition',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <NutritionPage />,
        
      },
    ],
  },
  {
    path: '/workouts/history',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Workouts' },
    children: [
      {
        index: true,
        element: <WorkoutHistoryPage />,
        
      },
    ],
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <JournalPage />,
        
      },
    ],
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <CoachPage />,
        
      },
    ],
  },
  {
    path: '/workouts/create',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Workouts' },
    children: [
      {
        index: true,
        element: <CreateWorkoutProgramPage />,
        
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Dashboard' },
    children: [
      {
        index: true,
        element: <ProfilePage />,
        
      },
    ],
  },
  {
    path: '/workouts/summary',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Workouts' },
    children: [
      {
        index: true,
        element: <WorkoutSummaryPage />,
        
      },
    ],
  },
  {
    path: '/workouts/new',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { title: 'Workouts' },
    children: [
      {
        index: true,
        element: <StartBlankWorkoutPage />,
        
      },
    ],
  },
]);


export default function AppRouter() {
  return <RouterProvider router={router} />;
}
