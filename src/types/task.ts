export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'newest' | 'oldest' | 'priority' | 'dueDate';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
}
