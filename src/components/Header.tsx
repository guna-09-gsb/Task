import React from 'react';
import { 
  CheckCircle2, 
  Sun, 
  Moon, 
  Keyboard, 
  Sunset, 
  Sunrise, 
  RotateCcw 
} from 'lucide-react';
import { formatHeaderDate, getGreeting } from '../utils/dates';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenShortcuts: () => void;
  onResetSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenShortcuts,
  onResetSampleData,
}) => {
  const greeting = getGreeting();
  const dateFormatted = formatHeaderDate();

  const renderGreetingIcon = () => {
    switch (greeting.icon) {
      case 'sun':
        return <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'sunset':
        return <Sunset className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-indigo-400 shrink-0" />;
      default:
        return <Sun className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <header className="pb-6 border-b border-slate-200/50 dark:border-slate-800/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-white/40 dark:ring-white/10 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                Taskly
              </h1>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/70 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                Workspace
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                {renderGreetingIcon()}
                <span>{greeting.text}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="truncate">{dateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onResetSampleData}
            title="Reset sample tasks"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Reset starter tasks"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts (Press ?)"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
