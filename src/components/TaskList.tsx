import React, { useState } from 'react';
import { Task, Priority } from '../types/task';
import { TaskItem } from './TaskItem';
import { Sparkles, SearchX, CheckCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (taskId: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, title: string, priority: Priority, dueDate?: string) => void;
  onReorderTasks: (startIndex: number, endIndex: number) => void;
  totalTaskCount: number;
  hasFiltersApplied: boolean;
  onResetFilters: () => void;
  onQuickAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
  onReorderTasks,
  totalTaskCount,
  hasFiltersApplied,
  onResetFilters,
  onQuickAddTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const sourceIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      onReorderTasks(sourceIndex, targetIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  // State 1: Completely empty list (no tasks at all in the system)
  if (totalTaskCount === 0) {
    return (
      <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
        {/* Friendly SVG Illustration */}
        <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-emerald-500/20 blur-xl animate-pulse" />
          <svg
            className="w-36 h-36 relative drop-shadow-md"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Clipboard backdrop */}
            <rect x="45" y="35" width="110" height="140" rx="20" fill="currentColor" className="text-white dark:text-slate-800" />
            <rect x="45" y="35" width="110" height="140" rx="20" stroke="currentColor" strokeWidth="3" className="text-indigo-200 dark:text-slate-700" />
            
            {/* Clipboard clip */}
            <rect x="75" y="24" width="50" height="22" rx="7" fill="currentColor" className="text-indigo-600 dark:text-indigo-500" />
            <circle cx="100" cy="35" r="4" fill="white" />
            
            {/* Checkmark circle badge */}
            <circle cx="138" cy="145" r="24" fill="#10B981" />
            <path
              d="M128 145L135 152L149 138"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Sun rays or sparkles */}
            <circle cx="65" cy="75" r="3" fill="#6366F1" />
            <circle cx="145" cy="65" r="4" fill="#F59E0B" />
            <circle cx="55" cy="130" r="3" fill="#EC4899" />
            
            {/* Relaxed smiling face inside */}
            <path d="M85 95Q100 110 115 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-indigo-500 dark:text-indigo-400" />
            <circle cx="85" cy="80" r="4" fill="currentColor" className="text-slate-700 dark:text-slate-300" />
            <circle cx="115" cy="80" r="4" fill="currentColor" className="text-slate-700 dark:text-slate-300" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Nothing to do. Enjoy your day!
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Your task queue is completely clear. Take a deep breath, relax, or add a task whenever inspiration strikes.
        </p>

        <button
          type="button"
          onClick={onQuickAddTask}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Create your first task</span>
        </button>
      </div>
    );
  }

  // State 2: Filters or search yielded no results
  if (tasks.length === 0 && hasFiltersApplied) {
    return (
      <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No matching tasks found
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          We couldn't find any tasks matching your active filters or search terms.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Reset filters & search
        </button>
      </div>
    );
  }

  // State 3: Active tasks list
  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          onSelect={onSelectTask}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragging={draggedTaskId === task.id}
        />
      ))}
    </div>
  );
};
