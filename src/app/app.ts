import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from './core/models/task.model';
import { TaskService } from './core/services/task.service';
import { AuthGate } from './features/auth/auth-gate';
import { CalendarView } from './features/calendar/calendar-view';
import { EditorialSidebar } from './features/sidebar/editorial-sidebar';
import { QuickAdd } from './features/tasks/quick-add';
import { TaskList } from './features/tasks/task-list';
import { TaskModal } from './features/tasks/task-modal';
import { formatDisplayDate, getTodayISO } from './lib/dates';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    AuthGate,
    EditorialSidebar,
    CalendarView,
    TaskList,
    QuickAdd,
    TaskModal,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private taskService = inject(TaskService);

  readonly currentView = this.taskService.currentView;
  readonly courses = this.taskService.uniqueCourses;
  readonly filter = this.taskService.filter;
  readonly syncState = this.taskService.syncState;
  readonly currentUser = this.taskService.currentUser;
  readonly isAuthLoading = this.taskService.isAuthLoading;

  readonly isModalOpen = signal<boolean>(false);
  readonly taskToEdit = signal<Task | null>(null);
  readonly modalPresetDate = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly todayFormatted = computed(() => {
    const today = getTodayISO();
    return formatDisplayDate(today, { includeDayName: true });
  });

  async triggerBackup(): Promise<void> {
    await this.taskService.backupAllTasksToCloud();
    this.showToast('Copia de respaldo sincronizada con Firebase');
  }

  async signInGoogle(): Promise<void> {
    await this.taskService.firebaseService.signInWithGoogle();
    this.showToast('Sesión iniciada con Google en Firebase');
  }

  async signOutAccount(): Promise<void> {
    await this.taskService.firebaseService.signOutUser();
    this.showToast('Sesión de Google cerrada');
  }

  setView(view: 'list' | 'week' | 'month'): void {
    this.taskService.setView(view);
  }

  toggleCourse(course: string): void {
    const current = this.filter().course;
    if (current.toLowerCase() === course.toLowerCase()) {
      this.taskService.updateFilter({ course: 'all' });
    } else {
      this.taskService.updateFilter({ course });
    }
  }

  getCourseDot(course: string): string {
    return this.taskService.getCourseColor(course);
  }

  openNewTaskModal(presetDate?: string): void {
    this.taskToEdit.set(null);
    this.modalPresetDate.set(presetDate || null);
    this.isModalOpen.set(true);
  }

  openEditTaskModal(task: Task): void {
    this.taskToEdit.set(task);
    this.modalPresetDate.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.taskToEdit.set(null);
    this.modalPresetDate.set(null);
  }

  onTaskSaved(task: Task): void {
    this.showToast(`Guardado: ${task.title}`);
  }

  exportCalendar(): void {
    this.taskService.exportToICS();
    this.showToast('Calendario académico exportado (.ICS)');
  }

  async resetData(): Promise<void> {
    if (confirm('¿Restaurar los apuntes y tareas de ejemplo?')) {
      await this.taskService.resetToSampleData();
      this.showToast('Datos de ejemplo restaurados');
    }
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
