
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App';
import DashboardLayout from '../components/DashboardLayout';
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import WorkoutsPage from '../pages/WorkoutsPage';
import NutritionPage from '../pages/NutritionPage';
import WorkoutSummaryPage from '../pages/WorkoutSummaryPage';
import StartBlankWorkoutPage from '../pages/StartBlankWorkoutPage';

const ProtectedRoute = ({ children }) => {
  // Auth logic if needed
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
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
    children: [
      {
        index: true,
        element: <WorkoutsPage />,
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
    children: [
      {
        index: true,
        element: <NutritionPage />,
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
