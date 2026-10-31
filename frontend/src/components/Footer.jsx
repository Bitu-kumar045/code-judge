import React from 'react';
import { Terminal, Database, Server, Cpu, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <span>CodeJudge Platform • Full-Stack Competitive Programming Engine</span>
        </div>

        {/* System Architecture Health Indicators */}
        <div className="flex items-center space-x-6 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>PostgreSQL:</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Server className="h-3.5 w-3.5 text-rose-400" />
            <span>Redis Queue:</span>
            <span className="text-emerald-400 font-semibold">Ready</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Judge Sandbox:</span>
            <span className="text-cyan-400 font-semibold">Docker cgroups</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

