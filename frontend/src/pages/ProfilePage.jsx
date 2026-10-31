import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Award, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Code2,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  const currentUser = user || {
    username: 'coder',
    email: 'coder@example.com',
    role: 'ROLE_USER',
    rating: 1620,
    solvedCount: 47
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-1 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-3xl text-indigo-300">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">{currentUser.username}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Contest Rating</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{currentUser.rating || 1500}</div>
          <div className="text-xs text-slate-400">
            Tier: <strong className="text-indigo-400">Specialist (Top 12%)</strong>
          </div>
        </div>

        {/* Total Solved Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Problems Solved</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{currentUser.solvedCount || 47}</div>
          <div className="text-xs text-slate-400">
            Acceptance Rate: <strong className="text-emerald-400">76.4%</strong>
          </div>
        </div>

        {/* Global Rank Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Global Standing</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">#1,420</div>
          <div className="text-xs text-slate-400">
            Among 45,000+ active coders
          </div>
        </div>
      </div>

      {/* Solved Progress Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Code2 className="h-5 w-5 text-indigo-400" />
          <span>Difficulty Distribution</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-400">Easy (24 solved)</span>
              <span className="text-slate-400 font-mono">24 / 150</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-amber-400">Medium (18 solved)</span>
              <span className="text-slate-400 font-mono">18 / 300</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-rose-400">Hard (5 solved)</span>
              <span className="text-slate-400 font-mono">5 / 100</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
