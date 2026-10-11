import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import {
  diffInDays,
  getTodayISO,
  isDatePast,
} from '../../lib/dates';
import { QuickAdd } from './quick-add';
import { TaskRow } from './task-row';

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuickAdd, TaskRow],
  template: `
    <div class="space-y-6">
      <!-- 1. Quick Add Field (Surface background, line border) -->
      <app-quick-add></app-quick-add>

      <!-- 2. Task Groups: Atrasadas -> Hoy -> Esta Semana -> Más Adelante -> Completadas -->
      <div class="space-y-2">
        <!-- GROUP A: Atrasadas -->
        @if (overdueTasks().length > 0) {
          <section class="mt-8 first:mt-2">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-signal)]">
                Atrasadas
              </h2>
              <span class="text-[0.8125rem] font-semibold text-[var(--color-signal)] tabular-nums">
                {{ overdueTasks().length }}
              </span>
            </div>
            <div class="border-t border-[var(--color-line)]">
              @for (task of overdueTasks(); track task.id) {
                <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
              }
            </div>
          </section>
        }

        <!-- GROUP B: Hoy -->
        <section class="mt-10 first:mt-2">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink)]">
              Hoy
            </h2>
            <span class="text-[0.8125rem] text-[var(--color-ink-muted)] tabular-nums">
              {{ todayTasks().length }}
            </span>
          </div>
          <div class="border-t border-[var(--color-line)]">
            @for (task of todayTasks(); track task.id) {
              <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
            } @empty {
              <div class="py-5 text-[0.875rem] text-[var(--color-ink-muted)] border-b border-[var(--color-line)]">
                Sin tareas pendientes para hoy. Puedes capturar una arriba.
              </div>
            }
          </div>
        </section>

        <!-- GROUP C: Esta Semana -->
        @if (thisWeekTasks().length > 0) {
          <section class="mt-10">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                Esta Semana
              </h2>
              <span class="text-[0.8125rem] text-[var(--color-ink-muted)] tabular-nums">
                {{ thisWeekTasks().length }}
              </span>
            </div>
            <div class="border-t border-[var(--color-line)]">
              @for (task of thisWeekTasks(); track task.id) {
                <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
              }
            </div>
          </section>
        }

        <!-- GROUP D: Más Adelante -->
        @if (laterTasks().length > 0) {
          <section class="mt-10">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                Más Adelante
              </h2>
              <span class="text-[0.8125rem] text-[var(--color-ink-muted)] tabular-nums">
                {{ laterTasks().length }}
              </span>
            </div>
            <div class="border-t border-[var(--color-line)]">
              @for (task of laterTasks(); track task.id) {
                <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
              }
            </div>
          </section>
        }

        <!-- GROUP E: Completadas -->
        @if (completedTasks().length > 0) {
          <section class="mt-10">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                Completadas
              </h2>
              <span class="text-[0.8125rem] text-[var(--color-ink-muted)] tabular-nums">
                {{ completedTasks().length }}
              </span>
            </div>
            <div class="border-t border-[var(--color-line)]">
              @for (task of completedTasks(); track task.id) {
                <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class TaskList {
  private taskService = inject(TaskService);

  readonly addTask = output<void>();
  readonly editTask = output<Task>();

  readonly allFiltered = this.taskService.filteredTasks;

  readonly overdueTasks = computed(() => {
    return this.allFiltered().filter(
      (t) => !t.completed && isDatePast(t.dueDate)
    );
  });

  readonly todayTasks = computed(() => {
    const today = getTodayISO();
    return this.allFiltered().filter(
      (t) => !t.completed && t.dueDate === today
    );
  });

  readonly thisWeekTasks = computed(() => {
    const today = getTodayISO();
    return this.allFiltered().filter((t) => {
      if (t.completed) return false;
      const diff = diffInDays(today, t.dueDate);
      return diff > 0 && diff <= 7;
    });
  });

  readonly laterTasks = computed(() => {
    const today = getTodayISO();
    return this.allFiltered().filter((t) => {
      if (t.completed) return false;
      const diff = diffInDays(today, t.dueDate);
      return diff > 7;
    });
  });

  readonly completedTasks = computed(() => {
    return this.allFiltered().filter((t) => t.completed);
  });
}
