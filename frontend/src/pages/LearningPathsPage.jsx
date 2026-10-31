import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Play, 
  Award, 
  Sparkles, 
  Layers, 
  ChevronRight,
  BookOpen,
  Check
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PATHS = [
  {
    id: 'arrays-7-days',
    title: 'Arrays & Two-Pointers in 7 Days',
    subtitle: 'From zero to mastering linear scans, sliding windows, and in-place manipulations.',
    duration: '7 Days • 14 Problems',
    level: 'Beginner to Intermediate',
    color: 'from-blue-500 to-indigo-600',
    problems: [
      { id: 'p1', title: 'Two Sum', diff: 'EASY', slug: 'two-sum', done: true, videoUrl: 'https://youtube.com' },
      { id: 'p2', title: 'Best Time to Buy and Sell Stock', diff: 'EASY', slug: 'two-sum', done: true, videoUrl: 'https://youtube.com' },
      { id: 'p3', title: 'Contains Duplicate', diff: 'EASY', slug: 'two-sum', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p4', title: 'Product of Array Except Self', diff: 'MEDIUM', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p5', title: 'Maximum Subarray (Kadane)', diff: 'MEDIUM', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p6', title: '3Sum', diff: 'MEDIUM', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p7', title: 'Container With Most Water', diff: 'MEDIUM', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
    ]
  },
  {
    id: 'dp-roadmap',
    title: 'Dynamic Programming Mastery Roadmap',
    subtitle: 'Overcome the fear of DP: Fibonacci, 1D Knapsack, Longest Common Subsequence, and 2D Grids.',
    duration: '14 Days • 20 Problems',
    level: 'Intermediate to Advanced',
    color: 'from-purple-500 to-pink-600',
    problems: [
      { id: 'p8', title: 'Climbing Stairs', diff: 'EASY', slug: 'coin-change', done: true, videoUrl: 'https://youtube.com' },
      { id: 'p9', title: 'Coin Change', diff: 'MEDIUM', slug: 'coin-change', done: true, videoUrl: 'https://youtube.com' },
      { id: 'p10', title: 'Longest Increasing Subsequence', diff: 'MEDIUM', slug: 'coin-change', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p11', title: 'House Robber I & II', diff: 'MEDIUM', slug: 'coin-change', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p12', title: '0/1 Knapsack Problem', diff: 'MEDIUM', slug: 'coin-change', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p13', title: 'Edit Distance', diff: 'HARD', slug: 'coin-change', done: false, videoUrl: 'https://youtube.com' },
    ]
  },
  {
    id: 'placement-prep',
    title: '30-Day Placement Prep Bootcamp',
    subtitle: 'The high-yield technical interview checklist for Tier-1 companies (Amazon, Google, Microsoft).',
    duration: '30 Days • 50 Problems',
    level: 'Comprehensive',
    color: 'from-emerald-500 to-teal-600',
    problems: [
      { id: 'p14', title: 'LRU Cache Design', diff: 'MEDIUM', slug: 'two-sum', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p15', title: 'Merge k Sorted Lists', diff: 'HARD', slug: 'two-sum', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p16', title: 'Word Ladder (BFS)', diff: 'HARD', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
      { id: 'p17', title: 'Trapping Rain Water', diff: 'HARD', slug: 'longest-substring-without-repeating-characters', done: false, videoUrl: 'https://youtube.com' },
    ]
  }
];

export default function LearningPathsPage() {
  const [paths, setPaths] = useState(PATHS);
  const toast = useToast();

  const toggleProblemDone = (pathId, probId) => {
    setPaths(prev => prev.map(p => {
      if (p.id !== pathId) return p;
      return {
        ...p,
        problems: p.problems.map(prob => {
          if (prob.id === probId) {
            const nextDone = !prob.done;
            if (nextDone) toast.success(`Marked "${prob.title}" as solved!`, 'Roadmap Progress');
            return { ...prob, done: nextDone };
          }
          return prob;
        })
      };
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Hero Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Structured Competitive Curriculums</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Curated Algorithmic <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Roadmaps & Playlists
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Follow structured daily problem sequences designed to build pattern recognition. Each roadmap includes progressive hints, difficulty tags, and video editorial links.
          </p>
        </div>
      </div>

      {/* Roadmaps List */}
      <div className="space-y-8">
        {paths.map((path) => {
          const solved = path.problems.filter(p => p.done).length;
          const total = path.problems.length;
          const pct = Math.round((solved / total) * 100);

          return (
            <div
              key={path.id}
              className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
            >
              {/* Path Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 font-semibold">
                      {path.duration}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {path.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight pt-1">{path.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{path.subtitle}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full md:w-64 space-y-1.5 shrink-0">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-400 font-bold">{solved} / {total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${path.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>

              {/* Problem Sequence Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {path.problems.map((prob, idx) => (
                  <div
                    key={prob.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      prob.done
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleProblemDone(path.id, prob.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          prob.done
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950 hover:border-indigo-400'
                        }`}
                      >
                        {prob.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <a
                          href={`/problems/${prob.slug}`}
                          className={`text-xs font-semibold hover:text-indigo-400 transition-colors block truncate ${
                            prob.done ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {idx + 1}. {prob.title}
                        </a>
                        <span className={`text-[10px] font-bold ${
                          prob.diff === 'EASY' ? 'text-emerald-400' :
                          prob.diff === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {prob.diff}
                        </span>
                      </div>
                    </div>

                    <a
                      href={prob.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Watch Video Editorial"
                      className="p-1 rounded text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

