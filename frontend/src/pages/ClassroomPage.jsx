import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  FileSpreadsheet, 
  ShieldAlert, 
  Lock, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  ExternalLink,
  AlertTriangle,
  Sparkles,
  KeyRound,
  FileCode,
  BookOpen
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ClassroomPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'gradebook' | 'exam'
  const [isExamActive, setIsExamActive] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassForm, setNewClassForm] = useState({ name: '', code: '', department: 'CSE', instructor: '' });
  const toast = useToast();

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('http://localhost:8080/api/v1/classrooms');
        const json = await res.json();
        if (json.success && json.data) {
          setClasses(json.data);
          setSelectedClass(json.data[0]);
        }
      } catch (err) {
        console.error('Failed to load classrooms:', err);
      }
    }
    loadClasses();
  }, []);

  // Anti-cheat tab switch listener during active Lab Exam Mode
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => {
          const next = prev + 1;
          toast.error(`⚠️ Security Warning: Tab switch detected! (Violation #${next}). Incident logged to instructor gradebook.`, 'Anti-Cheat Alert');
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamActive, toast]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassForm.name) return;

    try {
      const res = await fetch('http://localhost:8080/api/v1/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClassForm)
      });
      const json = await res.json();
      if (json.success) {
        setClasses([json.data, ...classes]);
        setSelectedClass(json.data);
        setShowCreateModal(false);
        toast.success(`Classroom "${newClassForm.name}" created with code ${json.data.code}!`);
        setNewClassForm({ name: '', code: '', department: 'CSE', instructor: '' });
      }
    } catch (err) {
      toast.error('Failed to create classroom');
    }
  };

  const handleExportCsv = () => {
    if (!selectedClass) return;
    window.open(`http://localhost:8080/api/v1/classrooms/${selectedClass.id}/export`, '_blank');
    toast.success('Gradebook exported as CSV with marks and anti-cheat audit logs!');
  };

  if (!selectedClass) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0B0F19] text-slate-100 min-h-screen">
      
      {/* Top Banner & Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>College & University Classroom Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {selectedClass.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-indigo-300">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                Join Code: <strong>{selectedClass.code}</strong>
              </span>
              <span>Instructor: <strong className="text-white">{selectedClass.instructor}</strong></span>
              <span>Semester: {selectedClass.semester}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {selectedClass.enrolledCount} Enrolled Students
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Gradebook</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Classroom</span>
            </button>
          </div>
        </div>

        {/* Classroom Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 overflow-x-auto">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider mr-2">Your Courses:</span>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedClass.id === cls.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cls.code}: {cls.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Lab Assignments ({selectedClass.assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gradebook')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gradebook'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Live Gradebook & Submissions</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'exam'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Strict Lab Exam Mode</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Assignments View */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedClass.assignments.map((asg) => (
              <div 
                key={asg.id}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
                        Max Marks: {asg.maxMarks}
                      </span>
                      {asg.examMode && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Exam Mode
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white pt-1">{asg.title}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Due: {new Date(asg.deadline).toLocaleDateString()}</span>
                  </div>
                  <span>{asg.submissionsCount} / {selectedClass.enrolledCount} Submitted</span>
                </div>

                <div className="pt-2">
                  <a
                    href={`/problems/${asg.problemSlug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Open Lab Problem in IDE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Gradebook View */}
      {activeTab === 'gradebook' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-white uppercase">Automated Lab Marks & Plagiarism Sentinel</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Total {selectedClass.students.length} evaluated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 uppercase font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-28">Roll No</th>
                  <th className="py-3 px-6">Student Name</th>
                  <th className="py-3 px-4 text-center">Auto-Graded Marks</th>
                  <th className="py-3 px-4 text-center">Submission Status</th>
                  <th className="py-3 px-4 text-center">Tab Switches (Anti-Cheat)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {selectedClass.students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{std.rollNo}</td>
                    <td className="py-3.5 px-6 font-sans font-medium text-slate-200">{std.name}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{std.score} / 100</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        std.status === 'SUBMITTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.tabSwitches > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-1 w-max mx-auto">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          {std.tabSwitches} switches logged
                        </span>
                      ) : (
                        <span className="text-emerald-400">0 (Clean)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => toast.info(`Viewing code submission for ${std.name}`)}
                        className="text-indigo-400 hover:text-white transition-colors"
                      >
                        Inspect Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Strict Lab Exam Mode */}
      {activeTab === 'exam' && (
        <div className="bg-[#111827] border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Strict College Examination Environment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Proctored Lab Exam Sentinel
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                When active, CodeJudge enforces locked fullscreen mode, disables clipboard paste, and monitors tab-switch events in real time. 
                Any attempt to leave the active exam window is permanently recorded on the student's submission sheet.
              </p>
            </div>

            <button
              onClick={() => {
                setIsExamActive(!isExamActive);
                if (!isExamActive) {
                  toast.warning('Strict Lab Exam Mode engaged! Tab switches and window focus are now monitored.', 'Exam Mode Active 🛡️');
                } else {
                  toast.info('Exam mode disabled.');
                }
              }}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg ${
                isExamActive 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-indigo-600/30'
              }`}
            >
              {isExamActive ? 'Stop Active Exam Sentinel' : 'Engage Lab Exam Sentinel'}
            </button>
          </div>

          {/* Live Status indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Sentinel Status</div>
              <div className={`text-base font-bold font-mono ${isExamActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isExamActive ? 'MONITORING LIVE' : 'STANDBY'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Clipboard Security</div>
              <div className={`text-base font-bold font-mono ${isExamActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isExamActive ? 'PASTE DISABLED' : 'STANDARD'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Your Tab Switch Violations</div>
              <div className={`text-base font-bold font-mono ${tabSwitchWarnings > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tabSwitchWarnings} incidents
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New College Course</h3>
            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS401: Distributed Systems Lab"
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CSE-401"
                  value={newClassForm.code}
                  onChange={(e) => setNewClassForm({ ...newClassForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Instructor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Sharma"
                  value={newClassForm.instructor}
                  onChange={(e) => setNewClassForm({ ...newClassForm, instructor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

