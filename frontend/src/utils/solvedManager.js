import { useState, useEffect } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'codejudge_solved_problems';

// Retrieve set of solved identifiers (IDs, slugs, and numbers)
export function getSolvedSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

// Mark problem as solved locally and sync with backend
export function markProblemSolved(problem) {
  if (!problem) return;
  const set = getSolvedSet();
  
  if (problem.id) set.add(String(problem.id));
  if (problem.slug) set.add(String(problem.slug));
  if (problem.no !== undefined && problem.no !== null) set.add(String(problem.no));

  const arr = Array.from(set);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (err) {
    console.error('Failed to save solved problems to localStorage', err);
  }

  // Notify components across the application
  window.dispatchEvent(new CustomEvent('codejudge_solved_updated', {
    detail: { problem, solvedIds: arr }
  }));

  // Sync to backend in background
  if (problem.id) {
    api.markSolved?.(problem.id).catch(() => {});
  }
}

// Check whether problem is solved
export function isProblemSolved(problem, set) {
  if (!problem) return false;
  const activeSet = set || getSolvedSet();
  if (problem.id && activeSet.has(String(problem.id))) return true;
  if (problem.slug && activeSet.has(String(problem.slug))) return true;
  if (problem.no !== undefined && problem.no !== null && activeSet.has(String(problem.no))) return true;
  if (typeof problem === 'string' && activeSet.has(problem)) return true;
  return false;
}

// Get unique count of solved problems (counting unique 'prob-' IDs or numeric IDs)
export function getSolvedCount(set) {
  const activeSet = set || getSolvedSet();
  let count = 0;
  activeSet.forEach(val => {
    // Only count canonical IDs like 'prob-1' to avoid double-counting slugs and numbers
    if (val.startsWith('prob-')) {
      count++;
    }
  });
  // Fallback if IDs without 'prob-' prefix were stored
  return count > 0 ? count : Math.floor(activeSet.size / 2);
}

// Custom React hook to subscribe to solved problem updates
export function useSolvedState() {
  const [solvedSet, setSolvedSet] = useState(() => getSolvedSet());

  useEffect(() => {
    // Initial fetch from backend if available
    api.getSolvedProblems?.().then(ids => {
      if (Array.isArray(ids) && ids.length > 0) {
        setSolvedSet(prev => {
          const next = new Set([...prev, ...ids.map(String)]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
          return next;
        });
      }
    }).catch(() => {});

    const handleUpdate = () => {
      setSolvedSet(getSolvedSet());
    };

    window.addEventListener('codejudge_solved_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('codejudge_solved_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    solvedSet,
    isSolved: (prob) => isProblemSolved(prob, solvedSet),
    solvedCount: getSolvedCount(solvedSet),
    markSolved: markProblemSolved
  };
}
