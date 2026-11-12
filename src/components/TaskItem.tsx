import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Calendar, 
  GripVertical, 
  AlertTriangle,
  X,
  Save
} from 'lucide-react';
import { Task, Priority } from '../types/task';
import { formatDisplayDate, isOverdue } from '../utils/dates';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, title: string, priority: Priority, dueDate?: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  onToggleComplete,
  onDelete,
  onUpdate,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState<string>(task.dueDate || '');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onUpdate(task.id, trimmed, editPriority, editDueDate || undefined);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const overdue = isOverdue(task.dueDate, task.completed);
  const dateInfo = formatDisplayDate(task.dueDate);

  // Priority visual styling
  const priorityConfig = {
    high: {
      label: 'High',
      badgeBg: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/60',
      dotBg: 'bg-rose-500',
    },
    medium: {
      label: 'Medium',
      badgeBg: 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60',
      dotBg: 'bg-amber-500',
    },
    low: {
      label: 'Low',
      badgeBg: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60',
      dotBg: 'bg-emerald-500',
    },
  }[task.priority];

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(task.id)}
      className={`group relative rounded-2xl transition-all duration-200 border ${
        isDragging
          ? 'opacity-40 scale-[0.99] border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
          : isSelected
          ? 'border-indigo-400 dark:border-indigo-500/80 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-900 shadow-md'
          : 'border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300/80 dark:hover:border-slate-700 shadow-xs hover:shadow-sm'
      } ${task.completed ? 'opacity-70 dark:opacity-60' : ''}`}
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Drag Grip Handle */}
        <div 
          className="mt-0.5 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors hidden xs:block"
          title="Drag to reorder"
          aria-label="Drag handle"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Round Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id, e);
          }}
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 border cursor-pointer ${
            task.completed
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
          }`}
          aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
          role="checkbox"
          aria-checked={task.completed}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
        </button>

        {/* Main Content / Edit Mode */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Inline Edit View */
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <input
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="w-full px-3 py-1.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-indigo-400 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Task description..."
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Priority Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Priority:</span>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 text-xs font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Due Date Picker */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Due Date:</span>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 text-xs font-medium"
                  />
                  {editDueDate && (
                    <button
                      type="button"
                      onClick={() => setEditDueDate('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Save and Cancel buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Regular Display View */
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span
                  onDoubleClick={() => setIsEditing(true)}
                  className={`text-sm font-medium leading-relaxed break-words transition-all duration-200 ${
                    task.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {task.title}
                </span>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit task"
                    aria-label={`Edit task "${task.title}"`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Delete task (or press Delete when selected)"
                    aria-label={`Delete task "${task.title}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tags & Metadata Row */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                {/* Priority Tag */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] border ${priorityConfig.badgeBg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dotBg}`} />
                  <span>{priorityConfig.label}</span>
                </span>

                {/* Due Date Indicator */}
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                      task.completed
                        ? 'text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                        : overdue
                        ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 font-semibold'
                        : dateInfo.isToday
                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800/60'
                    }`}
                  >
                    {overdue && !task.completed ? (
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                    ) : (
                      <Calendar className="w-3 h-3 text-current shrink-0" />
                    )}
                    <span>{dateInfo.label}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
