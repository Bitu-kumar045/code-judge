import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
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
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[25%]" />
            <div className="bg-amber-500 h-full w-[50%]" />
            <div className="bg-rose-500 h-full w-[25%]" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems by title, keywords or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500 hidden sm:block" />
            <div className="inline-flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {diff.charAt(0) + diff.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] uppercase mr-1">Tags:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                selectedTag === tag
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <CircleDashed className="h-6 w-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    <span>Loading problem archive...</span>
                  </td>
                </tr>
              ) : problems.length === 0 ? (
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
                              className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400 border border-slate-700/60"
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
                                title="Edit Problem"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                title="Delete Problem"
                                onClick={(e) => handleDelete(e, problem.id || problem.slug)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/problems/${problem.slug}`}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors p-1"
                          >
                            <span>Solve</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
    </div>
  );
}

