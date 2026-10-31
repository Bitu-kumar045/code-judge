import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ContestsPage from './pages/ContestsPage';
import ContestArenaPage from './pages/ContestArenaPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LearningHubPage from './pages/LearningHubPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProblemPage from './pages/AdminProblemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

// Hardened Admin Route Guard (RBAC Protection)
function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-[#111827] border border-rose-500/30 rounded-2xl text-center space-y-4 shadow-xl">
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
                <Navbar />
                <main className="flex-1 flex flex-col">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/problems" element={<ProblemListPage />} />
                    <Route path="/problems/:slug" element={<ProblemDetailPage />} />
                    <Route path="/submissions" element={<SubmissionsPage />} />
                    <Route path="/contests" element={<ContestsPage />} />
                    <Route path="/contests/:id" element={<ContestArenaPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/learn" element={<LearningHubPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    <Route path="/admin/problems/new" element={<AdminRoute><AdminProblemPage /></AdminRoute>} />
                    <Route path="/admin/problems/:id/edit" element={<AdminRoute><AdminProblemPage /></AdminRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
