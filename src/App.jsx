import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { UsersList } from './pages/Users/UsersList';
import { PhasesList } from './pages/Phases/PhasesList';
import { WorkoutsList } from './pages/Workouts/WorkoutsList';
import { ExercisesList } from './pages/Exercises/ExercisesList';
import { SessionsList } from './pages/Results/SessionsList';
import { Settings } from './pages/Settings/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="phases" element={<PhasesList />} />
        <Route path="workouts" element={<WorkoutsList />} />
        <Route path="exercises" element={<ExercisesList />} />
        <Route path="results" element={<SessionsList />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
