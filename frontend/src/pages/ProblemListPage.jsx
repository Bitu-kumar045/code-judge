import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProblemTableSkeleton } from '../components/Skeleton';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  CircleDashed, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  Code2, 
  Flame,
  ArrowUpDown,
  Edit2,
  Trash2
} from 'lucide-react';

export default function ProblemListPage() {
  const { isAdmin } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const allTags = ['ALL', 'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Binary Search'];

  const fetchProblems = async () => {
    setLoading(true);
    const res = await api.getProblems({ search, difficulty, tag: selectedTag });
    if (res && res.content) {
      setProblems(res.content);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, selectedTag]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this problem from the database?')) {
      await api.deleteProblem(id);
      fetchProblems();
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'HARD':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      {/* Hero Header & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
              <Flame className="h-3.5 w-3.5 text-indigo-400" />
              <span>Sharpen your algorithms & data structures</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Problem Set Archive
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore algorithmic challenges curated for technical interview prep and competitive programming. Test solutions instantly against sandboxed Docker test runners.
            </p>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Platform Stats</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
              <div className="text-xs text-emerald-400 font-medium">Easy</div>
              <div className="text-lg font-bold text-white mt-0.5">1/1</div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
              <div className="text-xs text-amber-400 font-medium">Med</div>
              <div className="text-lg font-bold text-white mt-0.5">2/2</div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
              <div className="text-xs text-rose-400 font-medium">Hard</div>
              <div className="text-lg font-bold text-white mt-0.5">1/1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />
        </div>

        {/* Difficulty Pill Filter */}
        <div className="flex items-center space-x-1 bg-[#111827] border border-slate-800 p-1 rounded-xl text-xs">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                difficulty === diff
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter Row */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-slate-500 flex items-center space-x-1 shrink-0">
          <Filter className="h-3 w-3" />
          <span>Tags:</span>
        </span>
        <div className="flex items-center space-x-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                  : 'bg-[#111827] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table or Skeleton Loading */}
      {loading ? (
        <ProblemTableSkeleton />
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-4 w-32">Difficulty</th>
                  <th className="py-3.5 px-6 hidden sm:table-cell">Tags</th>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell w-32">Acceptance</th>
                  <th className="py-3.5 px-4 w-20 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No problems found matching your query.
                    </td>
                  </tr>
                ) : (
                  problems.map((problem, index) => {
                    const acceptance = problem.totalSubmissions 
                      ? Math.round((problem.solvedCount / problem.totalSubmissions) * 100) 
                      : 65;

                    return (
                      <tr 
                        key={problem.id || problem.slug} 
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-4 text-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400/80 mx-auto" />
                        </td>
                        <td className="py-4 px-6">
                          <Link 
                            to={`/problems/${problem.slug}`} 
                            className="font-medium text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center space-x-2"
                          >
                            <span>{index + 1}. {problem.title}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          {getDifficultyBadge(problem.difficulty)}
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <div className="flex flex-wrap gap-1.5">
                            {(problem.tags || []).map((t) => (
                              <span 
                                key={t}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-400 border border-slate-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center hidden md:table-cell font-mono text-xs text-slate-400">
                          {acceptance}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isAdmin && (
                              <>
                                <Link
                                  to={`/admin/problems/${problem.slug}/edit`}
                                  className="p-1 text-slate-400 hover:text-white transition-colors"
                                  title="Edit Problem"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Link>
                                <button
                                  onClick={(e) => handleDelete(e, problem.id)}
                                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                  title="Delete Problem"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            <Link 
                              to={`/problems/${problem.slug}`}
                              className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all ml-1"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
