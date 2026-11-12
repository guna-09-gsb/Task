import React from 'react';
import { Search, ArrowUpDown, Trash2, X } from 'lucide-react';
import { FilterStatus, SortOption } from '../types/task';

interface TaskFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
  onClearCompleted,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Bar + Sort & Clear Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200/60 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150"
            aria-label="Search tasks by name"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Clear Completed */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <label htmlFor="task-sort-select" className="sr-only">
              Sort tasks
            </label>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <select
                id="task-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  Newest
                </option>
                <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  Oldest
                </option>
                <option value="priority" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  Priority
                </option>
                <option value="dueDate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  Due Date
                </option>
              </select>
            </div>
          </div>

          {/* Clear Completed Button */}
          {counts.completed > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-950/70 rounded-xl border border-rose-200/50 dark:border-rose-900/40 transition-all duration-150 cursor-pointer shrink-0"
              title="Delete all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Clear done</span>
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-rose-200/60 dark:bg-rose-900/60 tabular-nums">
                {counts.completed}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (All, Active, Completed) */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
          {/* All */}
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>All</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
              filter === 'all' 
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' 
                : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}>
              {counts.all}
            </span>
          </button>

          {/* Active */}
          <button
            type="button"
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              filter === 'active'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>Active</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
              filter === 'active' 
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' 
                : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}>
              {counts.active}
            </span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>Completed</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
              filter === 'completed' 
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' 
                : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}>
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Quick hint for drag-and-drop */}
        <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Drag cards to reorder
        </span>
      </div>
    </div>
  );
};
