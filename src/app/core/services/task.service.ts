import { Injectable, computed, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskCreateInput, TaskFilter, TaskType } from '../models/task.model';
import {
  buildWeekDays,
  compareDateStrings,
  diffInDays,
  getTodayISO,
  isDatePast,
} from '../../lib/dates';
import { FirebaseService } from './firebase.service';
import { appDb, toRecord, toTask } from '../db/app-db';

const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 'task-demo-1',
    title: 'Examen Parcial de Cálculo Diferencial e Integral',
    course: 'Cálculo II',
    type: 'exam',
    dueDate: '2026-10-12',
    time: '09:00',
    completed: false,
    priority: 'high',
    notes: 'Series de Taylor, Integrales dobles y cambio de variable. Traer calculadora no programable.',
    estimatedHours: 8,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'task-demo-2',
    title: 'Entrega de Taller: Estructuras de Datos Avanzadas',
    course: 'Algoritmos y Estructuras',
    type: 'assignment',
    dueDate: '2026-10-11',
    time: '23:59',
    completed: false,
    priority: 'high',
    notes: 'Implementación de Árboles AVL y Grafos con pruebas unitarias.',
    estimatedHours: 5,
    createdAt: '2026-10-02T14:30:00Z',
  },
  {
    id: 'task-demo-3',
    title: 'Ensayo Crítico sobre Arquitectura Local-First',
    course: 'Ingeniería de Software',
    type: 'assignment',
    dueDate: '2026-10-15',
    time: '18:00',
    completed: false,
    priority: 'medium',
    notes: 'Mínimo 2000 palabras analizando Dexie.js + Firestore y desacoplamiento de capas.',
    estimatedHours: 4,
    createdAt: '2026-10-03T11:00:00Z',
  },
  {
    id: 'task-demo-4',
    title: 'Examen Teórico de Bases de Datos Relacionales',
    course: 'Bases de Datos',
    type: 'exam',
    dueDate: '2026-10-19',
    time: '11:00',
    completed: false,
    priority: 'high',
    notes: 'Normalización 3FN/Boyce-Codd, álgebra relacional y diseño de índices B-Tree.',
    estimatedHours: 6,
    createdAt: '2026-10-04T09:15:00Z',
  },
  {
    id: 'task-demo-5',
    title: 'Laboratorio: Configuración de Redes y Subnetting',
    course: 'Redes de Computadores',
    type: 'assignment',
    dueDate: '2026-10-10',
    time: '16:00',
    completed: true,
    completedAt: '2026-10-09T20:10:00Z',
    priority: 'medium',
    notes: 'Topología con router Cisco Packet Tracer y enrutamiento OSPF configurado.',
    estimatedHours: 3,
    createdAt: '2026-09-28T16:00:00Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  readonly firebaseService = inject(FirebaseService);

  // State signals
  private tasksSignal = signal<Task[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedDate = signal<string>(getTodayISO());
  readonly currentView = signal<'list' | 'week' | 'month'>('list');

  // Cloud sync signals exposed
  readonly syncState = this.firebaseService.syncState;
  readonly currentUser = this.firebaseService.currentUser;
  readonly isAuthLoading = this.firebaseService.isAuthLoading;

  readonly filter = signal<TaskFilter>({
    type: 'all',
    status: 'all',
    course: 'all',
    search: '',
  });

  // Public readonly access
  readonly tasks = this.tasksSignal.asReadonly();

  // Nearest upcoming exam
  readonly nextExam = computed(() => {
    const list = this.tasksSignal();
    const today = getTodayISO();
    const futureExams = list
      .filter((t) => t.type === 'exam' && !t.completed && compareDateStrings(t.dueDate, today) >= 0)
      .sort((a, b) => compareDateStrings(a.dueDate, b.dueDate));
    if (futureExams.length === 0) return null;
    const exam = futureExams[0];
    const daysLeft = diffInDays(today, exam.dueDate);
    return {
      exam,
      daysLeft,
    };
  });

  // Weekly load distribution (Monday to Sunday)
  readonly weeklyDistribution = computed(() => {
    const today = getTodayISO();
    const weekDays = buildWeekDays(today);
    const map = this.tasksByDate();
    const counts = weekDays.map((d) => (map.get(d.dateStr) || []).length);
    const maxTasks = Math.max(1, ...counts);
    return weekDays.map((d) => {
      const tasks = map.get(d.dateStr) || [];
      const hasExam = tasks.some((t) => t.type === 'exam' && !t.completed);
      return {
        ...d,
        count: tasks.length,
        hasExam,
        heightPct: tasks.length > 0 ? Math.max(16, Math.round((tasks.length / maxTasks) * 100)) : 8,
      };
    });
  });

  // Derived computations
  readonly uniqueCourses = computed(() => {
    const list = this.tasksSignal();
    const courses = new Set<string>();
    for (const t of list) {
      if (t.course) courses.add(t.course);
    }
    return Array.from(courses).sort();
  });

  readonly tasksByDate = computed(() => {
    const map = new Map<string, Task[]>();
    for (const task of this.tasksSignal()) {
      const existing = map.get(task.dueDate) || [];
      existing.push(task);
      map.set(task.dueDate, existing);
    }
    return map;
  });

  readonly filteredTasks = computed(() => {
    const all = this.tasksSignal();
    const f = this.filter();
    const query = f.search.trim().toLowerCase();
    const today = getTodayISO();

    return all.filter((t) => {
      if (f.type !== 'all' && t.type !== f.type) return false;
      if (f.course !== 'all' && t.course.toLowerCase() !== f.course.toLowerCase()) return false;
      if (f.status === 'pending' && t.completed) return false;
      if (f.status === 'completed' && !t.completed) return false;
      if (f.status === 'overdue') {
        const isOverdue = !t.completed && compareDateStrings(t.dueDate, today) < 0;
        if (!isOverdue) return false;
      }
      if (query) {
        const titleMatch = t.title.toLowerCase().includes(query);
        const courseMatch = t.course.toLowerCase().includes(query);
        const notesMatch = t.notes?.toLowerCase().includes(query) ?? false;
        if (!titleMatch && !courseMatch && !notesMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      const cmp = compareDateStrings(a.dueDate, b.dueDate);
      if (cmp !== 0) return cmp;
      return (a.time || '').localeCompare(b.time || '');
    });
  });

  readonly selectedDateTasks = computed(() => {
    const date = this.selectedDate();
    const map = this.tasksByDate();
    return map.get(date) || [];
  });

  readonly stats = computed(() => {
    const list = this.tasksSignal();
    const today = getTodayISO();
    const total = list.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;
    let totalExams = 0;
    let totalAssignments = 0;
    let upcomingExams7Days = 0;
    let upcomingAssignments7Days = 0;

    for (const t of list) {
      if (t.type === 'exam') totalExams++;
      if (t.type === 'assignment') totalAssignments++;

      if (t.completed) {
        completed++;
      } else {
        pending++;
        const isPast = isDatePast(t.dueDate);
        if (isPast) {
          overdue++;
        } else {
          const daysLeft = diffInDays(today, t.dueDate);
          if (daysLeft >= 0 && daysLeft <= 7) {
            if (t.type === 'exam') upcomingExams7Days++;
            if (t.type === 'assignment') upcomingAssignments7Days++;
          }
        }
      }
    }

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      totalExams,
      totalAssignments,
      upcomingExams7Days,
      upcomingAssignments7Days,
      rate,
    };
  });

  constructor() {
    // Watch authenticated user and switch Local-First tenant
    effect(() => {
      const user = this.firebaseService.currentUser();
      if (user) {
        this.loadUserTasksFromDexieAndCloud(user.uid);
      } else {
        // User logged out: clear memory immediately
        this.tasksSignal.set([]);
      }
    });
  }

  /**
   * Local-First hydration: Loads from Dexie in 0 ms, then hydrates/syncs with Firestore
   */
  private async loadUserTasksFromDexieAndCloud(userId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      // 1. Instant local read from Dexie (0ms latency, offline-ready)
      if (typeof window !== 'undefined') {
        const localRecords = await appDb.tasks.where('userId').equals(userId).toArray();
        if (localRecords.length > 0) {
          this.tasksSignal.set(localRecords.map(toTask));
        }
      }

      // 2. Subscribe to background sync from Firestore
      const unsubscribe = this.firebaseService.subscribeToUserTasks(async (cloudTasks) => {
        if (cloudTasks && cloudTasks.length > 0) {
          // Replicate cloud tasks to Dexie
          for (const t of cloudTasks) {
            await appDb.tasks.put(toRecord(t, userId, 'synced'));
          }
          const freshRecords = await appDb.tasks.where('userId').equals(userId).toArray();
          this.tasksSignal.set(freshRecords.map(toTask));
        } else {
          // Cloud has no tasks for this user: check if local has tasks to backup
          const localCount = await appDb.tasks.where('userId').equals(userId).count();
          if (localCount === 0) {
            // First time user: seed starter tasks in Dexie and push to Firestore
            const starterTasks = INITIAL_DEMO_TASKS.map((t) => ({
              ...t,
              id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            }));
            for (const t of starterTasks) {
              await appDb.tasks.put(toRecord(t, userId, 'pending_upload'));
            }
            this.tasksSignal.set(starterTasks);
            await this.firebaseService.backupAllTasks(starterTasks);
          } else {
            const freshRecords = await appDb.tasks.where('userId').equals(userId).toArray();
            await this.firebaseService.backupAllTasks(freshRecords.map(toTask));
          }
        }
      });

      // Keep cleanup available if user signs out
      this.activeSyncUnsubscribe = unsubscribe;
    } catch (err) {
      console.warn('Local-First load error:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  private activeSyncUnsubscribe: (() => void) | null = null;

  /**
   * Local-First Create: Writes immediately to Dexie (0ms), then replicates to Firestore in background
   */
  async createTask(input: TaskCreateInput): Promise<Task> {
    const user = this.firebaseService.currentUser();
    const userId = user?.uid || 'local-guest';

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: input.title.trim(),
      course: input.course.trim(),
      type: input.type,
      dueDate: input.dueDate,
      time: input.time || undefined,
      completed: false,
      priority: input.priority,
      notes: input.notes?.trim() || undefined,
      estimatedHours: input.estimatedHours,
      createdAt: new Date().toISOString(),
    };

    // 1. Instant local write to Dexie
    if (typeof window !== 'undefined') {
      await appDb.tasks.put(toRecord(newTask, userId, 'pending_upload'));
    }

    // 2. Instant reactive signal update
    this.tasksSignal.update((list) => [...list, newTask]);

    // 3. Background cloud push (Fire and forget, non-blocking)
    if (user) {
      this.firebaseService.saveTaskToCloud(newTask).then(async () => {
        if (typeof window !== 'undefined') {
          await appDb.tasks.update(newTask.id, { _syncStatus: 'synced' });
        }
      });
    }

    return newTask;
  }

  /**
   * Local-First Update: Updates Dexie in 0ms, then replicates to Firestore in background
   */
  async updateTask(id: string, changes: Partial<Task>): Promise<void> {
    const user = this.firebaseService.currentUser();
    let updatedTask: Task | undefined;

    this.tasksSignal.update((list) =>
      list.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...changes };
        if (changes.completed !== undefined) {
          updated.completedAt = changes.completed ? new Date().toISOString() : null;
        }
        updatedTask = updated;
        return updated;
      })
    );

    // 1. Instant Dexie write
    if (typeof window !== 'undefined') {
      await appDb.tasks.update(id, {
        ...changes,
        updatedAt: new Date().toISOString(),
        _syncStatus: 'pending_upload',
      });
    }

    // 2. Background cloud replication
    if (user && updatedTask) {
      this.firebaseService.saveTaskToCloud(updatedTask).then(async () => {
        if (typeof window !== 'undefined') {
          await appDb.tasks.update(id, { _syncStatus: 'synced' });
        }
      });
    }
  }

  async toggleTaskCompletion(id: string): Promise<void> {
    const task = this.tasksSignal().find((t) => t.id === id);
    if (!task) return;
    await this.updateTask(id, { completed: !task.completed });
  }

  /**
   * Local-First Delete: Deletes from Dexie in 0ms, then deletes in Firestore
   */
  async deleteTask(id: string): Promise<void> {
    const user = this.firebaseService.currentUser();

    // 1. Instant Dexie delete
    if (typeof window !== 'undefined') {
      await appDb.tasks.delete(id);
    }

    // 2. Instant signal update
    this.tasksSignal.update((list) => list.filter((t) => t.id !== id));

    // 3. Background cloud deletion
    if (user) {
      this.firebaseService.deleteTaskFromCloud(id);
    }
  }

  async backupAllTasksToCloud(): Promise<void> {
    await this.firebaseService.backupAllTasks(this.tasksSignal());
  }

  async resetToSampleData(): Promise<void> {
    const user = this.firebaseService.currentUser();
    const userId = user?.uid || 'local-guest';

    if (typeof window !== 'undefined') {
      await appDb.tasks.where('userId').equals(userId).delete();
      for (const t of INITIAL_DEMO_TASKS) {
        await appDb.tasks.put(toRecord(t, userId, 'pending_upload'));
      }
    }

    this.tasksSignal.set(INITIAL_DEMO_TASKS);
    if (user) {
      await this.firebaseService.backupAllTasks(INITIAL_DEMO_TASKS);
    }
  }

  setSelectedDate(dateStr: string): void {
    this.selectedDate.set(dateStr);
  }

  setView(view: 'list' | 'week' | 'month'): void {
    this.currentView.set(view);
  }

  getCourseColor(courseName: string): string {
    const palette = [
      'var(--course-blue)',
      'var(--course-ochre-rust)',
      'var(--course-violet)',
      'var(--course-teal)',
      'var(--course-gold)',
    ];
    if (!courseName) return palette[0];
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = (hash << 5) - hash + courseName.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % palette.length;
    return palette[idx];
  }

  async quickAddTodayTask(title: string, course?: string, type?: TaskType): Promise<Task | null> {
    const trimmed = title.trim();
    if (!trimmed) return null;
    const defaultCourse = course?.trim() || this.uniqueCourses()[0] || 'General';
    return this.createTask({
      title: trimmed,
      course: defaultCourse,
      type: type || 'assignment',
      dueDate: getTodayISO(),
      priority: 'medium',
    });
  }

  updateFilter(partial: Partial<TaskFilter>): void {
    this.filter.update((cur) => ({ ...cur, ...partial }));
  }

  resetFilter(): void {
    this.filter.set({
      type: 'all',
      status: 'all',
      course: 'all',
      search: '',
    });
  }

  exportToICS(): void {
    if (typeof window === 'undefined') return;
    const tasks = this.tasksSignal();
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StudyPlanner//Academic Tasks Calendar//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:StudyPlanner - Tareas y Exámenes',
      'X-WR-TIMEZONE:UTC',
    ];

    for (const t of tasks) {
      const cleanDate = t.dueDate.replace(/-/g, '');
      const uid = `${t.id}@studyplanner.app`;
      const summaryPrefix = t.type === 'exam' ? '📝 [EXAMEN] ' : '📚 [DEBER] ';
      const summary = `${summaryPrefix}${t.title} (${t.course})`;
      const desc = (t.notes || `Tarea de ${t.course}`).replace(/\n/g, '\\n');

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${cleanDate}T000000Z`);
      if (t.time) {
        const [h, m] = t.time.split(':');
        lines.push(`DTSTART:${cleanDate}T${h}${m}00Z`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      }
      lines.push(`SUMMARY:${summary}`);
      lines.push(`DESCRIPTION:${desc}`);
      lines.push(`STATUS:${t.completed ? 'COMPLETED' : 'CONFIRMED'}`);
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `StudyPlanner_Tareas_${getTodayISO()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
