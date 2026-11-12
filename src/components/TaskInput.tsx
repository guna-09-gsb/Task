import React, { useState, forwardRef } from 'react';
import { Plus, Calendar, Flag, AlertCircle, X } from 'lucide-react';
import { Priority } from '../types/task';
import { getTodayDateString } from '../utils/dates';

interface TaskInputProps {
  onAddTask: (title: string, priority: Priority, dueDate?: string) => void;
}

export const TaskInput = forwardRef<HTMLInputElement, TaskInputProps>(({ onAddTask }, ref) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      // Trigger shake animation and error feedback
      setIsShaking(true);
      setErrorMessage('Please enter a task description');
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    onAddTask(trimmed, priority, dueDate ? dueDate : undefined);
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setErrorMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSetQuickDate = (type: 'today' | 'tomorrow') => {
    if (type === 'today') {
      setDueDate(getTodayDateString());
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`rounded-2xl transition-all duration-200 p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 border ${
        errorMessage 
          ? 'border-rose-400 dark:border-rose-500/80 shadow-md shadow-rose-500/10' 
          : 'border-slate-200/80 dark:border-slate-800 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
      } ${isShaking ? 'animate-task-shake' : ''}`}
    >
      {/* Primary Input Row */}
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done? (Press 'N' to focus)"
          className="flex-1 bg-transparent px-2 py-2 text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          aria-label="New task title"
        />

        <button
          type="submit"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-150 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Error message indicator */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 px-2 pt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Controls Row: Priority Selector, Date Picker, Mobile Add Button */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Priority Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mr-0.5">
            <Flag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden xs:inline">Priority:</span>
          </span>

          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            {/* Low */}
            <button
              type="button"
              onClick={() => setPriority('low')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 flex items-center gap-1.5 ${
                priority === 'low'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority === 'low' ? 'bg-white' : 'bg-emerald-500'}`} />
              <span>Low</span>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => setPriority('medium')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 flex items-center gap-1.5 ${
                priority === 'medium'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority === 'medium' ? 'bg-white' : 'bg-amber-500'}`} />
              <span>Medium</span>
            </button>

            {/* High */}
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 flex items-center gap-1.5 ${
                priority === 'high'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority === 'high' ? 'bg-white' : 'bg-rose-500'}`} />
              <span>High</span>
            </button>
          </div>
        </div>

        {/* Due Date Picker & Quick Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="relative flex items-center">
            <label
              htmlFor="task-due-date"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{dueDate ? dueDate : 'Due Date'}</span>
            </label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="sr-only"
              aria-label="Set due date"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="ml-1 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Clear date"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!dueDate && (
            <div className="hidden xs:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetQuickDate('today')}
                className="px-2 py-1 text-[11px] rounded-md text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate('tomorrow')}
                className="px-2 py-1 text-[11px] rounded-md text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                Tomorrow
              </button>
            </div>
          )}

          {/* Mobile Submit Button */}
          <button
            type="submit"
            className="sm:hidden flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-600 active:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </form>
  );
});

TaskInput.displayName = 'TaskInput';
