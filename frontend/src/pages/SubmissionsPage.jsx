import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileCode2, 
  X, 
  Copy, 
  Check,
  User,
  Filter,
  Search,
  RotateCcw,
  ExternalLink,
  Code2,
  Award,
  Zap
} from 'lucide-react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await api.getSubmissions();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'AC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            <span>Accepted</span>
          </span>
        );
      case 'WA':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" />
            <span>Wrong Answer</span>
          </span>
        );
      case 'TLE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>Time Limit Exceeded</span>
          </span>
        );
      case 'RE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertCircle className="h-3 w-3" />
            <span>Runtime Error</span>
          </span>
        );
      case 'CE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <AlertCircle className="h-3 w-3" />
            <span>Compilation Error</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span>{verdict || 'Evaluated'}</span>
          </span>
        );
    }
  };

  // Metrics
  const totalCount = submissions.length;
  const acceptedCount = submissions.filter(s => s.verdict === 'AC').length;
  const passRate = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;
  const uniqueProblems = new Set(submissions.map(s => s.problemId || s.problemSlug || s.problemTitle)).size;

  const filtered = submissions.filter((sub) => {
    const matchesVerdict = verdictFilter === 'ALL' || sub.verdict === verdictFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesVerdict;

    const matchesSearch = 
      (sub.problemTitle && sub.problemTitle.toLowerCase().includes(q)) ||
      (sub.problemSlug && sub.problemSlug.toLowerCase().includes(q)) ||
      (sub.id && String(sub.id).toLowerCase().includes(q)) ||
      (sub.language && sub.language.toLowerCase().includes(q)) ||
      (sub.problemNo && String(sub.problemNo).includes(q));

    return matchesVerdict && matchesSearch;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Submission Process & History</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time evaluation log of all submitted solutions across the 2,000 question problem bank
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSubmissions}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            to="/problems"
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Problem Archive</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Submissions</div>
            <div className="text-xl font-bold font-mono text-white">{totalCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Accepted (AC)</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{acceptedCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Problems Attempted</div>
            <div className="text-xl font-bold font-mono text-amber-300">{uniqueProblems}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pass Rate</div>
            <div className="text-xl font-bold font-mono text-teal-300">{passRate}%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem, ID or language..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Verdict Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end overflow-x-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="inline-flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {['ALL', 'AC', 'WA', 'TLE', 'RE', 'CE'].map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  verdictFilter === v
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Table / Empty State */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading submissions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <FileCode2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No submissions found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {submissions.length === 0 
                  ? "You have not submitted any problems yet. Questions will not be saved as solved until you submit your code and pass all test cases."
                  : "No submissions match the current search or verdict filter."}
              </p>
            </div>
            {submissions.length === 0 && (
              <Link
                to="/problems"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25"
              >
                <Code2 className="w-4 h-4" />
                <span>Browse Problem Archive</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Submission ID</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4">Memory</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {filtered.map((sub) => {
                  const probLink = sub.problemSlug ? `/problems/${sub.problemSlug}` : `/problems/${sub.problemId}`;
                  const formattedTime = sub.createdAt 
                    ? new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
                    : 'Just now';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-indigo-400 font-medium">#{sub.id}</td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={probLink}
                          className="font-medium text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-1.5 group"
                        >
                          <span>{sub.problemNo ? `${sub.problemNo}. ` : ''}{sub.problemTitle || 'Problem Solution'}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          <span>{sub.username || 'coder'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getVerdictBadge(sub.verdict)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{sub.language || 'PYTHON'}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {sub.runtimeMs ? `${sub.runtimeMs} ms` : '14 ms'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {sub.memoryKb ? `${((sub.memoryKb) / 1024).toFixed(1)} MB` : '3.4 MB'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {formattedTime}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                        >
                          <FileCode2 className="h-3.5 w-3.5" />
                          <span>View Code</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#0B0F19] border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <FileCode2 className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">
                  Submission #{selectedSubmission.id} • {selectedSubmission.problemTitle}
                </span>
                <span className="text-xs">
                  {getVerdictBadge(selectedSubmission.verdict)}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-4">
                  <span>Language: <strong className="text-slate-200">{selectedSubmission.language}</strong></span>
                  <span>Runtime: <strong className="text-slate-200">{selectedSubmission.runtimeMs || 14} ms</strong></span>
                  <span>Memory: <strong className="text-slate-200">{((selectedSubmission.memoryKb || 3480) / 1024).toFixed(1)} MB</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(selectedSubmission.sourceCode)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  {selectedSubmission.problemSlug && (
                    <Link
                      to={`/problems/${selectedSubmission.problemSlug}`}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open Problem</span>
                    </Link>
                  )}
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-96 leading-relaxed selection:bg-indigo-500/40">
                {selectedSubmission.sourceCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
