/**
 * Taskly - Modern Task Management App
 * Features frosted glassmorphism, priority tagging, confetti celebrations,
 * local storage persistence, keyboard shortcuts, and responsive layout.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Task, Priority, FilterStatus, SortOption } from './types/task';
import { getInitialTasks } from './utils/sampleData';
import { fireTaskConfetti, fireGrandCelebration } from './utils/confetti';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { TaskInput } from './components/TaskInput';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { ShortcutsModal } from './components/ShortcutsModal';

const STORAGE_KEY_TASKS = 'taskly_tasks_v1';
const STORAGE_KEY_THEME = 'taskly_theme_mode';

export default function App() {
  // Theme state: dark mode default with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      return true; // Default to sleek dark glass theme
    } catch {
      return true;
    }
  });

  // Apply .dark class to root html element for Tailwind v4 custom dark variant
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored tasks', e);
    }
    return getInitialTasks();
  });

  // Persist tasks whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  // Filter, search & sort states
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Reference to task input for keyboard shortcut 'N'
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea or select
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;

      // 'N' focuses the new task input
      if ((e.key === 'n' || e.key === 'N') && !isInputActive && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        taskInputRef.current?.focus();
        return;
      }

      // '?' opens shortcuts modal
      if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 'Escape' closes modal or deselects
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
        } else {
          setSelectedTaskId(null);
        }
        return;
      }

      // 'Delete' removes selected task
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputActive && selectedTaskId) {
        e.preventDefault();
        handleDeleteTask(selectedTaskId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, isShortcutsOpen]);

  // Task actions
  const handleAddTask = (title: string, priority: Priority, dueDate?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleComplete = useCallback((taskId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setTasks((prevTasks) => {
      const target = prevTasks.find((t) => t.id === taskId);
      const isNowCompleted = !target?.completed;

      // Fire celebratory confetti on completion
      if (isNowCompleted) {
        const rect = e.currentTarget.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;
        fireTaskConfetti(originX, originY);

        // Check if all remaining tasks are now complete
        const remainingUnfinished = prevTasks.filter((t) => t.id !== taskId && !t.completed).length;
        if (remainingUnfinished === 0 && prevTasks.length > 1) {
          setTimeout(() => fireGrandCelebration(), 300);
        }
      }

      return prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: isNowCompleted,
              completedAt: isNowCompleted ? Date.now() : undefined,
            }
          : task
      );
    });
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskId((prev) => (prev === taskId ? null : prev));
  }, []);

  const handleUpdateTask = useCallback(
    (taskId: string, title: string, priority: Priority, dueDate?: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                title,
                priority,
                dueDate,
              }
            : t
        )
      );
    },
    []
  );

  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    setSelectedTaskId(null);
  }, []);

  const handleResetSampleData = useCallback(() => {
    setTasks(getInitialTasks());
    setSelectedTaskId(null);
  }, []);

  const handleReorderTasks = useCallback((sourceIndex: number, targetIndex: number) => {
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }, []);

  // Filter counts
  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return {
      all: tasks.length,
      active: tasks.length - completed,
      completed,
    };
  }, [tasks]);

  // Filtered & Sorted task list
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab Filter
        if (filter === 'active' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;

        // Search Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          return task.title.toLowerCase().includes(query);
        }

        return true;
      })
      .sort((a, b) => {
        // Sort Option
        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'oldest') {
          return a.createdAt - b.createdAt;
        }
        if (sortBy === 'priority') {
          const priorityScore = { high: 3, medium: 2, low: 1 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        return 0;
      });
  }, [tasks, filter, searchQuery, sortBy]);

  const hasFiltersApplied = filter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Soft gradient background (deep indigo to purple) */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${
          darkMode
            ? 'bg-gradient-to-br from-[#0c0e29] via-[#141235] to-[#251347]'
            : 'bg-gradient-to-br from-indigo-100/90 via-purple-100/70 to-slate-100'
        }`}
      />

      {/* Decorative ambient atmospheric glow spots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/20'
          }`}
        />
        <div 
          className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-purple-600/20' : 'bg-purple-400/20'
          }`}
        />
        <div 
          className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-indigo-800/15' : 'bg-indigo-300/25'
          }`}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Centered Glass-Style Card */}
        <main
          className="backdrop-blur-2xl bg-white/80 dark:bg-slate-900/75 border border-white/60 dark:border-white/10 rounded-3xl p-5 sm:p-8 md:p-9 shadow-2xl shadow-indigo-950/20 dark:shadow-black/60 transition-all duration-300"
        >
          {/* Header Section */}
          <Header
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onResetSampleData={handleResetSampleData}
          />

          <div className="mt-6 space-y-6">
            {/* Progress Bar Section */}
            <ProgressBar
              completedCount={counts.completed}
              totalCount={counts.all}
            />

            {/* Add Task Input Section */}
            <TaskInput
              ref={taskInputRef}
              onAddTask={handleAddTask}
            />

            {/* Filter & Organization Controls */}
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
              onClearCompleted={handleClearCompleted}
            />

            {/* Task Cards List */}
            <TaskList
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={(id) => setSelectedTaskId(id)}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onReorderTasks={handleReorderTasks}
              totalTaskCount={tasks.length}
              hasFiltersApplied={hasFiltersApplied}
              onResetFilters={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              onQuickAddTask={() => {
                taskInputRef.current?.focus();
              }}
            />
          </div>

          {/* Bottom Footer Details */}
          <footer className="mt-8 pt-5 border-t border-slate-200/50 dark:border-slate-800/60 flex flex-col xs:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Taskly</span>
              <span>·</span>
              <span>Local storage auto-sync</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Shortcuts</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ?
                </kbd>
              </button>
              <span>·</span>
              <span>Double click any task to edit</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
