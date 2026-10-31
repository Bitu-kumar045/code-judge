import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  FileCode,
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';

export default function AdminProblemPage() {
  const { id } = useParams(); // If present, edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [timeLimitMs, setTimeLimitMs] = useState(1000);
  const [memoryLimitMb, setMemoryLimitMb] = useState(256);
  const [descriptionMd, setDescriptionMd] = useState('');
  const [tagSlugs, setTagSlugs] = useState('array, hash-table');

  const [testCases, setTestCases] = useState([
    { inputData: '', expectedOutput: '', isHidden: false, testOrder: 1 },
    { inputData: '', expectedOutput: '', isHidden: true, testOrder: 2 }
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      api.getProblemBySlug(id).then(data => {
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setDifficulty(data.difficulty || 'EASY');
          setTimeLimitMs(data.timeLimitMs || 1000);
          setMemoryLimitMb(data.memoryLimitMb || 256);
          setDescriptionMd(data.descriptionMd || '');
          if (data.tags) {
            setTagSlugs(Array.isArray(data.tags) ? data.tags.join(', ') : '');
          }
          if (data.sampleCases && data.sampleCases.length > 0) {
            setTestCases(data.sampleCases.map((s, idx) => ({
              inputData: s.input,
              expectedOutput: s.output,
              isHidden: false,
              testOrder: idx + 1
            })));
          }
        }
        setLoading(false);
      });
    }
  }, [id, isEditMode]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditMode) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      { inputData: '', expectedOutput: '', isHidden: true, testOrder: testCases.length + 1 }
    ]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleUpdateTestCase = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const problemPayload = {
      title,
      slug,
      difficulty,
      timeLimitMs: Number(timeLimitMs),
      memoryLimitMb: Number(memoryLimitMb),
      descriptionMd,
      tagSlugs: tagSlugs.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      sampleCases: testCases.filter(t => !t.isHidden).map(t => ({
        input: t.inputData,
        output: t.expectedOutput
      })),
      testCases: testCases.map((t, idx) => ({
        inputData: t.inputData,
        expectedOutput: t.expectedOutput,
        isHidden: t.isHidden,
        testOrder: idx + 1
      }))
    };

    if (isEditMode) {
      await api.updateProblem(id, problemPayload);
    } else {
      await api.createProblem(problemPayload);
    }

    setSaving(false);
    setSuccess(true);

    setTimeout(() => {
      navigate('/problems');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        Loading problem details for edit...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <Link to="/problems" className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors mb-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Problem List</span>
          </Link>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>Admin Problem Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            {isEditMode ? `Edit Problem: ${title}` : 'Author New Problem'}
          </h1>
          <p className="text-slate-400 text-xs">Define constraints, markdown description, and judge test cases</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Problem {isEditMode ? 'updated' : 'published'} successfully to the database! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Problem Metadata</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Invert Binary Tree"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Unique Slug</label>
              <input
                type="text"
                required
                placeholder="e.g. invert-binary-tree"
                value={slug}
                disabled={isEditMode}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Time Limit (ms)</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={timeLimitMs}
                onChange={(e) => setTimeLimitMs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Memory Limit (MB)</label>
              <input
                type="number"
                min="32"
                max="1024"
                value={memoryLimitMb}
                onChange={(e) => setMemoryLimitMb(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. array, tree, binary-search"
              value={tagSlugs}
              onChange={(e) => setTagSlugs(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description Markdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Problem Description (Markdown)</h2>
          <textarea
            required
            rows={8}
            placeholder="Write the complete problem statement, example inputs/outputs, and constraints..."
            value={descriptionMd}
            onChange={(e) => setDescriptionMd(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Test Cases Builder */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Test Cases ({testCases.length})
            </h2>
            <button
              type="button"
              onClick={handleAddTestCase}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Test Case</span>
            </button>
          </div>

          <div className="space-y-3">
            {testCases.map((tc, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400">Test Case #{idx + 1}</span>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => handleUpdateTestCase(idx, 'isHidden', e.target.checked)}
                        className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <span>{tc.isHidden ? 'Hidden (Judge Only)' : 'Sample (Visible)'}</span>
                    </label>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500">STDIN Input:</span>
                    <textarea
                      rows={2}
                      required
                      value={tc.inputData}
                      onChange={(e) => handleUpdateTestCase(idx, 'inputData', e.target.value)}
                      placeholder="e.g. 4\n2 7 11 15\n9"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500">Expected STDOUT:</span>
                    <textarea
                      rows={2}
                      required
                      value={tc.expectedOutput}
                      onChange={(e) => handleUpdateTestCase(idx, 'expectedOutput', e.target.value)}
                      placeholder="e.g. 0 1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : isEditMode ? 'Update Problem' : 'Save & Publish Problem'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
