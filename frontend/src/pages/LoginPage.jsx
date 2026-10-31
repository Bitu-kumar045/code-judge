import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Terminal, LogIn, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(usernameOrEmail, password);
      if (data && data.accessToken) {
        login(data.accessToken, data.user);
        navigate('/problems');
      } else {
        setError('Invalid credentials. Please verify your login info.');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setUsernameOrEmail('admin');
      setPassword('admin123');
      api.login('admin', 'admin123').then(data => {
        login(data.accessToken, data.user);
        navigate('/problems');
      });
    } else {
      setUsernameOrEmail('coder');
      setPassword('password123');
      api.login('coder', 'password123').then(data => {
        login(data.accessToken, data.user);
        navigate('/problems');
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to CodeJudge</h2>
          <p className="text-xs text-slate-400">Access full problem set, submit solutions, and compete in rated contests</p>
        </div>

        {/* Quick Demo Fillers */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Instant Demo Sign-In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('coder')}
              className="py-1.5 px-3 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors text-center"
            >
              Coder (Standard)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-medium transition-colors text-center"
            >
              Admin (Full Access)
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Username or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin or coder"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
