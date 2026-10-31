import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Radio,
  RefreshCw,
  Flame,
  Award
} from 'lucide-react';

export default function ContestArenaPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [activeTab, setActiveTab] = useState('standings'); // Default to standings to showcase live updates
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 42, seconds: 18 });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [standings, setStandings] = useState([
    { rank: 1, username: 'tourist', score: 1000, penalty: 42, pA: '+1 (12m)', pB: '+1 (25m)', pC: '+2 (42m)', pD: '+1 (1h 05m)' },
    { rank: 2, username: 'benq', score: 950, penalty: 58, pA: '+1 (08m)', pB: '+2 (31m)', pC: '+1 (58m)', pD: '-2' },
    { rank: 3, username: 'ecnerwala', score: 650, penalty: 48, pA: '+1 (09m)', pB: '+1 (24m)', pC: '+1 (48m)', pD: '-' },
    { rank: 4, username: 'radewoosh', score: 600, penalty: 55, pA: '+1 (14m)', pB: '+1 (32m)', pC: '-3', pD: '-' },
    { rank: 5, username: 'alex_coder', score: 350, penalty: 22, pA: '+1 (22m)', pB: '-1', pC: '-', pD: '-' },
    { rank: 6, username: 'neal_wu', score: 300, penalty: 30, pA: '+1 (30m)', pB: '-', pC: '-', pD: '-' },
    { rank: 7, username: 'petr', score: 150, penalty: 18, pA: '+2 (18m)', pB: '-', pC: '-', pD: '-' },
  ]);

  useEffect(() => {
    async function loadContest() {
      const data = await api.getContest(id);
      setContest(data || SAMPLE_CONTESTS[0]);
    }
    loadContest();

    // 1-second countdown tick
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [id]);

  // Live leaderboard that updates by itself every 6 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const liveInterval = setInterval(() => {
      setStandings(prev => {
        const next = [...prev];
        // Randomly simulate a competitor solving or attempting a problem
        const targetIdx = Math.floor(Math.random() * (next.length - 2)) + 1;
        const target = { ...next[targetIdx] };
        
        if (target.pC === '-' || target.pC.startsWith('-')) {
          target.pC = '+1 (' + Math.floor(Math.random() * 30 + 40) + 'm)';
          target.score += 300;
          target.penalty += 15;
        } else if (target.pD === '-' || target.pD.startsWith('-')) {
          target.pD = '+1 (' + Math.floor(Math.random() * 20 + 70) + 'm)';
          target.score += 400;
          target.penalty += 25;
        }
        
        next[targetIdx] = target;
        // Re-sort by score desc, penalty asc
        next.sort((a, b) => b.score - a.score || a.penalty - b.penalty);
        return next.map((row, idx) => ({ ...row, rank: idx + 1 }));
      });

      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 6000);

    return () => clearInterval(liveInterval);
  }, [autoRefresh]);

  if (!contest) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Contest Header & Big Glowing Countdown Timer */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <Link to="/contests" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Contests Archive</span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{contest.title}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center space-x-1.5 shadow-sm">
                <Radio className="h-3.5 w-3.5 animate-pulse text-rose-400" />
                <span>LIVE ICPC ARENA</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              {contest.description} Standard ICPC 20-minute penalty rule applies for incorrect verdicts before acceptance.
            </p>
          </div>

          {/* BIG COUNTDOWN TIMER */}
          <div className="flex flex-col items-center sm:items-end w-full lg:w-auto">
            <span className="text-[11px] font-mono uppercase text-indigo-400 font-semibold tracking-widest mb-2 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-400 animate-spin" />
              Contest Ends In
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 flex items-center justify-center font-mono font-extrabold text-2xl sm:text-3xl text-indigo-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase mt-1">Hours</span>
              </div>

              <span className="text-2xl font-bold text-slate-600 -mt-4">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 flex items-center justify-center font-mono font-extrabold text-2xl sm:text-3xl text-indigo-300">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase mt-1">Minutes</span>
              </div>

              <span className="text-2xl font-bold text-slate-600 -mt-4">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-slate-950 border border-rose-500/40 shadow-lg shadow-rose-500/10 flex items-center justify-center font-mono font-extrabold text-2xl sm:text-3xl text-rose-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase mt-1">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Auto-Refresh Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'standings'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Live Standings & Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'problems'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Problems Archive (4)</span>
          </button>
        </div>

        {/* Live Auto-Refresh Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Auto-updating live</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-[11px]">Synced: {lastUpdated}</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
              autoRefresh 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoRefresh ? 'Live ON' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Standings View */}
      {activeTab === 'standings' ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-mono font-semibold text-white uppercase">ICPC Scoreboard Matrix</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Rankings updated automatically</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-6">Competitor</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Penalty</th>
                  <th className="py-3 px-4 text-center">A: Two Sum</th>
                  <th className="py-3 px-4 text-center">B: Longest Substring</th>
                  <th className="py-3 px-4 text-center">C: Trap Rainwater</th>
                  <th className="py-3 px-4 text-center">D: Word Ladder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {standings.map((row) => (
                  <tr key={row.username} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold">
                      {row.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">1</span>
                      ) : row.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 font-bold">2</span>
                      ) : row.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 font-bold">3</span>
                      ) : (
                        `#${row.rank}`
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-sans font-medium text-indigo-300">
                      {row.username}
                      {row.username === 'alex_coder' && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">You</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{row.score}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">{row.penalty}m</td>
                    
                    {/* Problem A */}
                    <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">{row.pA}</td>
                    
                    {/* Problem B */}
                    <td className={`py-3.5 px-4 text-center ${row.pB?.startsWith('+') ? 'text-emerald-400 font-semibold' : row.pB?.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}`}>
                      {row.pB}
                    </td>
                    
                    {/* Problem C */}
                    <td className={`py-3.5 px-4 text-center ${row.pC?.startsWith('+') ? 'text-emerald-400 font-semibold' : row.pC?.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}`}>
                      {row.pC}
                    </td>

                    {/* Problem D */}
                    <td className={`py-3.5 px-4 text-center ${row.pD?.startsWith('+') ? 'text-emerald-400 font-semibold' : row.pD?.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}`}>
                      {row.pD}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Problems View */
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
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
                const label = String.fromCharCode(65 + idx);
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        prob.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        prob.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
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
      )}
    </div>
  );
}
