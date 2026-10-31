import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Terminal, 
  Activity, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function AdminDashboardPage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await api.getProblems();
      setProblems(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete problem "${title}"?`)) {
      setProblems(prev => prev.filter(p => p.id !== id));
      toast.success(`Problem "${title}" removed from catalog`);
    }
  };

  // Mock telemetry data for charts
  const submissionTrendData = [
    { day: 'Mon', submissions: 1240, accepted: 920 },
    { day: 'Tue', submissions: 1480, accepted: 1100 },
    { day: 'Wed', submissions: 1890, accepted: 1420 },
    { day: 'Thu', submissions: 1650, accepted: 1250 },
    { day: 'Fri', submissions: 2100, accepted: 1680 },
    { day: 'Sat', submissions: 3200, accepted: 2450 },
    { day: 'Sun', submissions: 2900, accepted: 2180 },
  ];

  const languageDistribution = [
    { name: 'C++ 17', value: 45, color: '#3B82F6' },
    { name: 'Python 3', value: 35, color: '#10B981' },
    { name: 'Java 17', value: 12, color: '#F59E0B' },
    { name: 'C', value: 8, color: '#8B5CF6' },
  ];

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.difficulty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Admin Studio Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold uppercase">
              Admin Studio
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-emerald-400 font-mono">Cluster Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Control & Telemetry
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Monitor Docker sandbox resource isolation, judge queue backpressure, and manage the problem archive.
          </p>
        </div>

        <Link
          to="/admin/problems/new"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Problem</span>
        </Link>
      </div>

      {/* Cluster Health Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>DOCKER ENGINE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">ACTIVE</div>
          <p className="text-[11px] text-slate-400">--network none • 256MB cap</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>REDIS QUEUE</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">0 jobs</div>
          <p className="text-[11px] text-slate-400">judge:queue depth (idle)</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>JUDGE LATENCY</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">14 ms</div>
          <p className="text-[11px] text-slate-400">Median execution benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ACCEPTED RATE</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">74.2%</div>
          <p className="text-[11px] text-slate-400">Past 7 days across all langs</p>
        </div>

      </div>

      {/* Two Column Clean Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Submissions vs Accepted BarChart */}
        <div className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Weekly Submission Volume vs Accepted
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Total
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Accepted
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" tickLine={false} style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="submissions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accepted" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Language Usage
            </h2>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-800">
            {languageDistribution.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-slate-300">{lang.name}: {lang.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Problem Management Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider">
              Problem Catalog Management
            </h2>
            <p className="text-xs text-slate-400">Total {problems.length} problems registered in system</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter problems..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ID</th>
                <th className="py-3 px-6">Problem Title</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Time Limit</th>
                <th className="py-3 px-4">Memory Limit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredProblems.map((prob) => (
                <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">#{prob.id}</td>
                  <td className="py-3 px-6 font-semibold text-white">
                    <Link to={`/problems/${prob.slug}`} className="hover:text-indigo-400 transition-colors">
                      {prob.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prob.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      prob.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{prob.timeLimitMs}ms</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{prob.memoryLimitMb}MB</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/problems/${prob.slug}`}
                        title="View Problem"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/admin/problems/${prob.slug}/edit`}
                        title="Edit Problem"
                        className="p-1 rounded text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prob.id, prob.title)}
                        title="Delete Problem"
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

