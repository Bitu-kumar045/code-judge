import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2,
  Swords, 
  Eye, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight,
  Code2,
  RotateCcw,
  Target
} from 'lucide-react';
import CodeTypingHero from '../components/CodeTypingHero';

export default function LandingPage() {
  const [counts, setCounts] = useState({
    users: 28400,
    problems: 2000,
    duels: 89300,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        ...prev,
        duels: prev.duels + Math.floor(Math.random() * 2 + 1),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0B1020] text-slate-100 min-h-screen">
      
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#7C3AED]/20 via-[#34D399]/10 to-transparent blur-3xl pointer-events-none -z-10" />

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
              <span>AlgoArena: Play • Visualize • Win</span>
              <ChevronRight className="w-3 h-3 text-[#A78BFA]" />
            </div>

            {/* Big Hero Heading */}
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
              Don't just grind code. <br />
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#6366F1] to-[#34D399] bg-clip-text text-transparent">
                Play, Visualize, & Duel.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Step beyond boring problem tables. Explore RPG Quest Worlds, step through failed test cases with animated visual memory replays, and battle rivals live in real-time 1v1 code duels.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/quests"
                className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#34D399] hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
              >
                <Gamepad2 className="w-4 h-4 text-white" />
                <span>Enter Quest Map</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/duel"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-slate-200 hover:text-white bg-[#12182F] hover:bg-slate-800 border border-[#1E294B] hover:border-purple-500/40 transition-all duration-200 text-sm"
              >
                <Swords className="w-4 h-4 text-[#34D399]" />
                <span>1v1 Code Duel</span>
              </Link>

              <Link
                to="/problems"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-slate-400 hover:text-white transition-colors text-sm underline decoration-slate-700 underline-offset-4"
              >
                <span>Browse 2,000 Catalog →</span>
              </Link>
            </div>

            {/* Feature bullets */}
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Step-by-step Visual Memory Replay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Live 1v1 Elo Battles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Spaced Repetition Memory Forge</span>
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
      <section className="border-y border-[#1E294B] bg-[#12182F]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white font-mono">
                {counts.users.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Quest Champions</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#A78BFA] font-mono">
                {counts.problems.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Clean LeetCode Questions</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#34D399] font-mono">
                {counts.duels.toLocaleString()}+
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">1v1 Duels Fought</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-amber-400 font-mono">
                &lt; 12 ms
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Docker Sandbox Latency</p>
            </div>

          </div>
        </div>
      </section>

      {/* Signature Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-[#34D399]">
            Why AlgoArena Stands Apart
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white">
            Designed for Intuition, Thrill, & Mastery
          </h2>
          <p className="text-sm text-slate-400">
            LeetCode is just a spreadsheet of questions. AlgoArena is a complete battleground that makes DSA addictive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: RPG Quest Map */}
          <div className="bg-[#12182F] border border-[#1E294B] hover:border-[#7C3AED]/60 rounded-2xl p-6 space-y-4 shadow-xl transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-purple-600/20 text-[#A78BFA] border border-purple-500/30 flex items-center justify-center">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              RPG Skill Tree Quest Map
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Progress through 19 thematic algorithmic realms. Earn stars across Scout, Knight, and Boss stages. Unlock new worlds as your skills grow.
            </p>
            <Link to="/quests" className="text-xs font-semibold text-[#A78BFA] hover:text-white flex items-center space-x-1 pt-2">
              <span>Explore Quest Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 2: Visual Replay */}
          <div className="bg-[#12182F] border border-[#1E294B] hover:border-[#34D399]/60 rounded-2xl p-6 space-y-4 shadow-xl transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 flex items-center justify-center">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Step-by-Step Visual Replay
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Got a Wrong Answer? Don't stare at print logs. Watch your code execute step-by-step with animated array boxes, pointer movements, and variable inspectors.
            </p>
            <Link to="/problems/two-sum" className="text-xs font-semibold text-[#34D399] hover:text-white flex items-center space-x-1 pt-2">
              <span>Try on Two Sum</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3: 1v1 Code Duel */}
          <div className="bg-[#12182F] border border-[#1E294B] hover:border-amber-500/60 rounded-2xl p-6 space-y-4 shadow-xl transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Swords className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Live 1v1 Code Duels
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Queue up for real-time matches against friends or global players. Watch live testcase progress bars in high-stakes speed matches with Elo ratings.
            </p>
            <Link to="/duel" className="text-xs font-semibold text-amber-400 hover:text-white flex items-center space-x-1 pt-2">
              <span>Fight in the Arena</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
