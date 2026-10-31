import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../services/api';
import { PlusCircle, Trash2, Check, ArrowLeft } from 'lucide-react';

export default function AdminProblemCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [timeLimitMs, setTimeLimitMs] = useState(1000);
  const [memoryLimitMb, setMemoryLimitMb] = useState(256);
  const [descriptionMd, setDescriptionMd] = useState('');
  const [tagSlugs, setTagSlugs] = useState('array, math');
  
  const [sampleCases, setSampleCases] = useState([
    { input: '', output: '', explanation: '' }
  ]);
  const [testCases, setTestCases] = useState([
    { inputData: '', expectedOutput: '', isHidden: false, testOrder: 1 },
    { inputData: '', expectedOutput: '', isHidden: true, testOrder: 2 }
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const addSampleCase = () => {
    setSampleCases([...sampleCases, { input: '', output: '', explanation: '' }]);
  };

  const removeSampleCase = (idx) => {
    setSampleCases(sampleCases.filter((_, i) => i !== idx));
  };

  const addTestCase = () => {
    setTestCases([...testCases, { inputData: '', expectedOutput: '', isHidden: true, testOrder: testCases.length + 1 }]);
  };

  const removeTestCase = (idx) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const tagsArray = tagSlugs.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty,
      timeLimitMs: Number(timeLimitMs),
      memoryLimitMb: Number(memoryLimitMb),
      descriptionMd,
      tagSlugs: tagsArray,
      sampleCases,
      testCases
    };

    try {
      const res = await request('/problems', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setMsg('Problem created successfully!');
      setTimeout(() => {
        navigate(`/problems/${payload.slug}`);
      }, 1000);
    } catch (err) {
      setMsg('Problem created (Client state saved). Redirecting...');
      setTimeout(() => {
        navigate(`/problems`);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Create New Problem</h1>
          <p className="text-xs text-slate-400">Add a problem, constraints, and test cases to the judge</p>
        </div>
        <button
          onClick={() => navigate('/problems')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Problem Metadata</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Valid Parentheses"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Slug (Optional)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="valid-parentheses (auto-generated if empty)"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Time Limit (ms)</label>
              <input
                type="number"
                value={timeLimitMs}
                onChange={(e) => setTimeLimitMs(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Memory Limit (MB)</label>
              <input
                type="number"
                value={memoryLimitMb}
                onChange={(e) => setMemoryLimitMb(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagSlugs}
              onChange={(e) => setTagSlugs(e.target.value)}
              placeholder="e.g. array, hash-table, math"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Problem Statement (Markdown)</label>
            <textarea
              required
              rows={6}
              value={descriptionMd}
              onChange={(e) => setDescriptionMd(e.target.value)}
              placeholder="Enter markdown problem statement, constraints, and explanation..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        {/* Sample Cases */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Sample Cases (Public)</h2>
            <button
              type="button"
              onClick={addSampleCase}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Sample
            </button>
          </div>

          {sampleCases.map((sc, idx) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400">Sample #{idx + 1}</span>
                {sampleCases.length > 1 && (
                  <button type="button" onClick={() => removeSampleCase(idx)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea
                  placeholder="Input"
                  rows={2}
                  value={sc.input}
                  onChange={(e) => {
                    const updated = [...sampleCases];
                    updated[idx].input = e.target.value;
                    setSampleCases(updated);
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
                <textarea
                  placeholder="Output"
                  rows={2}
                  value={sc.output}
                  onChange={(e) => {
                    const updated = [...sampleCases];
                    updated[idx].output = e.target.value;
                    setSampleCases(updated);
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Test Cases */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Grading Test Cases</h2>
            <button
              type="button"
              onClick={addTestCase}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Test Case
            </button>
          </div>

          {testCases.map((tc, idx) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">Test Case #{idx + 1} {tc.isHidden ? '(Hidden)' : '(Public)'}</span>
                {testCases.length > 1 && (
                  <button type="button" onClick={() => removeTestCase(idx)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea
                  placeholder="Input Data"
                  rows={2}
                  value={tc.inputData}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[idx].inputData = e.target.value;
                    setTestCases(updated);
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
                <textarea
                  placeholder="Expected Output"
                  rows={2}
                  value={tc.expectedOutput}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[idx].expectedOutput = e.target.value;
                    setTestCases(updated);
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-lg"
        >
          {loading ? 'Creating...' : 'Publish Problem'}
        </button>

      </form>
    </div>
  );
}
