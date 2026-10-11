export type TaskType = 'assignment' | 'exam';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  dueDate: string; // Strictly "YYYY-MM-DD"
  time?: string; // Optional "HH:mm"
  completed: boolean;
  completedAt?: string | null;
  priority: TaskPriority;
  notes?: string;
  estimatedHours?: number;
  createdAt: string;
}

export interface TaskCreateInput {
  title: string;
  course: string;
  type: TaskType;
  dueDate: string; // "YYYY-MM-DD"
  time?: string;
  priority: TaskPriority;
  notes?: string;
  estimatedHours?: number;
}

export interface TaskFilter {
  type: 'all' | TaskType;
  status: 'all' | 'pending' | 'completed' | 'overdue';
  course: string;
  search: string;
}

export interface DayCalendarCell {
  dateStr: string; // "YYYY-MM-DD"
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  tasks: Task[];
}
