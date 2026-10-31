import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';

export default function VisualReplayModal({ isOpen, onClose, problemTitle = 'Two Sum', initialArray = [2, 7, 11, 15], initialTarget = 9 }) {
  const [arrayInput, setArrayInput] = useState(initialArray.join(', '));
  const [targetInput, setTargetInput] = useState(initialTarget);
  const [elements, setElements] = useState(initialArray);
  const [target, setTarget] = useState(initialTarget);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1200);

  // Generate algorithmic trace steps for Array / Two Pointers / Hash Search
  useEffect(() => {
    generateTrace(elements, target);
  }, [elements, target]);

  const generateTrace = (arr, tgt) => {
    const trace = [];
    const seen = {};

    trace.push({
      step: 0,
      activeIndices: [],
      pointerI: -1,
      pointerJ: -1,
      variables: { target: tgt, currentElement: null, complement: null, status: 'INITIALIZING' },
      explanation: `Starting visual execution trace on array of length ${arr.length} with target = ${tgt}.`,
      hashTable: {}
    });

    let found = false;
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const complement = tgt - val;

      // Step: Inspect current element
      trace.push({
        step: trace.length,
        activeIndices: [i],
        pointerI: i,
        pointerJ: -1,
        variables: { target: tgt, currentElement: val, complement: complement, status: `INSPECTING arr[${i}] = ${val}` },
        explanation: `Step ${trace.length}: Inspecting element at index ${i} (value ${val}). Required complement is ${tgt} - ${val} = ${complement}.`,
        hashTable: { ...seen }
      });

      // Step: Check hash map / seen
      if (seen[complement] !== undefined) {
        const j = seen[complement];
        trace.push({
          step: trace.length,
          activeIndices: [i, j],
          pointerI: i,
          pointerJ: j,
          variables: { target: tgt, currentElement: val, complement: complement, status: `MATCH FOUND! [${j}, ${i}]` },
          explanation: `🎯 MATCH FOUND! Complement ${complement} was previously recorded at index ${j}. Pair [${j}, ${i}] sums to ${tgt}!`,
          hashTable: { ...seen },
          isSuccess: true
        });
        found = true;
        break;
      } else {
        seen[val] = i;
        trace.push({
          step: trace.length,
          activeIndices: [i],
          pointerI: i,
          pointerJ: -1,
          variables: { target: tgt, currentElement: val, complement: complement, status: `STORED ${val} -> index ${i}` },
          explanation: `Complement ${complement} is not yet stored. Inserting { ${val}: index ${i} } into hash lookup table and advancing.`,
          hashTable: { ...seen }
        });
      }
    }

    if (!found) {
      trace.push({
        step: trace.length,
        activeIndices: [],
        pointerI: -1,
        pointerJ: -1,
        variables: { target: tgt, status: 'EXHAUSTED - NO PAIR FOUND' },
        explanation: `Array traversal complete. No valid combination of two elements summed to target ${tgt}.`,
        isFailure: true
      });
    }

    setSteps(trace);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMs, steps.length]);

  const handleApplyCustom = (e) => {
    e.preventDefault();
    try {
      const parsedArr = arrayInput.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      const parsedTgt = parseInt(targetInput, 10);
      if (parsedArr.length > 0 && !isNaN(parsedTgt)) {
        setElements(parsedArr);
        setTarget(parsedTgt);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex] || {
    activeIndices: [],
    variables: {},
    explanation: '',
    hashTable: {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12182F] border border-[#7C3AED]/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 px-6 bg-[#0B1020] border-b border-[#1E294B] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-[#A78BFA] border border-purple-500/30">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-white text-base">
                  AlgoArena Visual Replay
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399] font-mono font-bold">
                  STEP-BY-STEP TRACE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualizing runtime pointers, array memory buffers & state changes for: <span className="text-slate-200 font-semibold">{problemTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Custom Input Form */}
          <form onSubmit={handleApplyCustom} className="bg-[#0B1020] p-4 rounded-xl border border-[#1E294B] flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-mono">Array:</span>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="2, 7, 11, 15"
                className="bg-[#12182F] border border-[#1E294B] rounded-lg px-2.5 py-1.5 text-white font-mono flex-1 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-mono">Target:</span>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="bg-[#12182F] border border-[#1E294B] rounded-lg px-2.5 py-1.5 text-white font-mono w-20 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-purple-600 text-white font-semibold transition-colors"
            >
              Update Trace
            </button>
          </form>

          {/* Memory Visualizer Canvas */}
          <div className="bg-[#0B1020] border border-[#1E294B] rounded-2xl p-6 relative overflow-hidden">
            <div className="text-[11px] font-mono text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Array Memory Buffer & Pointers</span>
              <span className="text-purple-400 font-bold">Step {currentStepIndex + 1} of {steps.length}</span>
            </div>

            {/* Array Cells */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-6">
              {elements.map((val, idx) => {
                const isActive = currentStep.activeIndices?.includes(idx);
                const isPointerI = currentStep.pointerI === idx;
                const isPointerJ = currentStep.pointerJ === idx;
                const isMatch = currentStep.isSuccess && isActive;

                return (
                  <div key={idx} className="flex flex-col items-center space-y-2">
                    
                    {/* Pointer Indicator Arrow */}
                    <div className="h-6 flex items-center">
                      {isPointerI && isPointerJ ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-900 font-mono text-[10px] font-black animate-bounce">
                          i & j ↓
                        </span>
                      ) : isPointerI ? (
                        <span className="px-2 py-0.5 rounded bg-[#7C3AED] text-white font-mono text-[10px] font-bold animate-bounce">
                          i ↓
                        </span>
                      ) : isPointerJ ? (
                        <span className="px-2 py-0.5 rounded bg-[#34D399] text-slate-900 font-mono text-[10px] font-bold animate-bounce">
                          j ↓
                        </span>
                      ) : null}
                    </div>

                    {/* Array Cell Box */}
                    <div
                      className={`h-16 w-16 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-lg transition-all duration-300 shadow-lg ${
                        isMatch
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 scale-110 shadow-emerald-500/30'
                          : isActive
                          ? 'bg-purple-600/30 border-2 border-purple-400 text-purple-200 scale-105 shadow-purple-500/30'
                          : 'bg-[#12182F] border border-[#1E294B] text-slate-300'
                      }`}
                    >
                      <span>{val}</span>
                    </div>

                    {/* Array Index */}
                    <span className="text-[11px] font-mono text-slate-500">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hash Table / Aux Memory Inspector */}
            {currentStep.hashTable && (
              <div className="mt-4 pt-4 border-t border-[#1E294B] flex items-center space-x-3 text-xs">
                <span className="text-slate-400 font-mono uppercase text-[10px]">Hash Table / Seen:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(currentStep.hashTable).length === 0 ? (
                    <span className="text-slate-600 italic">Empty</span>
                  ) : (
                    Object.entries(currentStep.hashTable).map(([k, v]) => (
                      <span key={k} className="px-2 py-1 rounded bg-[#12182F] border border-[#1E294B] font-mono text-slate-300 text-[11px]">
                        <span className="text-purple-400 font-semibold">{k}</span> → idx {v}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live Step Explanation Narration */}
          <div className="bg-[#12182F] border border-[#1E294B] p-4 rounded-xl flex items-start space-x-3">
            {currentStep.isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : currentStep.isFailure ? (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Zap className="h-5 w-5 text-[#A78BFA] shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Execution Narration
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentStep.explanation}
              </p>
            </div>
          </div>

        </div>

        {/* Stepper Controls Bar */}
        <div className="p-4 px-6 bg-[#0B1020] border-t border-[#1E294B] flex flex-wrap items-center justify-between gap-4">
          
          {/* Step buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              title="Reset"
              className="p-2 rounded-lg bg-[#12182F] border border-[#1E294B] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((p) => Math.max(0, p - 1));
              }}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-[#12182F] border border-[#1E294B] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-900/30 transition-all hover:brightness-110"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((p) => Math.min(steps.length - 1, p + 1));
              }}
              disabled={currentStepIndex >= steps.length - 1}
              className="p-2 rounded-lg bg-[#12182F] border border-[#1E294B] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Speed:</span>
            {[
              { label: '0.5x', ms: 1800 },
              { label: '1x', ms: 1200 },
              { label: '2x', ms: 600 }
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => setSpeedMs(spd.ms)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  speedMs === spd.ms 
                    ? 'bg-[#7C3AED] text-white font-bold' 
                    : 'bg-[#12182F] border border-[#1E294B] text-slate-400 hover:text-white'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
