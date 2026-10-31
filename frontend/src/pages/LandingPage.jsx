import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Users,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import CodeTypingHero from '../components/CodeTypingHero';

export default function LandingPage() {
  // Live counters with initial values that count up
  const [counts, setCounts] = useState({
    users: 14280,
    problems: 320,
    submissions: 1489240
  });

  // Small live ticker simulation to make it feel real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        ...prev,
        submissions: prev.submissions + Math.floor(Math.random() * 3 + 1),
      }));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0B0F19] text-slate-100 min-h-screen">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Big Hero Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-8"
          >
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Hardened Docker Sandbox v2.0</span>
              <ChevronRight className="w-3 h-3 text-indigo-400" />
            </div>

            {/* Big Hero Heading */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Code at the speed of <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                pure algorithmic thought.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              The high-performance competitive programming platform built for engineers. 
              Zero-network Docker isolation, sub-millisecond evaluation, ICPC contests, and instant verdict telemetry.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/problems"
                className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contests"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-[#111827] hover:bg-slate-800 border border-slate-700/80 transition-all duration-200"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Join Arena</span>
              </Link>
            </div>

            {/* Feature bullets */}
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>C++, Python, Java & C</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strict 256MB Sandbox limits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero internet leakage</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Animated Typing-Code Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <CodeTypingHero />
          </motion.div>

        </div>
      </section>

      {/* Live Counters Banner */}
      <section className="border-y border-slate-800/80 bg-[#111827]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-mono">
                {counts.users.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Registered Coders</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent font-mono">
                {counts.problems.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Curated Problems</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                {counts.submissions.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Submissions Judged</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-mono">
                &lt; 14 ms
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Median Sandbox Latency</p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Engineered like Linear. Hardened like a Bank.
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to sharpen your algorithm skills, prepare for tier-1 interviews, and dominate ICPC contests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Docker Sandboxed</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every single line of untrusted code executes inside an ephemeral container with zero networking, strict memory cgroups (256MB), and PID limits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sub-Second Verdicts</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Powered by Redis asynchronous job queuing and worker pools. Experience instantaneous Accepted (AC), Wrong Answer (WA), and TLE feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ICPC Ranked Contests</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Live ticking countdowns, 20-minute penalty algorithms per failed attempt, real-time scoreboards, and badges to prove your algorithmic ranking.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Learning Hub Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-blue-950/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Free Developer Curriculum</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Best Websites to Learn the Judge Tech Stack
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Master Docker sandboxing, Spring Boot, React, Redis queues, and system design with curated guides from Baeldung, Amigoscode, Scrimba, ByteByteGo, and open-source judges like Judge0 & Piston.
            </p>
          </div>

          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/30 transition-all shrink-0"
          >
            <span>Explore Learning Hub</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Verdict Color Showcase */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 text-center space-y-6">
          <h3 className="text-xl font-bold text-white">Standardized Precision Verdicts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400">
              <div className="text-sm font-bold">Accepted</div>
              <div className="text-xs text-emerald-300/80 font-mono mt-1">AC • 10/10 Passed</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-400">
              <div className="text-sm font-bold">Wrong Answer</div>
              <div className="text-xs text-rose-300/80 font-mono mt-1">WA • Output Differs</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-400">
              <div className="text-sm font-bold">Time Limit</div>
              <div className="text-xs text-amber-300/80 font-mono mt-1">TLE • &gt; 1000ms</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/30 text-orange-400">
              <div className="text-sm font-bold">Runtime Error</div>
              <div className="text-xs text-orange-300/80 font-mono mt-1">RE • SIGSEGV / Exit != 0</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

