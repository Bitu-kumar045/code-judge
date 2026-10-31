import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800/60 dark:bg-slate-800/50 ${className}`}
      {...props}
    />
  );
}

export function ProblemTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80"
        >
          <div className="flex items-center space-x-4 flex-1">
            <Skeleton className="w-6 h-6 rounded-md" />
            <div className="space-y-2 flex-1 max-w-md">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-12 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProblemDetailSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#0B0F19] gap-2 p-2">
      <div className="w-full md:w-1/2 rounded-xl bg-[#111827] border border-slate-800 p-6 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="pt-6 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
      <div className="w-full md:w-1/2 rounded-xl bg-[#111827] border border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <Skeleton key={n} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl bg-[#111827] border border-slate-800" />
        <Skeleton className="h-64 rounded-2xl bg-[#111827] border border-slate-800" />
        <Skeleton className="h-64 rounded-2xl bg-[#111827] border border-slate-800" />
      </div>
    </div>
  );
}
