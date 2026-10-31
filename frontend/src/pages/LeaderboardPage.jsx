import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trophy, Medal, Award, Flame, User, Search } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await api.getLeaderboard();
      setLeaderboard(data || []);
    }
    loadData();
  }, []);

  const filtered = leaderboard.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.badge.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-amber-400 mx-auto" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300 mx-auto" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600 mx-auto" />;
    return <span className="font-mono font-bold text-slate-400">#{rank}</span>;
  };

  const getTierColor = (badge) => {
    if (badge.includes('Legendary')) return 'text-rose-400 font-extrabold';
    if (badge.includes('Grandmaster')) return 'text-rose-500 font-bold';
    if (badge.includes('Master')) return 'text-amber-400 font-semibold';
    if (badge.includes('Specialist')) return 'text-cyan-400 font-medium';
    return 'text-indigo-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="h-4 w-4" />
            <span>Global Hall of Fame</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Coder Leaderboard</h1>
          <p className="text-slate-400 text-xs">Ranked by Elo-style competitive rating based on contest performance</p>
        </div>

        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search coder or tier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaderboard.slice(0, 3).map((top, idx) => (
          <div 
            key={top.username}
            className={`bg-slate-900/90 border rounded-2xl p-5 relative overflow-hidden flex flex-col items-center text-center space-y-3 shadow-lg ${
              idx === 0 ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-800'
            }`}
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 p-0.5 shadow-lg">
              <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-lg">
                {idx + 1}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{top.username}</h3>
              <span className={`text-xs ${getTierColor(top.badge)}`}>{top.badge}</span>
            </div>
            <div className="flex items-center space-x-6 text-xs font-mono pt-2 border-t border-slate-800/80 w-full justify-center">
              <div>
                <span className="text-slate-500 text-[10px] block">Rating</span>
                <span className="font-bold text-emerald-400">{top.rating}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Solved</span>
                <span className="font-bold text-white">{top.solved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-6">Coder</th>
              <th className="py-3.5 px-6">Tier</th>
              <th className="py-3.5 px-4 text-center">Rating</th>
              <th className="py-3.5 px-4 text-center">Problems Solved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
            {filtered.map((user) => (
              <tr key={user.username} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 text-center">{getRankBadge(user.rank)}</td>
                <td className="py-3.5 px-6 font-semibold text-white flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </td>
                <td className="py-3.5 px-6">
                  <span className={getTierColor(user.badge)}>{user.badge}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                  {user.rating}
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  {user.solved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

