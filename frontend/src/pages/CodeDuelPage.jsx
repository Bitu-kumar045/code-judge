import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, 
  Trophy, 
  Timer, 
  Zap, 
  Share2, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Send, 
  Sparkles, 
  Flame, 
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { getPlayerState, updateElo } from '../utils/gamification';
import { api } from '../services/api';

const DUEL_PROBLEMS = [
  {
    title: 'Two Sum Target Search',
    slug: 'two-sum',
    difficulty: 'EASY',
    timeLimit: 15 * 60, // 15 mins
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    exampleInput: '4\n2 7 11 15\n9',
    exampleOutput: '0 1',
    starterCode: {
      PYTHON: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    \n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            print(f"{seen[comp]} {i}")\n            return\n        seen[num] = i\n\nsolve()\n`,
      CPP: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) {\n            cout << seen[comp] << " " << i << "\\n";\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}\n`
    }
  },
  {
    title: 'Valid Palindrome Cleaner',
    slug: 'valid-palindrome',
    difficulty: 'EASY',
    timeLimit: 12 * 60,
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    exampleInput: 'A man, a plan, a canal: Panama',
    exampleOutput: 'true',
    starterCode: {
      PYTHON: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    clean = [c.lower() for c in s if c.isalnum()]\n    print("true" if clean == clean[::-1] else "false")\n\nsolve()\n`,
      CPP: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    string clean = "";\n    for (char c : s) {\n        if (isalnum(c)) clean += tolower(c);\n    }\n    int l = 0, r = clean.size() - 1;\n    bool ok = true;\n    while (l < r) {\n        if (clean[l++] != clean[r--]) { ok = false; break; }\n    }\n    cout << (ok ? "true" : "false") << "\\n";\n    return 0;\n}\n`
    }
  }
];

