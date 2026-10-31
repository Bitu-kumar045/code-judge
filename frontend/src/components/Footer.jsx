import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Database, Server, Cpu, BookOpen, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#0B0F19] text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200">CodeJudge Platform</span>
              <span className="text-slate-500 ml-2">• Full-Stack Competitive Programming Engine v2.0</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <Link to="/problems" className="hover:text-white transition-colors">Problems</Link>
            <Link to="/contests" className="hover:text-white transition-colors">Contests</Link>
            <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link to="/learn" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learning Hub</span>
            </Link>
          </div>
        </div>

        {/* System Architecture Health Indicators */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            Crafted for developers preparing for high-concurrency systems & algorithm battles.
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1.5">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <span>PostgreSQL:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Server className="h-3.5 w-3.5 text-emerald-400" />
              <span>Redis Queue:</span>
              <span className="text-emerald-400 font-semibold">Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sandbox:</span>
              <span className="text-cyan-400 font-semibold">Docker cgroups</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
