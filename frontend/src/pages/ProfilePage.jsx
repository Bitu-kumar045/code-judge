import React, { useState } from 'react';
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
  Activity,
  Star,
  Sparkles,
  Lock,
  Check
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
  Cell,
  Legend
} from 'recharts';

export default function ProfilePage() {
  const { user } = useAuth();
  const [hoveredDay, setHoveredDay] = useState(null);

  const currentUser = user || {
    username: 'alex_coder',
    email: 'alex@codejudge.dev',
    role: 'ROLE_USER',
    rating: 1740,
    solvedCount: 47,
    streak: 12
  };

  // Mock Rating History for Recharts AreaChart
  const ratingData = [
    { contest: 'R1', rating: 1500 },
    { contest: 'R2', rating: 1540 },
    { contest: 'R3', rating: 1520 },
    { contest: 'R4', rating: 1610 },
    { contest: 'R5', rating: 1650 },
    { contest: 'R6', rating: 1705 },
    { contest: 'R7', rating: 1740 },
  ];

  // Solved by Difficulty Breakdown for PieChart
  const difficultyData = [
    { name: 'Easy', value: 24, color: '#10B981', total: 150 },
    { name: 'Medium', value: 18, color: '#F59E0B', total: 300 },
    { name: 'Hard', value: 5, color: '#EF4444', total: 100 },
  ];

  // Generate 52-week activity heatmap (simulated past 364 days)
  const generateHeatmap = () => {
    const weeks = [];
    const today = new Date();
    for (let w = 51; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        // Seeded pseudorandom activity
        const hash = (w * 7 + d) % 19;
        let count = 0;
        if (hash === 1 || hash === 4 || hash === 7 || hash === 11 || hash === 15) count = (hash % 4) + 1;
        else if (hash === 2 || hash === 8) count = 6;
        
        days.push({
          date: date.toISOString().split('T')[0],
          count,
        });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const heatmapWeeks = generateHeatmap();

  // Badges data
  const badges = [
    {
      id: 'docker-pioneer',
      name: 'Docker Pioneer',
      desc: 'Executed code inside a hardened container with 0 network leaks',
      icon: ShieldCheck,
      color: 'from-blue-500 to-cyan-500',
      unlocked: true,
      date: 'Earned 3 days ago'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      desc: 'Achieved an execution runtime below 15ms in C++',
      icon: Zap,
      color: 'from-amber-400 to-orange-500',
      unlocked: true,
      date: 'Earned 1 week ago'
    },
    {
      id: 'streak-master',
      name: '12-Day Streak',
      desc: 'Solved at least 1 problem consecutively for 12 days',
      icon: Flame,
      color: 'from-rose-500 to-amber-500',
      unlocked: true,
      date: 'Active Streak'
    },
    {
      id: 'algorithm-wizard',
      name: 'Algorithm Wizard',
      desc: 'Solved 20+ Dynamic Programming & Graph problems',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      unlocked: true,
      date: 'Earned 2 weeks ago'
    },
    {
      id: 'icpc-finalist',
      name: 'ICPC Arena Victor',
      desc: 'Finished in the top 5% of a live ranked contest',
      icon: Award,
      color: 'from-yellow-400 to-amber-600',
      unlocked: false,
      date: 'Rank 12 / 240 required'
    },
    {
      id: 'centurion',
      name: 'Centurion',
      desc: 'Reach 100 Accepted submissions on the platform',
      icon: Star,
      color: 'from-emerald-400 to-teal-500',
      unlocked: false,
      date: '47 / 100 Solved'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Profile Overview Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="h-full w-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center font-bold text-3xl text-white">
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

          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-mono">Streak</div>
              <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1 font-mono">
                <Flame className="w-4 h-4 fill-amber-400" />
                {currentUser.streak || 12}d
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-mono">Global Rank</div>
              <div className="text-xl font-bold text-indigo-400 font-mono">#1,420</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Contest Rating</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.rating || 1740}</div>
          <div className="text-xs text-slate-400">
            Tier: <strong className="text-indigo-400 font-bold">Expert (Top 8%)</strong>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Problems Solved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.solvedCount || 47}</div>
          <div className="text-xs text-slate-400">
            Acceptance Rate: <strong className="text-emerald-400 font-semibold">78.5%</strong>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Submissions Judged</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">68</div>
          <div className="text-xs text-slate-400">
            Fastest runtime: <strong className="text-white font-mono">8ms (C++)</strong>
          </div>
        </div>
      </div>

      {/* Activity Heatmap (GitHub/LeetCode Style) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Submission Activity (Past 12 Months)
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700/60" />
            <span className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-800" />
            <span className="w-3 h-3 rounded-sm bg-emerald-700" />
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[720px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => {
                  let bg = 'bg-slate-800/50 border border-slate-800';
                  if (day.count === 1) bg = 'bg-emerald-950 border border-emerald-800';
                  else if (day.count === 2) bg = 'bg-emerald-800';
                  else if (day.count >= 3 && day.count < 5) bg = 'bg-emerald-600';
                  else if (day.count >= 5) bg = 'bg-emerald-400';

                  return (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.date}: ${day.count} submissions`}
                      className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${bg}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono pt-1">
          {hoveredDay ? (
            <span>
              <strong>{hoveredDay.count}</strong> submission{hoveredDay.count !== 1 ? 's' : ''} on {hoveredDay.date}
            </span>
          ) : (
            <span>Hover over any cell to inspect daily submission count.</span>
          )}
        </div>
      </div>

      {/* Two Column Grid: Rating History & Solved By Difficulty (Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rating Progression Graph (AreaChart) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Contest Rating Trajectory
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+130 pts this month</span>
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

        {/* Solved Problems by Difficulty (PieChart) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Solved by Difficulty
            </h2>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-white">{currentUser.solvedCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Total Solved</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <div className="text-emerald-400 font-bold">Easy</div>
              <div className="text-slate-300 font-semibold mt-0.5">24 / 150</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20">
              <div className="text-amber-400 font-bold">Med</div>
              <div className="text-slate-300 font-semibold mt-0.5">18 / 300</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20">
              <div className="text-rose-400 font-bold">Hard</div>
              <div className="text-slate-300 font-semibold mt-0.5">5 / 100</div>
            </div>
          </div>
        </div>

      </div>

      {/* Badges & Achievements Showcase */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight uppercase font-mono">
              Earned Badges & Achievements
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {badges.filter(b => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40 group'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-xl p-0.5 shrink-0 bg-gradient-to-tr ${badge.color}`}>
                    <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center text-white">
                      {badge.unlocked ? <Icon className="w-5 h-5 text-indigo-300" /> : <Lock className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                      {badge.unlocked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{badge.desc}</p>
                    <div className="text-[10px] text-indigo-400 font-mono pt-1">
                      {badge.date}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
