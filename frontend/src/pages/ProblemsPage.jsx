import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request, MOCK_PROBLEMS } from '../services/api';
import { Search, Flame, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function ProblemsPage() {
  const [problems, setProblems] = useState(MOCK_PROBLEMS);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');

  useEffect(() => {
    request('/problems')
      .then(res => {
        if (res?.data?.content && res.data.content.length > 0) {
          // Merge API results with mock rich data
          const apiProblems = res.data.content.map((p, idx) => ({
            id: p.id,
            slug: p.slug,
            title: `${idx + 1}. ${p.title}`,
            difficulty: p.difficulty,
            tags: Array.from(p.tags || ['General']),
            acceptanceRate: '50.0%',
            isSolved: idx === 0,
          }));
          setProblems(apiProblems);
        }
      })
      .catch(() => {
        // Use default mock problems
      });
  }, []);

  const allTags = ['ALL', 'Array', 'Hash Table', 'Math', 'String', 'Dynamic Programming', 'Two Pointers'];

  const filtered = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficulty === 'ALL' || p.difficulty === difficulty;
    const matchesTag = selectedTag === 'ALL' || (p.tags && p.tags.includes(selectedTag));
    return matchesSearch && matchesDiff && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Daily Challenge Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-700/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Daily Challenge • Streak: 4 Days
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">Today's Problem: 1. Two Sum</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Solve today's featured problem to keep your streak alive and earn 10 rating bonus points!
          </p>
        </div>

        <Link
          to="/problems/two-sum"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-md flex items-center gap-2"
        >
          <span>Solve Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems by title, keyword, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === diff
                    ? diff === 'EASY'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : diff === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : diff === 'HARD'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 whitespace-nowrap">Filter Tags:</span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all border ${
                selectedTag === tag
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 w-28">Difficulty</th>
                <th className="py-3.5 px-4 w-24">Acceptance</th>
                <th className="py-3.5 px-4 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((problem) => (
                <tr key={problem.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4 text-center">
                    {problem.isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline-block" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 inline-block" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {problem.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        problem.difficulty === 'EASY'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : problem.difficulty === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {problem.acceptanceRate || '48.2%'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-sm inline-block"
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No problems match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
