import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, SAMPLE_CONTESTS } from '../services/api';
import { 
  Trophy, 
  Timer, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Radio
} from 'lucide-react';

export default function ContestArenaPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'standings'
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 14, seconds: 35 });

  useEffect(() => {
    async function loadContest() {
      const data = await api.getContest(id);
      setContest(data || SAMPLE_CONTESTS[0]);
    }
    loadContest();

    // Countdown tick
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  if (!contest) return null;

  const mockStandings = [
    { rank: 1, username: 'tourist', score: 1000, penalty: 42, pA: '+1 (12m)', pB: '+1 (25m)', pC: '+2 (42m)' },
    { rank: 2, username: 'benq', score: 950, penalty: 58, pA: '+1 (08m)', pB: '+2 (31m)', pC: '+1 (58m)' },
    { rank: 3, username: 'ecnerwala', score: 600, penalty: 24, pA: '+1 (09m)', pB: '+1 (24m)', pC: '-2' },
    { rank: 4, username: 'coder', score: 300, penalty: 18, pA: '+1 (18m)', pB: '-1', pC: '-' },
    { rank: 5, username: 'alex99', score: 100, penalty: 14, pA: '+1 (14m)', pB: '-', pC: '-' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Contest Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <Link to="/contests" className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Contests</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs">{contest.description}</p>
        </div>

        {/* Live Timer Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 flex items-center space-x-4 shadow-inner">
          <Timer className="h-6 w-6 text-rose-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Remaining Time</span>
            <span className="text-2xl font-mono font-bold text-white tracking-widest">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'problems'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Problems (4)
        </button>
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'standings'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Standings & Leaderboard
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'problems' ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Index</th>
                <th className="py-3 px-6">Problem Title</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
              {(contest.problems || []).map((prob, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 text-center font-mono font-bold text-indigo-400">{label}</td>
                    <td className="py-4 px-6 font-semibold text-white">
                      <Link to={`/problems/${prob.slug}`} className="hover:text-indigo-400 transition-colors">
                        {prob.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">{prob.points || (idx + 1) * 100} pts</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                      >
                        <span>Solve</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Penalty</th>
                <th className="py-3 px-4 text-center">Problem A</th>
                <th className="py-3 px-4 text-center">Problem B</th>
                <th className="py-3 px-4 text-center">Problem C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {mockStandings.map((row) => (
                <tr key={row.username} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-white">#{row.rank}</td>
                  <td className="py-3.5 px-6 font-sans font-medium text-indigo-300">{row.username}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{row.score}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{row.penalty}m</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">{row.pA}</td>
                  <td className={`py-3.5 px-4 text-center ${row.pB.startsWith('+') ? 'text-emerald-400 font-semibold' : 'text-rose-400'}`}>
                    {row.pB}
                  </td>
                  <td className={`py-3.5 px-4 text-center ${row.pC.startsWith('+') ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {row.pC}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

