import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';

const SNIPPETS = [
  {
    language: 'Python',
    filename: 'two_sum.py',
    code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Executed in Docker Sandbox: 14ms (AC)
print(twoSum([2, 7, 11, 15], 9))  # -> [0, 1]`
  },
  {
    language: 'C++',
    filename: 'dijkstra.cpp',
    code: `#include <bits/stdc++.h>
using namespace std;

vector<int> shortestPath(int n, vector<vector<pair<int,int>>>& adj) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    vector<int> dist(n, 1e9);
    dist[0] = 0;
    pq.push({0, 0});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
  }
];

export default function CodeTypingHero() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentCode = SNIPPETS[snippetIndex].code;
    let timer;

    if (!isDeleting && displayedText.length < currentCode.length) {
      // Typing phase
      timer = setTimeout(() => {
        setDisplayedText(currentCode.slice(0, displayedText.length + 1));
      }, 16);
    } else if (!isDeleting && displayedText.length === currentCode.length) {
      // Pause at completion
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 4000);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting phase
      timer = setTimeout(() => {
        setDisplayedText(currentCode.slice(0, displayedText.length - 3));
      }, 8);
    } else if (isDeleting && displayedText.length === 0) {
      // Switch snippet
      setIsDeleting(false);
      setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, snippetIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[snippetIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = SNIPPETS[snippetIndex];

  return (
    <div className="w-full rounded-2xl bg-[#111827] border border-slate-800 shadow-2xl overflow-hidden relative group">
      {/* Editor top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            {current.filename}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {current.language}
          </span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto min-h-[300px] leading-relaxed">
        <pre className="relative">
          <code>
            {displayedText}
            <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 align-middle animate-pulse" />
          </code>
        </pre>
      </div>

      {/* Subtle bottom badge */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Docker Sandbox Engine Active</span>
        </div>
        <span>UTF-8 • 256MB cgroup</span>
      </div>
    </div>
  );
}

