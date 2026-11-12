import { Task } from '../types/task';
import { getTodayDateString } from './dates';

export function getInitialTasks(): Task[] {
  const today = getTodayDateString();
  const now = Date.now();

  // Create tomorrow string
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  // Create yesterday string for realistic overdue example
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Review quarterly product roadmap with engineering',
      completed: false,
      priority: 'high',
      dueDate: today,
      createdAt: now - 3600000 * 2,
    },
    {
      id: 'task-2',
      title: 'Submit updated wireframes and design system tokens',
      completed: false,
      priority: 'medium',
      dueDate: tomorrow,
      createdAt: now - 3600000 * 4,
    },
    {
      id: 'task-3',
      title: 'Follow up with beta testers feedback',
      completed: true,
      priority: 'low',
      dueDate: yesterday,
      createdAt: now - 86400000,
      completedAt: now - 1800000,
    },
    {
      id: 'task-4',
      title: 'Schedule quarterly team reflection session',
      completed: false,
      priority: 'low',
      createdAt: now - 86400000 * 2,
    },
  ];
}
