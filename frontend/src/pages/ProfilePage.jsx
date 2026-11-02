import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSolvedState } from '../utils/solvedManager';
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
  Check, 
  Copy, 
  Share2, 
  ExternalLink,
  Target
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
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function ProfilePage() {
  const { user } = useAuth();
  const { solvedCount, easySolved: realEasy, mediumSolved: realMed, hardSolved: realHard } = useSolvedState();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const toast = useToast();

  const effectiveSolved = solvedCount || 0;

  const currentUser = {
    username: user?.username || 'coder',
    email: user?.email || 'coder@codejudge.dev',
    role: user?.role || 'ROLE_USER',
    rating: user?.rating || 1500,
    solvedCount: effectiveSolved,
    streak: effectiveSolved > 0 ? 3 : 0,
    college: 'Indian Institute of Technology',
    branch: 'Computer Science & Engineering'
  };

  // Rating History for Recharts AreaChart
  const ratingData = [
    { contest: 'R1', rating: 1500 },
    { contest: 'R2', rating: 1520 },
    { contest: 'R3', rating: 1540 },
    { contest: 'R4', rating: 1580 },
    { contest: 'R5', rating: 1620 },
  ];

  // Solved by Difficulty Breakdown from real solved state
  const easySolved = realEasy || 0;
  const medSolved = realMed || 0;
  const hardSolved = realHard || 0;

  const difficultyData = [
    { name: 'Easy', value: easySolved, color: '#10B981', total: 596 },
    { name: 'Moderate', value: medSolved, color: '#F59E0B', total: 894 },
    { name: 'Difficult', value: hardSolved, color: '#EF4444', total: 510 },
  ];

  // Topic Strength Radar Data
  const topicStrengthData = [
    { subject: 'Arrays', strength: 92, fullMark: 100 },
    { subject: 'Strings', strength: 85, fullMark: 100 },
    { subject: 'DP', strength: 74, fullMark: 100 },
    { subject: 'Trees', strength: 82, fullMark: 100 },
    { subject: 'Graphs', strength: 68, fullMark: 100 },
    { subject: 'Math', strength: 88, fullMark: 100 },
  ];

  // 52-week activity heatmap
  const generateHeatmap = () => {
    const weeks = [];
    const today = new Date();
    for (let w = 51; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
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

  const handleCopyProfileUrl = () => {
    const url = `${window.location.origin}/u/${currentUser.username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success(`Public resume portfolio URL copied: ${url}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Badges data
  const badges = [
    { id: 'docker-pioneer', name: 'Docker Pioneer', desc: 'Executed code inside a hardened container with 0 network leaks', icon: ShieldCheck, color: 'from-blue-500 to-cyan-500', unlocked: true, date: 'Earned 3 days ago' },
    { id: 'speed-demon', name: 'Speed Demon', desc: 'Achieved an execution runtime below 15ms in C++', icon: Zap, color: 'from-amber-400 to-orange-500', unlocked: true, date: 'Earned 1 week ago' },
    { id: 'streak-master', name: '12-Day Streak', desc: 'Solved at least 1 problem consecutively for 12 days', icon: Flame, color: 'from-rose-500 to-amber-500', unlocked: true, date: 'Active Streak' },
    { id: 'algorithm-wizard', name: 'Algorithm Wizard', desc: 'Solved 20+ Dynamic Programming & Graph problems', icon: Sparkles, color: 'from-purple-500 to-indigo-500', unlocked: true, date: 'Earned 2 weeks ago' },
    { id: 'icpc-finalist', name: 'ICPC Arena Victor', desc: 'Finished in the top 5% of a live ranked contest', icon: Award, color: 'from-yellow-400 to-amber-600', unlocked: true, date: 'Earned in Round 7' },
    { id: 'centurion', name: 'Centurion', desc: 'Reach 100 Accepted submissions on the platform', icon: Star, color: 'from-emerald-400 to-teal-500', unlocked: false, date: '47 / 100 Solved' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Profile Overview Card & Public Vanity Link */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
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
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400">{currentUser.college || 'IIT Delhi'} ({currentUser.branch || 'CSE'})</span>
              </p>
            </div>
          </div>

          {/* Vanity Resume Share Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyProfileUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-mono font-medium transition-all shadow-sm"
              title="Copy shareable link for resume / portfolio"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
              <span>codejudge.dev/u/{currentUser.username}</span>
            </button>

            <button
              onClick={() => toast.success('Profile Card snapshot generated! Ready to share on LinkedIn/Twitter.')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </button>
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
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.rating}</div>
          <div className="text-xs text-slate-400">
            Tier: <strong className="text-indigo-400 font-bold">Expert (Top 8%)</strong>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Problems Solved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.solvedCount}</div>
          <div className="text-xs text-slate-400">
            Acceptance Rate: <strong className="text-emerald-400 font-semibold">78.5%</strong>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Current Streak</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.streak} Days</div>
          <div className="text-xs text-slate-400">
            Streak Freeze active: <strong className="text-emerald-400">Protected</strong>
          </div>
        </div>
      </div>

      {/* Activity Heatmap (GitHub/LeetCode Style) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Submission Activity Heatmap
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-slate-800" />
            <span className="w-3 h-3 rounded-sm bg-emerald-950" />
            <span className="w-3 h-3 rounded-sm bg-emerald-700" />
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

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
      </div>

      {/* Three Column Analytics: Rating Graph, Topic Strength Radar, Difficulty Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rating Progression Graph */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Rating Trajectory
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+130 pts</span>
          </div>

          <div className="h-56 w-full pt-2">
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
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="rating" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#ratingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Strength Radar Chart */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Topic Strength Radar
            </h2>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicStrengthData}>
                <PolarGrid stroke="#1F2937" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" tick={false} />
                <Radar name="Strength" dataKey="strength" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Solved by Difficulty */}
        <div className="lg:col-span-3 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Solved Split
            </h2>
          </div>

          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value">
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-mono border-t border-slate-800 pt-2">
            <div className="text-emerald-400">24 Easy</div>
            <div className="text-amber-400">18 Med</div>
            <div className="text-rose-400">5 Hard</div>
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
          <span className="text-xs text-slate-400 font-mono">5 of 6 Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.unlocked ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-950/40 border-slate-800/50 opacity-60'
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
                    <div className="text-[10px] text-indigo-400 font-mono pt-1">{badge.date}</div>
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