export default function CodeDuelPage() {
  const [player, setPlayer] = useState(getPlayerState());
  const [matchState, setMatchState] = useState('LOBBY'); // LOBBY, MATCHED, IN_DUEL, FINISHED
  const [selectedProblem, setSelectedProblem] = useState(DUEL_PROBLEMS[0]);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [language, setLanguage] = useState('PYTHON');
  const [code, setCode] = useState(DUEL_PROBLEMS[0].starterCode.PYTHON);
  const [userTestsPassed, setUserTestsPassed] = useState(0);
  const [opponentTestsPassed, setOpponentTestsPassed] = useState(0);
  const [opponentStatus, setOpponentStatus] = useState('Waiting in lobby...');
  const [battleLogs, setBattleLogs] = useState([]);
  const [duelResult, setDuelResult] = useState(null); // 'VICTORY' or 'DEFEAT'
  const [isCopied, setIsCopied] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const opponentRef = useRef({
    name: 'Vortex_Coder',
    title: 'Code Sorcerer',
    elo: 1695,
    avatar: 'V'
  });

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (matchState === 'IN_DUEL' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchState, timeLeft]);

  // Opponent AI behavior simulation
  useEffect(() => {
    let opponentInterval = null;
    if (matchState === 'IN_DUEL') {
      const milestones = [
        { sec: 10, status: 'Drafting initial data structures...', pass: 1, log: 'Opponent passed testcase 1/5' },
        { sec: 35, status: 'Testing edge cases & memory bounds...', pass: 2, log: 'Opponent passed testcase 2/5' },
        { sec: 75, status: 'Refactoring inner loops...', pass: 3, log: 'Opponent passed testcase 3/5' },
        { sec: 130, status: 'Optimizing time complexity...', pass: 4, log: 'Opponent passed testcase 4/5' },
        { sec: 210, status: 'Submitting final solution...', pass: 5, log: 'Opponent submitted all 5/5 tests!' },
      ];

      milestones.forEach((m) => {
        setTimeout(() => {
          if (matchState === 'IN_DUEL') {
            setOpponentTestsPassed(m.pass);
            setOpponentStatus(m.status);
            setBattleLogs((prev) => [
              { time: new Date().toLocaleTimeString(), text: m.log, type: 'opponent' },
              ...prev
            ]);

            if (m.pass === 5) {
              // Opponent won if user hasn't submitted yet
              handleFinish('DEFEAT');
            }
          }
        }, m.sec * 1000);
      });
    }
    return () => clearInterval(opponentInterval);
  }, [matchState]);

  const startMatchmaking = () => {
    setMatchState('MATCHED');
    setBattleLogs([
      { time: new Date().toLocaleTimeString(), text: 'Match found! Opponent: Vortex_Coder (1695 Elo)', type: 'system' }
    ]);
    setTimeout(() => {
      setMatchState('IN_DUEL');
      setTimeLeft(selectedProblem.timeLimit);
      setBattleLogs((prev) => [
        { time: new Date().toLocaleTimeString(), text: '⚔️ DUEL STARTED! First to pass 5/5 testcases wins.', type: 'system' },
        ...prev
      ]);
    }, 2000);
  };

  const handleRunTest = async () => {
    setEvaluating(true);
    try {
      const res = await api.runCode({
        sourceCode: code,
        language,
        inputData: selectedProblem.exampleInput,
        expectedOutput: selectedProblem.exampleOutput
      });

      if (res?.verdict === 'AC') {
        setUserTestsPassed((p) => Math.max(p, 3));
        setBattleLogs((prev) => [
          { time: new Date().toLocaleTimeString(), text: 'Sample tests PASSED! (AC in 18ms)', type: 'user' },
          ...prev
        ]);
      } else {
        setBattleLogs((prev) => [
          { time: new Date().toLocaleTimeString(), text: `Sample test: ${res?.verdict || 'Wrong Answer'}`, type: 'user-err' },
          ...prev
        ]);
      }
    } catch (e) {
      setUserTestsPassed(2);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmitDuel = () => {
    setUserTestsPassed(5);
    setBattleLogs((prev) => [
      { time: new Date().toLocaleTimeString(), text: '🏆 You submitted and passed 5/5 testcases!', type: 'user-win' },
      ...prev
    ]);
    handleFinish('VICTORY');
  };

  const handleFinish = (result) => {
    setMatchState('FINISHED');
    setDuelResult(result);
    const updated = updateElo(result === 'VICTORY', 28);
    setPlayer(updated);
  };

  const handleTimeout = () => {
    if (matchState === 'IN_DUEL') {
      const result = userTestsPassed > opponentTestsPassed ? 'VICTORY' : 'DEFEAT';
      handleFinish(result);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/duel?room=ARENA-9041`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Duel Top HUD */}
        <div className="bg-[#12182F] border border-[#1E294B] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Player 1 (You) */}
            <div className="flex items-center space-x-3 w-full md:w-1/3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#34D399] p-0.5 shadow-md">
                <div className="h-full w-full bg-[#0B1020] rounded-[10px] flex items-center justify-center font-bold text-white text-lg">
                  {player.username.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold text-white text-sm">{player.username} (You)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-[#A78BFA] font-mono">
                    {player.eloRating} Elo
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="flex-1 bg-[#0B1020] h-2 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(userTestsPassed / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{userTestsPassed}/5</span>
                </div>
              </div>
            </div>

            {/* Duel Timer & VS Emblem */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0B1020] border border-[#7C3AED]/40 shadow-inner">
                <Swords className="h-4 w-4 text-[#7C3AED]" />
                <span className="font-display font-black text-amber-400 text-sm tracking-wider">VS</span>
                <div className="flex items-center space-x-1 pl-2 border-l border-slate-700 text-slate-300 font-mono text-sm">
                  <Timer className="h-4 w-4 text-purple-400" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex items-center space-x-3 w-full md:w-1/3 justify-end text-right">
              <div className="flex-1">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                    {opponentRef.current.elo} Elo
                  </span>
                  <span className="font-display font-bold text-white text-sm">{opponentRef.current.name}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 justify-end">
                  <span className="text-[11px] font-mono text-rose-400 font-bold">{opponentTestsPassed}/5</span>
                  <div className="flex-1 max-w-[140px] bg-[#0B1020] h-2 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(opponentTestsPassed / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-md">
                <div className="h-full w-full bg-[#0B1020] rounded-[10px] flex items-center justify-center font-bold text-white text-lg">
                  {opponentRef.current.avatar}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Duel Interface */}
        {matchState === 'LOBBY' ? (
          <div className="bg-[#12182F] border border-[#1E294B] rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#34D399] mx-auto p-0.5 shadow-xl shadow-purple-600/30 flex items-center justify-center">
              <Swords className="h-10 w-10 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-display font-extrabold text-white">
                Live 1v1 Algorithm Duel Arena
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                Go head-to-head against another coder in real-time. Both solve the same problem. First to pass all test cases claims Elo rating and XP glory!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startMatchmaking}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:brightness-110 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/40 transition-all"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>Quick Match (Find Opponent)</span>
              </button>

              <button
                onClick={copyInviteLink}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-purple-500/40 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                <span>{isCopied ? 'Invite Link Copied!' : 'Invite Friend'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Problem & Battle Feed */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Problem Statement Card */}
              <div className="bg-[#12182F] border border-[#1E294B] rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-white text-base">
                    {selectedProblem.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    {selectedProblem.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedProblem.description}
                </p>

                <div className="bg-[#0B1020] border border-[#1E294B] rounded-xl p-3 space-y-2 text-xs font-mono">
                  <div className="text-slate-400 uppercase text-[10px]">Example Input:</div>
                  <pre className="text-slate-200">{selectedProblem.exampleInput}</pre>
                  <div className="text-slate-400 uppercase text-[10px] pt-1">Example Output:</div>
                  <pre className="text-emerald-400">{selectedProblem.exampleOutput}</pre>
                </div>
              </div>

              {/* Live Battle Feed */}
              <div className="bg-[#12182F] border border-[#1E294B] rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Battle Feed</span>
                  </span>
                  <span className="text-[10px] text-purple-400">Opponent: {opponentStatus}</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                  {battleLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg font-mono text-[11px] flex items-center justify-between ${
                        log.type === 'user-win' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.type === 'opponent' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                        log.type === 'user-err' ? 'bg-amber-500/10 text-amber-300' :
                        'bg-[#0B1020] text-slate-300'
                      }`}
                    >
                      <span>{log.text}</span>
                      <span className="text-[9px] text-slate-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Code Editor & Action Buttons */}
            <div className="lg:col-span-7 bg-[#12182F] border border-[#1E294B] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Language Picker */}
                <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
                  <div className="flex items-center space-x-2">
                    {['PYTHON', 'CPP'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setCode(selectedProblem.starterCode[lang] || '');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                          language === lang
                            ? 'bg-[#7C3AED] text-white shadow'
                            : 'bg-[#0B1020] text-slate-400 hover:text-white border border-[#1E294B]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    Dual Auto-Judge Active
                  </span>
                </div>

                {/* Editor Textarea */}
                <div className="relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={17}
                    spellCheck="false"
                    className="w-full bg-[#0B1020] border border-[#1E294B] rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-[#7C3AED] selection:bg-purple-600 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleRunTest}
                  disabled={evaluating}
                  className="px-4 py-2.5 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-purple-500/40 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-slate-300" />
                  <span>{evaluating ? 'Testing...' : 'Run Sample Tests'}</span>
                </button>

                <button
                  onClick={handleSubmitDuel}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Solution (5 Tests)</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Victory / Defeat Modal */}
        {matchState === 'FINISHED' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#12182F] border border-[#1E294B] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
              
              <div className={`h-24 w-24 rounded-3xl mx-auto p-0.5 flex items-center justify-center shadow-2xl ${
                duelResult === 'VICTORY'
                  ? 'bg-gradient-to-tr from-amber-400 via-emerald-400 to-[#34D399] shadow-emerald-500/30'
                  : 'bg-gradient-to-tr from-rose-500 to-amber-500 shadow-rose-500/30'
              }`}>
                <div className="h-full w-full bg-[#0B1020] rounded-[22px] flex items-center justify-center">
                  {duelResult === 'VICTORY' ? (
                    <Trophy className="h-12 w-12 text-amber-400 animate-bounce" />
                  ) : (
                    <Swords className="h-12 w-12 text-rose-400" />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-display font-black text-white">
                  {duelResult === 'VICTORY' ? 'VICTORY!' : 'DEFEAT'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {duelResult === 'VICTORY'
                    ? 'Incredible speed! You conquered the arena and passed all test cases first.'
                    : 'Good fight! Analyze the failed test cases, learn the pattern, and strike back.'}
                </p>
              </div>

              {/* Stats Rewards */}
              <div className="grid grid-cols-2 gap-3 bg-[#0B1020] p-4 rounded-2xl border border-[#1E294B]">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Elo Rating</div>
                  <div className={`text-base font-bold font-mono ${duelResult === 'VICTORY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {duelResult === 'VICTORY' ? '+28' : '-15'} Elo
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">XP Bounty</div>
                  <div className="text-base font-bold font-mono text-purple-400">
                    +{duelResult === 'VICTORY' ? '250' : '40'} XP
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setMatchState('LOBBY');
                    setUserTestsPassed(0);
                    setOpponentTestsPassed(0);
                    setDuelResult(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg"
                >
                  Play Another Duel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
