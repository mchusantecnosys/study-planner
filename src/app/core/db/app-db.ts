import Dexie, { type Table } from 'dexie';
import { Task, TaskPriority, TaskType } from '../models/task.model';

export type SyncStateLocal = 'synced' | 'pending_upload' | 'pending_delete';

export interface TaskRecord {
  id: string;
  userId: string;
  title: string;
  course: string;
  type: TaskType;
  dueDate: string; // Strictly "YYYY-MM-DD"
  time?: string;
  completed: boolean;
  completedAt?: string | null;
  priority: TaskPriority;
  notes?: string;
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
  _syncStatus: SyncStateLocal;
}

export class AppDatabase extends Dexie {
  tasks!: Table<TaskRecord, string>;

  constructor() {
    super('StudyPlannerDB');
    this.version(1).stores({
      tasks: 'id, userId, dueDate, completed, type, _syncStatus, updatedAt, [userId+dueDate], [userId+completed]',
    });
  }
}

// Singleton database instance
export const appDb = new AppDatabase();

/**
 * Helper to convert between Task and TaskRecord
 */
export function toTask(record: TaskRecord): Task {
  return {
    id: record.id,
    title: record.title,
    course: record.course,
    type: record.type,
    dueDate: record.dueDate,
    time: record.time,
    completed: record.completed,
    completedAt: record.completedAt,
    priority: record.priority,
    notes: record.notes,
    estimatedHours: record.estimatedHours,
    createdAt: record.createdAt,
  };
}

export function toRecord(task: Task, userId: string, syncStatus: SyncStateLocal = 'pending_upload'): TaskRecord {
  return {
    id: task.id,
    userId,
    title: task.title,
    course: task.course,
    type: task.type,
    dueDate: task.dueDate,
    time: task.time,
    completed: task.completed,
    completedAt: task.completedAt,
    priority: task.priority,
    notes: task.notes,
    estimatedHours: task.estimatedHours,
    createdAt: task.createdAt,
    updatedAt: new Date().toISOString(),
    _syncStatus: syncStatus,
  };
}
