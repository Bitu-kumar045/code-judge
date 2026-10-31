import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import ProblemListPage from './pages/ProblemListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ContestsPage from './pages/ContestsPage';
import ContestArenaPage from './pages/ContestArenaPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminProblemPage from './pages/AdminProblemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Hardened Admin Route Guard (RBAC Protection)
function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-rose-500/30 rounded-2xl text-center space-y-4 shadow-xl">
        <div className="text-rose-400 font-bold text-lg">403 Access Denied</div>
        <p className="text-slate-400 text-xs">You must have administrator privileges (ROLE_ADMIN) to access this studio.</p>
        <Link to="/problems" className="inline-block px-4 py-2 bg-slate-800 rounded-lg text-xs font-semibold text-white hover:bg-slate-700 transition-colors">
          Return to Problems
        </Link>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/problems" replace />} />
              <Route path="/problems" element={<ProblemListPage />} />
              <Route path="/problems/:slug" element={<ProblemDetailPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/contests" element={<ContestsPage />} />
              <Route path="/contests/:id" element={<ContestArenaPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin/problems/new" element={<AdminRoute><AdminProblemPage /></AdminRoute>} />
              <Route path="/admin/problems/:id/edit" element={<AdminRoute><AdminProblemPage /></AdminRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/problems" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
