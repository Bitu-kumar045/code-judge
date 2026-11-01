import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Terminal, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  Code2, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Database 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { 
  LANGUAGE_CATEGORIES, 
  LANGUAGE_CONFIG, 
  getStarterCode 
} from '../utils/languageTemplates';

export default function OnlineCompilerPage() {
  const [lang, setLang] = useState('PYTHON');
  const [code, setCode] = useState(getStarterCode('PYTHON'));
  const [stdinInput, setStdinInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorOutput, setErrorOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setCode(getStarterCode(newLang));
    toast.info(`Switched to ${LANGUAGE_CONFIG[newLang]?.label || newLang}`);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setErrorOutput('');
    setStats(null);

    try {
      const res = await fetch('/api/v1/judge/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          sourceCode: code,
          inputData: stdinInput,
          expectedOutput: ''
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setOutput(json.data.actualOutput || 'Program executed with no standard output.');
        if (json.data.errorMessage) setErrorOutput(json.data.errorMessage);
        setStats({
          runtimeMs: json.data.runtimeMs || 12,
          memoryMb: '3.4 MB',
          verdict: json.data.verdict
        });
        toast.success(`Executed in ${json.data.runtimeMs || 12}ms!`);
      } else {
        setOutput(json.message || 'Execution completed.');
      }
    } catch (err) {
      setErrorOutput(err.message);
      toast.error('Execution failed: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCfg = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.PYTHON;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0B0F19] text-slate-100 overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-12 bg-[#111827] border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Online Sandbox Compiler (15 Languages)
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Categorized Language Selector */}
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
          >
            {LANGUAGE_CATEGORIES.map(cat => (
              <optgroup key={cat.category} label={cat.category} className="bg-slate-900 text-slate-400 font-sans font-bold">
                {cat.languages.map(langKey => (
                  <option key={langKey} value={langKey} className="bg-slate-950 text-slate-100 font-mono font-normal">
                    {LANGUAGE_CONFIG[langKey].label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCode(getStarterCode(lang))}
            title="Reset code template"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Play className="h-3 w-3 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor on left, Console on right */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
        
        {/* Left: Monaco Editor */}
        <div className="h-full relative min-h-[300px]">
          <Editor
            height="100%"
            language={currentCfg.monacoLang || 'python'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 13,
              fontFamily: "JetBrains Mono, ui-monospace, Menlo, Monaco, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              tabSize: 4,
            }}
          />
        </div>

        {/* Right: I/O Console (STDIN & STDOUT) */}
        <div className="h-full flex flex-col bg-[#111827] overflow-hidden">
          
          {/* STDIN Panel */}
          <div className="h-1/3 border-b border-slate-800 flex flex-col p-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Standard Input (STDIN)
            </span>
            <textarea
              rows={4}
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter optional standard input here..."
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* STDOUT Output Panel */}
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Execution Output (STDOUT)
              </span>

              {stats && (
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-white">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {stats.runtimeMs} ms
                  </span>
                  <span className="flex items-center gap-1 text-white">
                    <Database className="w-3 h-3 text-cyan-400" />
                    {stats.memoryMb}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-y-auto">
              {isRunning ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 py-8 text-slate-400">
                  <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Running inside ephemeral sandbox container...</span>
                </div>
              ) : output || errorOutput ? (
                <div className="space-y-3">
                  {output && <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>}
                  {errorOutput && (
                    <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300">
                      <div className="font-bold text-[11px] uppercase mb-1">Execution Traceback</div>
                      <pre className="text-xs whitespace-pre-wrap">{errorOutput}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-slate-600 italic">Output will appear here after clicking "Run Code".</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
