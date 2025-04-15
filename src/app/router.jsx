
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
import SelectExercisesPage from '../pages/SelectExercisesPage';
import WorkoutBuilderPage from '../pages/WorkoutBuilderPage';
import ViewWorkoutPage from '../pages/ViewWorkoutPage';
import UploadProgressPhotoPage from '../pages/UploadProgressPhotoPage';
import ProgressPage from '../pages/ProgressPage';
import EditProfilePage from '../pages/EditProfilePage';



import SignupPage from '../pages/SignupPage';
import DashboardLayout from '../components/DashboardLayout';
import WorkoutSummaryPage from '../pages/WorkoutSummaryPage';
import StartBlankWorkoutPage from '../pages/StartBlankWorkoutPage';
import CreateWorkoutProgramPage from '../pages/CreateWorkoutProgramPage';
import OneRepMaxPage from '../pages/OneRepMaxPage';
import SearchFoodPage from '../pages/SearchFoodPage';
import AddMealPage from '../pages/AddMealPage';




const router = createBrowserRouter([
  
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: 'https://blackheartlabs.com/'
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
    children: [
      {
        index: true,
        element: <WorkoutsPage />
      },
      {
        path: 'history',
        element: <WorkoutHistoryPage />
      },
      {
        path: ':id',
        element: <ViewWorkoutPage />
      },
      {
        path: 'select-exercises',
        element: <SelectExercisesPage />
      },
      {
        path: 'new',
        element: <WorkoutBuilderPage />
      }
    ]
  },
  {
    path: '/calculator',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CalculatorPage />,
      },
      {
        path: 'one-rep-max',
        element: <OneRepMaxPage />
      }
    ],
  },
  {
    path: '/progress',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProgressPage />,
      },
      {
        path: 'upload',
        element: <UploadProgressPhotoPage />
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
      {
        path: 'search',
        element: <SearchFoodPage />,
      },
      {
        path: 'add-meal',
        element: <AddMealPage />,
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
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
      {
        path: 'edit-profile',
        element: <EditProfilePage />,
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
  
]);


export default function AppRouter() {
  return <RouterProvider router={router} />;
}
