import { useState, useEffect } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'codejudge_solved_problems';
const DETAILS_KEY = 'codejudge_solved_details';

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

// Retrieve solved details dictionary: { [id]: { difficulty, topic, no } }
export function getSolvedDetails() {
  try {
    const raw = localStorage.getItem(DETAILS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Calculate level-wise solved statistics
export function getLevelWiseSolved() {
  const details = getSolvedDetails();
  let easy = 0;
  let medium = 0;
  let hard = 0;

  Object.values(details).forEach(item => {
    const d = (item.difficulty || '').toUpperCase();
    if (d === 'EASY') easy++;
    else if (d === 'HARD') hard++;
    else medium++;
  });

  return {
    easy,
    medium,
    hard,
    total: easy + medium + hard,
    breakdown: {
      easy: { solved: easy, total: 298 },
      medium: { solved: medium, total: 447 },
      hard: { solved: hard, total: 255 }
    }
  };
}

// Mark problem as solved locally and sync with backend
export function markProblemSolved(problem) {
  if (!problem) return;
  const set = getSolvedSet();
  const idStr = String(problem.id || `prob-${problem.no}`);
  
  if (problem.id) set.add(String(problem.id));
  if (problem.slug) set.add(String(problem.slug));
  if (problem.no !== undefined && problem.no !== null) set.add(String(problem.no));

  const arr = Array.from(set);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (err) {
    console.error('Failed to save solved problems to localStorage', err);
  }

  // Save metadata for level-wise calculations
  try {
    const details = getSolvedDetails();
    const normDiff = (
      problem.difficulty || 
      (problem.level === 'Easy' ? 'EASY' : problem.level === 'Moderate' ? 'MEDIUM' : 'HARD') || 
      'MEDIUM'
    ).toUpperCase();

    details[idStr] = {
      id: problem.id || idStr,
      slug: problem.slug || '',
      no: problem.no,
      difficulty: normDiff,
      topic: problem.topic || 'General'
    };
    localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
  } catch (err) {
    console.error('Failed to save solved details to localStorage', err);
  }

  // Notify components across the application
  window.dispatchEvent(new CustomEvent('codejudge_solved_updated', {
    detail: { problem, solvedIds: arr, levelWise: getLevelWiseSolved() }
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
    if (val.startsWith('prob-')) {
      count++;
    }
  });
  const details = getSolvedDetails();
  const detailCount = Object.keys(details).length;
  return Math.max(count, detailCount, Math.floor(activeSet.size / 3));
}

// Custom React hook to subscribe to solved problem updates
export function useSolvedState() {
  const [solvedSet, setSolvedSet] = useState(() => getSolvedSet());
  const [levelCounts, setLevelCounts] = useState(() => getLevelWiseSolved());

  useEffect(() => {
    // Sync authoritative solved list directly from backend
    api.getSolvedProblems?.().then(res => {
      const ids = Array.isArray(res) ? res : res?.solvedIds;
      if (Array.isArray(ids)) {
        const next = new Set(ids.map(String));
        setSolvedSet(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      }
    }).catch(() => {});

    const handleUpdate = () => {
      setSolvedSet(getSolvedSet());
      setLevelCounts(getLevelWiseSolved());
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
    easySolved: levelCounts.easy,
    mediumSolved: levelCounts.medium,
    hardSolved: levelCounts.hard,
    levelCounts,
    markSolved: markProblemSolved
  };
}
