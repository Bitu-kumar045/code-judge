import React, { useState } from 'react';
import { 
  Trophy, 
  GraduationCap, 
  Filter, 
  Search, 
  Medal, 
  Award, 
  Flame, 
  ChevronRight,
  TrendingUp,
  Building2
} from 'lucide-react';

const COLLEGE_LEADERBOARD_DATA = [
  { rank: 1, name: 'Aditya Sharma', handle: 'aditya_s', college: 'IIT Delhi', branch: 'CSE', gradYear: '2026', rating: 2420, solved: 340, streak: 45 },
  { rank: 2, name: 'Pooja Sundaram', handle: 'pooja_algo', college: 'BITS Pilani', branch: 'CSE', gradYear: '2026', rating: 2380, solved: 312, streak: 32 },
  { rank: 3, name: 'Rohan Deshmukh', handle: 'rohan_d', college: 'NIT Trichy', branch: 'IT', gradYear: '2025', rating: 2290, solved: 295, streak: 28 },
  { rank: 4, name: 'Neha Varma', handle: 'neha_v', college: 'IIT Bombay', branch: 'CSE', gradYear: '2027', rating: 2210, solved: 270, streak: 20 },
  { rank: 5, name: 'Siddharth Rao', handle: 'sid_rao', college: 'IIIT Hyderabad', branch: 'ECE', gradYear: '2026', rating: 2150, solved: 245, streak: 18 },
  { rank: 6, name: 'Kavya Nair', handle: 'kavya_n', college: 'IIT Delhi', branch: 'Mathematics & Computing', gradYear: '2026', rating: 2110, solved: 230, streak: 15 },
  { rank: 7, name: 'Aarav Patel', handle: 'aarav_p', college: 'BITS Pilani', branch: 'CSE', gradYear: '2025', rating: 2050, solved: 210, streak: 14 },
];

export default function CollegeLeaderboardPage() {
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [search, setSearch] = useState('');

  const colleges = ['ALL', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIT Bombay', 'IIIT Hyderabad'];
  const branches = ['ALL', 'CSE', 'IT', 'ECE', 'Mathematics & Computing'];

  const filtered = COLLEGE_LEADERBOARD_DATA.filter((row) => {
    if (selectedCollege !== 'ALL' && row.college !== selectedCollege) return false;
    if (selectedBranch !== 'ALL' && row.branch !== selectedBranch) return false;
    if (search && !row.name.toLowerCase().includes(search.toLowerCase()) && !row.handle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Collegiate Algorithm Rankings</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Inter-College & Branch <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Honor Roll & Standing
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Compare your standing against peers from top engineering universities across CSE, ECE, and IT departments.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* College & Branch Selectors */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="bg-[#111827] border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            {colleges.map(c => <option key={c} value={c}>College: {c}</option>)}
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#111827] border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            {branches.map(b => <option key={b} value={b}>Branch: {b}</option>)}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-6">Competitor</th>
                <th className="py-3 px-6">College / University</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-center">Batch</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Solved</th>
                <th className="py-3 px-4 text-center">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((row) => (
                <tr key={row.handle} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 text-center font-bold">
                    {row.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">1</span>
                    ) : row.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40">2</span>
                    ) : row.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40">3</span>
                    ) : (
                      `#${row.rank}`
                    )}
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <div className="font-bold text-white">{row.name}</div>
                    <div className="text-[11px] text-indigo-400 font-mono">@{row.handle}</div>
                  </td>
                  <td className="py-4 px-6 font-sans font-medium text-slate-200">{row.college}</td>
                  <td className="py-4 px-4 font-sans text-slate-400">{row.branch}</td>
                  <td className="py-4 px-4 text-center text-slate-400">{row.gradYear}</td>
                  <td className="py-4 px-4 text-center font-bold text-amber-400">{row.rating}</td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-400">{row.solved}</td>
                  <td className="py-4 px-4 text-center text-rose-400 flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{row.streak}d</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
