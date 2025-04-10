import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import StartWorkoutPage from '../pages/StartWorkoutPage';
import DashboardPage from '../pages/DashboardPage';
import NutritionPage from '../pages/NutritionPage';
import WorkoutsPage from '../pages/WorkoutsPage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';



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
    path: '/workouts/start',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <StartWorkoutPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}