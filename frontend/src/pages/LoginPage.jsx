import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Terminal, LogIn, Lock, Mail, AlertCircle, Shield, User, CheckCircle2 } from 'lucide-react';

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
        setError('Invalid credentials. Please verify your username/email and password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGmailQuickFill = (gmailAddress) => {
    setUsernameOrEmail(gmailAddress);
    setPassword('');
    setError('');
  };

  const handleDemoCoder = () => {
    setUsernameOrEmail('coder');
    setPassword('password123');
    api.login('coder', 'password123').then(data => {
      login(data.accessToken, data.user);
      navigate('/problems');
    }).catch(err => {
      setError(err.message);
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to CodeJudge</h2>
          <p className="text-xs text-slate-400">
            Each Gmail account maintains its own isolated solved questions, submissions, and code notes.
          </p>
        </div>

        {/* Gmail Data Isolation Banner */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
            <svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335" />
              <path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z" fill="#4285F4" />
              <path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" fill="#FBBC05" />
              <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" fill="#34A853" />
            </svg>
            <span>Gmail Personal Workspace</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Sign in with your Gmail to save all your problem solutions, submissions, and code progress directly under your account.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleGmailQuickFill('layriceth@gmail.com')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-[11px] font-mono transition-colors"
            >
              <span>Quick fill: layriceth@gmail.com</span>
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
              <label className="text-xs font-medium text-slate-300">Gmail or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="yourname@gmail.com or admin"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {usernameOrEmail.toLowerCase() === 'admin' && (
                  <span className="text-[10px] text-amber-400 font-semibold flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Admin Master Password Required</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder={usernameOrEmail.toLowerCase() === 'admin' ? 'Enter admin master password' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Guest / Standard Demo */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Need standard testing?</span>
            <button
              type="button"
              onClick={handleDemoCoder}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign in as Demo Coder
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center space-y-1 text-xs text-slate-500">
          <div className="flex items-center justify-center space-x-1.5 text-slate-400">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>Admin privileges are strictly restricted to master credentials.</span>
          </div>
          <div>
            <span>Don't have an account? </span>
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
