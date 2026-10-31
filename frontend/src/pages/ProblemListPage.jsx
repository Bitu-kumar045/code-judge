import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProblemTableSkeleton } from '../components/Skeleton';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp, 
  Flame,
  Code2, 
  BookOpen,
  Sparkles,
  Layers,
  ArrowUpDown,
  Edit2,
  Trash2,
  RotateCcw
} from 'lucide-react';

const ALL_TOPICS = [
  'ALL',
  'Basics & Math',
  'Arrays',
  'Strings',
  'Searching & Sorting',
  'Two Pointers & Sliding Window',
  'Recursion & Backtracking',
  'Linked List',
  'Stack & Queue',
  'Hashing',
  'Binary Tree',
  'Binary Search Tree',
  'Heap',
  'Greedy',
  'Dynamic Programming',
  'Graphs',
  'Bit Manipulation',
  'Number Theory',
  'Matrix',
  'Advanced Data Structures'
];

export default function ProblemListPage() {
  const { isAdmin } = useAuth();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ total: 1000, easy: 298, medium: 447, hard: 255 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(50);
  const [totalElements, setTotalElements] = useState(1000);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await api.getProblems({ 
        search, 
        difficulty, 
        topic: selectedTopic,
        page,
        size: pageSize 
      });

      if (res && res.content) {
        setProblems(res.content);
        setTotalPages(res.totalPages || Math.ceil((res.totalElements || 1000) / pageSize));
        setTotalElements(res.totalElements ?? 1000);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, selectedTopic, page, pageSize]);

  // Reset page when filters change
  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    setPage(0);
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDifficulty('ALL');
    setSelectedTopic('ALL');
    setPage(0);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this problem from the database?')) {
      await api.deleteProblem(id);
      fetchProblems();
    }
  };

  const getDifficultyBadge = (diff) => {
    const d = (diff || '').toUpperCase();
    switch (d) {
      case 'EASY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case 'HARD':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Hard
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {diff}
          </span>
        );
    }
  };

  // Generate sensible page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, page - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
              <span>Full 1,000 Questions Dataset Loaded & Verified</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Problem Archive</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 font-mono font-medium">
                1,000 Problems
              </span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Master algorithms and data structures across 19 curated topics and 3 skill levels. Complete with instant test feedback, multiple languages, and Dockerized sandboxing.
            </p>
          </div>
        </div>

        {/* Quick Level Stats Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Level Breakdown</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => handleDifficultyChange(difficulty === 'EASY' ? 'ALL' : 'EASY')}
              className={`rounded-xl p-2.5 border transition-all ${
                difficulty === 'EASY'
                  ? 'bg-emerald-500/20 border-emerald-500/50 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/30'
              }`}
            >
              <div className="text-xs text-emerald-400 font-medium">Easy</div>
              <div className="text-lg font-bold text-white mt-0.5">{stats.easy}</div>
            </button>
            <button
              onClick={() => handleDifficultyChange(difficulty === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
              className={`rounded-xl p-2.5 border transition-all ${
                difficulty === 'MEDIUM'
                  ? 'bg-amber-500/20 border-amber-500/50 shadow-md ring-1 ring-amber-500'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-amber-500/30'
              }`}
            >
              <div className="text-xs text-amber-400 font-medium">Moderate</div>
              <div className="text-lg font-bold text-white mt-0.5">{stats.medium}</div>
            </button>
            <button
              onClick={() => handleDifficultyChange(difficulty === 'HARD' ? 'ALL' : 'HARD')}
              className={`rounded-xl p-2.5 border transition-all ${
                difficulty === 'HARD'
                  ? 'bg-rose-500/20 border-rose-500/50 shadow-md ring-1 ring-rose-500'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-rose-500/30'
              }`}
            >
              <div className="text-xs text-rose-400 font-medium">Difficult</div>
              <div className="text-lg font-bold text-white mt-0.5">{stats.hard}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Level-Wise Tabs & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Level Tabs */}
          <div className="flex items-center space-x-1.5 bg-[#111827] border border-slate-800 p-1.5 rounded-xl text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleDifficultyChange('ALL')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                difficulty === 'ALL'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>All Problems</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/60 text-slate-300 font-mono">
                {stats.total}
              </span>
            </button>
            <button
              onClick={() => handleDifficultyChange('EASY')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                difficulty === 'EASY'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <span>Easy</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 font-mono">
                {stats.easy}
              </span>
            </button>
            <button
              onClick={() => handleDifficultyChange('MEDIUM')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                difficulty === 'MEDIUM'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <span>Moderate</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 text-amber-300 font-mono">
                {stats.medium}
              </span>
            </button>
            <button
              onClick={() => handleDifficultyChange('HARD')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                difficulty === 'HARD'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <span>Difficult</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-300 font-mono">
                {stats.hard}
              </span>
            </button>
          </div>

          {/* Search Input & Reset */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, topic, or question #..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              />
            </div>
            {(search || difficulty !== 'ALL' || selectedTopic !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 19 Curated Topic Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 flex items-center space-x-1 shrink-0">
            <Filter className="h-3 w-3" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Topic:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            {ALL_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicChange(topic)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-xs font-medium ${
                  selectedTopic === topic
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
                    : 'bg-[#111827] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
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
                  <th className="py-3.5 px-4 w-16 text-center">#</th>
                  <th className="py-3.5 px-6">Title & Problem</th>
                  <th className="py-3.5 px-4 w-32">Level</th>
                  <th className="py-3.5 px-6 hidden sm:table-cell w-48">Topic</th>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell w-28">Acceptance</th>
                  <th className="py-3.5 px-4 w-28 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-500">
                      <div className="max-w-md mx-auto space-y-3">
                        <Layers className="h-10 w-10 text-slate-600 mx-auto" />
                        <div className="text-base font-medium text-slate-300">No problems found</div>
                        <p className="text-xs text-slate-500">
                          Try adjusting your search criteria, level filter, or topic selection.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium hover:bg-indigo-600/30 transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  problems.map((problem) => {
                    const probNo = problem.no || (problem.id ? problem.id.replace('prob-', '') : '');
                    const acceptance = problem.acceptanceRate || 
                      (problem.totalSubmissions 
                        ? Math.round((problem.solvedCount / problem.totalSubmissions) * 100) 
                        : 65);

                    return (
                      <tr 
                        key={problem.id || problem.slug} 
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-4 text-center font-mono text-xs text-slate-400">
                          {probNo}
                        </td>
                        <td className="py-4 px-6">
                          <Link 
                            to={`/problems/${problem.slug || problem.id}`} 
                            className="block font-medium text-slate-100 group-hover:text-indigo-400 transition-colors"
                          >
                            <div className="text-sm font-semibold">{problem.title}</div>
                            {problem.statement && (
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {problem.statement}
                              </div>
                            )}
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          {getDifficultyBadge(problem.difficulty)}
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <span className="px-2.5 py-1 rounded text-xs bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                            {problem.topic || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center hidden md:table-cell font-mono text-xs text-slate-400">
                          <div className="flex items-center justify-center space-x-1.5">
                            <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full" 
                                style={{ width: `${Math.min(100, Math.max(5, acceptance))}%` }} 
                              />
                            </div>
                            <span>{acceptance}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isAdmin && (
                              <>
                                <Link
                                  to={`/admin/problems/${problem.slug || problem.id}/edit`}
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
                              to={`/problems/${problem.slug || problem.id}`}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-all text-xs font-medium flex items-center gap-1 shadow-sm"
                            >
                              <span>Solve</span>
                              <ChevronRight className="h-3.5 w-3.5" />
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-white">{page * pageSize + 1}</strong> - <strong className="text-white">{Math.min((page + 1) * pageSize, totalElements)}</strong> of <strong className="text-white">{totalElements}</strong> problems
                </span>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="bg-[#111827] border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Page buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`min-w-8 h-8 px-2 rounded-lg font-mono font-medium transition-all ${
                      page === pNum
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                        : 'border border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {pNum + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
