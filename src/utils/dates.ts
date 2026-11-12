/**
 * Date utilities for Taskly
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatHeaderDate(): string {
  const now = new Date();
  return now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getGreeting(): { text: string; icon: 'sun' | 'sun-dim' | 'sunset' | 'moon' } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning!', icon: 'sun' };
  }
  if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon!', icon: 'sun-dim' };
  }
  if (hour >= 17 && hour < 22) {
    return { text: 'Good evening!', icon: 'sunset' };
  }
  return { text: 'Good night!', icon: 'moon' };
}

export function isOverdue(dueDate?: string, completed?: boolean): boolean {
  if (!dueDate || completed) return false;
  const today = getTodayDateString();
  return dueDate < today;
}

export function isDueToday(dueDate?: string): boolean {
  if (!dueDate) return false;
  return dueDate === getTodayDateString();
}

export function formatDisplayDate(dueDate?: string): { label: string; isPast: boolean; isToday: boolean } {
  if (!dueDate) return { label: '', isPast: false, isToday: false };

  const todayStr = getTodayDateString();
  const [year, month, day] = dueDate.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Today', isPast: false, isToday: true };
  }
  if (diffDays === 1) {
    return { label: 'Tomorrow', isPast: false, isToday: false };
  }
  if (diffDays === -1) {
    return { label: 'Yesterday', isPast: true, isToday: false };
  }
  if (diffDays < -1) {
    return {
      label: `${Math.abs(diffDays)}d overdue`,
      isPast: true,
      isToday: false,
    };
  }

  // Format as "Nov 14" or "Nov 14, 2027"
  const isCurrentYear = year === today.getFullYear();
  const formatted = targetDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: isCurrentYear ? undefined : 'numeric',
  });

  return { label: formatted, isPast: false, isToday: false };
}
