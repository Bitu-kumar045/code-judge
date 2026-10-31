import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, SAMPLE_SUBMISSIONS } from '../services/api';
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
  Filter
} from 'lucide-react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  useEffect(() => {
    async function loadSubmissions() {
      const data = await api.getSubmissions();
      setSubmissions(data || SAMPLE_SUBMISSIONS);
    }
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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-verdict-tle border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>Time Limit Exceeded</span>
          </span>
        );
      case 'RE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-verdict-re border border-orange-500/20">
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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            <span>Pending</span>
          </span>
        );
    }
  };

  const filtered = verdictFilter === 'ALL'
    ? submissions
    : submissions.filter(s => s.verdict === verdictFilter);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recent Submissions</h1>
          <p className="text-slate-400 text-xs mt-1">Real-time status of evaluated code submissions across all languages</p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="inline-flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {['ALL', 'AC', 'WA', 'TLE'].map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  verdictFilter === v
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
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
              <th className="py-3 px-4 text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-indigo-400">#{sub.id}</td>
                <td className="py-3.5 px-4">
                  <Link
                    to={`/problems/${sub.problemSlug}`}
                    className="font-medium text-slate-100 hover:text-indigo-400 transition-colors"
                  >
                    {sub.problemTitle}
                  </Link>
                </td>
                <td className="py-3.5 px-4 flex items-center space-x-1.5 text-slate-300">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{sub.username}</span>
                </td>
                <td className="py-3.5 px-4">{getVerdictBadge(sub.verdict)}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{sub.language}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {sub.runtimeMs ? `${sub.runtimeMs} ms` : '-'}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {sub.memoryKb ? `${(sub.memoryKb / 1024).toFixed(1)} MB` : '-'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedSubmission(sub)}
                    className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20"
                  >
                    <FileCode2 className="h-3.5 w-3.5" />
                    <span>View Code</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Code Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileCode2 className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">
                  Submission #{selectedSubmission.id} - {selectedSubmission.problemTitle}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-4">
                  <span>Language: <strong className="text-slate-200">{selectedSubmission.language}</strong></span>
                  <span>Verdict: <strong className="text-emerald-400">{selectedSubmission.verdict}</strong></span>
                </div>
                <button
                  onClick={() => handleCopyCode(selectedSubmission.sourceCode)}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-80">
                {selectedSubmission.sourceCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

