import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, SAMPLE_CONTESTS } from '../services/api';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  Timer, 
  Radio
} from 'lucide-react';

export default function ContestsPage() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    async function loadContests() {
      const data = await api.getContests();
      setContests(data || SAMPLE_CONTESTS);
    }
    loadContests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
            <Radio className="h-3 w-3" />
            <span>LIVE NOW</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Timer className="h-3 w-3" />
            <span>Upcoming</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
            Finished
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Trophy className="h-3.5 w-3.5" />
              <span>Rated Contests & Tournaments</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">CodeJudge Contests</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Compete against programmers worldwide, improve your global rating, and test your speed in timed 90-minute competitive rounds.
            </p>
          </div>
        </div>
      </div>

      {/* Contests Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <span>Active & Scheduled Contests</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const isLive = contest.status === 'LIVE';
            const isUpcoming = contest.status === 'UPCOMING';

            return (
              <div 
                key={contest.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:border-slate-700 shadow-lg ${
                  isLive ? 'border-rose-500/40 ring-1 ring-rose-500/20' : 'border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(contest.status)}
                    <span className="text-xs font-mono text-slate-500">
                      {contest.isRated ? '★ Rated' : 'Unrated'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{contest.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {contest.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{new Date(contest.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Duration: 2 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{contest.participantCount.toLocaleString()} Participants</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/contests/${contest.id}`}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md ${
                      isLive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : isUpcoming
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{isLive ? 'Enter Live Arena' : isUpcoming ? 'Register / View Details' : 'View Final Standings'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
