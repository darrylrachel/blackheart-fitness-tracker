import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StartBlankWorkoutPage from "../pages/StartBlankWorkoutPage";
import DashboardLayout from '../components/DashboardLayout';
import WorkoutReviewPage from '../pages/WorkoutReviewPage';
import ProtectedRoute from '../components/ProtectedRoute';
import StartWorkoutPage from '../pages/StartWorkoutPage';
import DashboardPage from '../pages/DashboardPage';
import NutritionPage from '../pages/NutritionPage';
import WorkoutsPage from '../pages/WorkoutsPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import ProgramPage from '../pages/ProgramPage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import ProgressPage from "../pages/ProgressPage";



const router = createBrowserRouter ([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workouts',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <WorkoutsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workouts/new',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <StartBlankWorkoutPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workouts/review',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <WorkoutReviewPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/nutrition',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <NutritionPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/progress',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ProgressPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/program',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ProgramPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ProfilePage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}