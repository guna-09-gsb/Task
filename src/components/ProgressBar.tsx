import React from 'react';
import { CheckCheck, Sparkles } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completedCount, totalCount }) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <section 
      aria-label="Daily task progress" 
      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
          {isAllDone ? (
            <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
          ) : (
            <CheckCheck className="w-4 h-4 text-indigo-500" />
          )}
          <span>Today's Progress</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
            {completedCount} of {totalCount} done
          </span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden p-0.5 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isAllDone
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/20'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Bottom Subtext */}
      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
        <span>
          {isAllDone
            ? '✨ Incredible job! You finished every task on your list.'
            : totalCount === 0
            ? 'No tasks for today. Add one below to kick off your day!'
            : `${totalCount - completedCount} ${totalCount - completedCount === 1 ? 'task' : 'tasks'} remaining`}
        </span>
        {totalCount > 0 && !isAllDone && (
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Keep momentum!</span>
        )}
      </p>
    </section>
  );
};
