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
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function ProfilePage() {
  const { user } = useAuth();

  const currentUser = user || {
    username: 'coder',
    email: 'coder@example.com',
    role: 'ROLE_USER',
    rating: 1620,
    solvedCount: 47
  };

  // Mock Rating History for Recharts AreaChart
  const ratingData = [
    { contest: 'R1', rating: 1500 },
    { contest: 'R2', rating: 1530 },
    { contest: 'R3', rating: 1515 },
    { contest: 'R4', rating: 1560 },
    { contest: 'R5', rating: 1545 },
    { contest: 'R6', rating: 1590 },
    { contest: 'R7', rating: 1620 },
  ];

  // Verdict Breakdown for Recharts PieChart
  const verdictData = [
    { name: 'Accepted', value: 47, color: '#10B981' },       // Green
    { name: 'Wrong Answer', value: 12, color: '#EF4444' },   // Red
    { name: 'Time Limit', value: 6, color: '#F59E0B' },      // Yellow
    { name: 'Runtime Error', value: 3, color: '#F97316' },   // Orange
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gradient opacity-10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
          <div className="h-20 w-20 rounded-2xl bg-brand-gradient p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="h-full w-full bg-darkBg rounded-[14px] flex items-center justify-center font-bold text-3xl text-white">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{currentUser.username}</h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 font-mono">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Card */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Contest Rating</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.rating || 1500}</div>
          <div className="text-xs text-slate-400">
            Tier: <strong className="text-transparent bg-clip-text bg-brand-gradient font-bold">Specialist (Top 12%)</strong>
          </div>
        </div>

        {/* Total Solved Card */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Problems Solved</span>
            <CheckCircle2 className="h-4 w-4 text-verdict-ac" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.solvedCount || 47}</div>
          <div className="text-xs text-slate-400">
            Acceptance Rate: <strong className="text-verdict-ac font-semibold">76.4%</strong>
          </div>
        </div>

        {/* Global Rank Card */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Global Standing</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">#1,420</div>
          <div className="text-xs text-slate-400">
            Among 45,000+ active coders
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Progression Graph (AreaChart) */}
        <div className="lg:col-span-2 bg-cardBg border border-cardBorder rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Contest Rating Trajectory
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+120 pts this month</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingData}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="contest" stroke="#6B7280" tickLine={false} style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#6B7280" tickLine={false} style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '10px', fontSize: '12px' }}
                  itemStyle={{ color: '#A78BFA' }}
                />
                <Area type="monotone" dataKey="rating" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#ratingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verdict Distribution (PieChart) */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Verdicts Breakdown
            </h2>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {verdictData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-cardBorder">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-verdict-ac" />
              <span className="text-slate-300">Accepted: 47</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-verdict-wa" />
              <span className="text-slate-300">WA: 12</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-verdict-tle" />
              <span className="text-slate-300">TLE: 6</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-verdict-re" />
              <span className="text-slate-300">RE: 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Distribution Breakdown */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-mono uppercase tracking-wider">
          <Code2 className="h-4 w-4 text-purple-400" />
          <span>Difficulty Distribution</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-verdict-ac font-semibold">Easy (24 solved)</span>
              <span className="text-slate-400 font-mono">24 / 150</span>
            </div>
            <div className="w-full bg-darkBg h-2 rounded-full overflow-hidden border border-cardBorder">
              <div className="bg-verdict-ac h-full rounded-full transition-all duration-500" style={{ width: '40%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-verdict-tle font-semibold">Medium (18 solved)</span>
              <span className="text-slate-400 font-mono">18 / 300</span>
            </div>
            <div className="w-full bg-darkBg h-2 rounded-full overflow-hidden border border-cardBorder">
              <div className="bg-verdict-tle h-full rounded-full transition-all duration-500" style={{ width: '25%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-verdict-wa font-semibold">Hard (5 solved)</span>
              <span className="text-slate-400 font-mono">5 / 100</span>
            </div>
            <div className="w-full bg-darkBg h-2 rounded-full overflow-hidden border border-cardBorder">
              <div className="bg-verdict-wa h-full rounded-full transition-all duration-500" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
