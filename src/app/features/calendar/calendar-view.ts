import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import {
  CalendarGridCell,
  addDays,
  buildMonthGrid,
  buildWeekDays,
  formatDisplayDate,
  getMonthName,
  getTodayISO,
  parseDateParts,
} from '../../lib/dates';
import { TaskRow } from '../tasks/task-row';

@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SlicePipe, TaskRow],
  template: `
    <div class="space-y-8">
      <!-- 1. MONTH VIEW -->
      @if (currentView() === 'month') {
        <section class="space-y-6">
          <!-- Month Header & Navigation -->
          <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
            <h2 class="font-display text-[1.25rem] font-bold text-[var(--color-ink)] capitalize">
              {{ currentMonthLabel() }}
            </h2>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                (click)="navigateMonth(-1)"
                class="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-[8px] transition-colors cursor-pointer"
                aria-label="Mes anterior"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">chevron_left</mat-icon>
              </button>
              <button
                type="button"
                (click)="goToToday()"
                class="px-3 py-1.5 text-[0.8125rem] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] transition-colors cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                (click)="navigateMonth(1)"
                class="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-[8px] transition-colors cursor-pointer"
                aria-label="Mes siguiente"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">chevron_right</mat-icon>
              </button>
            </div>
          </div>

          <!-- Weekday Labels -->
          <div class="grid grid-cols-7 text-center pb-2">
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Lun</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Mar</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Mié</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Jue</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Vie</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Sáb</span>
            <span class="text-[0.75rem] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.06em]">Dom</span>
          </div>

          <!-- 7-Column Month Grid (52px cells, rounded-md) -->
          <div class="grid grid-cols-7 gap-1.5">
            @for (cell of monthGridCells(); track cell.dateStr) {
              <div
                role="button"
                tabindex="0"
                (click)="selectDate(cell.dateStr)"
                (keydown.enter)="selectDate(cell.dateStr)"
                (keydown.space)="selectDate(cell.dateStr)"
                [attr.aria-label]="getAccessibleCellLabel(cell)"
                class="h-[52px] rounded-[8px] p-1.5 flex flex-col justify-between transition-all cursor-pointer relative border"
                [class.bg-[var(--color-paper)]]="cell.dateStr !== selectedDate()"
                [class.bg-[var(--color-surface)]]="cell.dateStr === selectedDate()"
                [class.border-[var(--color-ink)]]="cell.dateStr === selectedDate()"
                [class.border-transparent]="cell.dateStr !== selectedDate()"
                [class.opacity-40]="!cell.isCurrentMonth"
              >
                <!-- Number -->
                <div class="flex items-center justify-between w-full">
                  <span
                    class="text-[0.8125rem] tabular-nums"
                    [class.text-[var(--color-signal)]]="cell.isToday"
                    [class.font-bold]="cell.isToday"
                    [class.text-[var(--color-ink)]]="!cell.isToday && cell.isCurrentMonth"
                    [class.text-[var(--color-ink-muted)]]="!cell.isCurrentMonth"
                  >
                    {{ cell.day }}
                  </span>
                </div>

                <!-- Up to 3 course dots & Exam Underline -->
                <div class="flex items-center gap-1 overflow-hidden h-2">
                  @for (task of getTasksForDate(cell.dateStr) | slice:0:3; track task.id) {
                    <span
                      class="w-1.5 h-1.5 rounded-full shrink-0"
                      [style.backgroundColor]="getCourseDot(task.course)"
                      aria-hidden="true"
                    ></span>
                  }
                </div>

                <!-- Exam underline (2px signal internal underline) -->
                @if (hasExamOnDate(cell.dateStr)) {
                  <span class="absolute bottom-1 left-2 right-2 h-[2px] bg-[var(--color-signal)] rounded-full" aria-hidden="true"></span>
                }
              </div>
            }
          </div>

          <!-- Selected Day Task List (Directly below the grid, as defined in DESIGN.md) -->
          <div class="pt-8 border-t border-[var(--color-line)] mt-8">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                  Jornada Elegida
                </span>
                <h3 class="font-display text-[1.25rem] font-bold text-[var(--color-ink)] capitalize mt-0.5">
                  {{ formatSelectedDateLabel() }}
                </h3>
              </div>

              <button
                type="button"
                (click)="addTask.emit(selectedDate())"
                class="px-3.5 py-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] text-[0.8125rem] font-medium rounded-[8px] hover:opacity-85 transition-opacity cursor-pointer"
              >
                + Añadir para este día
              </button>
            </div>

            <!-- List of tasks for chosen date -->
            <div class="border-t border-[var(--color-line)]">
              @for (task of selectedDayTasks(); track task.id) {
                <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
              } @empty {
                <div class="py-6 text-[0.875rem] text-[var(--color-ink-muted)]">
                  No hay entregas registradas para este día.
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- 2. WEEK VIEW (Seven stacked blocks: Monday to Sunday) -->
      @if (currentView() === 'week') {
        <section class="space-y-6">
          <!-- Week Navigation Header -->
          <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
            <h2 class="font-display text-[1.25rem] font-bold text-[var(--color-ink)]">
              Semana del {{ formatWeekStartLabel() }}
            </h2>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                (click)="navigateWeek(-1)"
                class="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-[8px] transition-colors cursor-pointer"
                aria-label="Semana anterior"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">chevron_left</mat-icon>
              </button>
              <button
                type="button"
                (click)="goToToday()"
                class="px-3 py-1.5 text-[0.8125rem] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] transition-colors cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                (click)="navigateWeek(1)"
                class="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-[8px] transition-colors cursor-pointer"
                aria-label="Semana siguiente"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">chevron_right</mat-icon>
              </button>
            </div>
          </div>

          <!-- Seven Stacked Blocks -->
          <div class="space-y-8">
            @for (day of weekDays(); track day.dateStr) {
              <div class="border-b border-[var(--color-line)] pb-4">
                <!-- Day Subheader -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em]"
                      [class.text-[var(--color-signal)]]="day.isToday"
                      [class.text-[var(--color-ink)]]="!day.isToday"
                    >
                      {{ getWeekDayLabel(day) }}
                    </span>
                    @if (day.isToday) {
                      <span class="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-signal)]">
                        · Hoy
                      </span>
                    }
                  </div>

                  <button
                    type="button"
                    (click)="addTask.emit(day.dateStr)"
                    class="text-[0.75rem] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline cursor-pointer"
                  >
                    + Añadir
                  </button>
                </div>

                <!-- Tasks in this day block -->
                <div class="border-t border-[var(--color-line)]">
                  @for (task of getTasksForDate(day.dateStr); track task.id) {
                    <app-task-row [task]="task" (edit)="editTask.emit($event)"></app-task-row>
                  } @empty {
                    <div class="py-3 text-[0.8125rem] text-[var(--color-ink-muted)]">
                      Sin entregas programadas
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
})
export class CalendarView {
  private taskService = inject(TaskService);

  readonly addTask = output<string>();
  readonly editTask = output<Task>();

  readonly currentView = this.taskService.currentView;
  readonly selectedDate = this.taskService.selectedDate;

  readonly viewYear = signal<number>(parseDateParts(getTodayISO()).year);
  readonly viewMonth = signal<number>(parseDateParts(getTodayISO()).month);

  readonly monthGridCells = computed<CalendarGridCell[]>(() => {
    return buildMonthGrid(this.viewYear(), this.viewMonth());
  });

  readonly weekDays = computed<CalendarGridCell[]>(() => {
    return buildWeekDays(this.selectedDate());
  });

  readonly selectedDayTasks = computed<Task[]>(() => {
    const map = this.taskService.tasksByDate();
    return map.get(this.selectedDate()) || [];
  });

  currentMonthLabel(): string {
    return `${getMonthName(this.viewMonth())} ${this.viewYear()}`;
  }

  formatWeekStartLabel(): string {
    const days = this.weekDays();
    if (days.length === 0) return '';
    return formatDisplayDate(days[0].dateStr, { shortMonth: true });
  }

  formatSelectedDateLabel(): string {
    return formatDisplayDate(this.selectedDate(), { includeDayName: true });
  }

  getTasksForDate(dateStr: string): Task[] {
    const map = this.taskService.tasksByDate();
    return map.get(dateStr) || [];
  }

  hasExamOnDate(dateStr: string): boolean {
    const tasks = this.getTasksForDate(dateStr);
    return tasks.some((t) => t.type === 'exam' && !t.completed);
  }

  getCourseDot(course: string): string {
    return this.taskService.getCourseColor(course);
  }

  getAccessibleCellLabel(cell: CalendarGridCell): string {
    const pending = this.getTasksForDate(cell.dateStr).filter((t) => !t.completed).length;
    return `${formatDisplayDate(cell.dateStr, { shortMonth: true })}, ${pending} pendientes`;
  }

  getWeekDayLabel(day: CalendarGridCell): string {
    return formatDisplayDate(day.dateStr, { includeDayName: true });
  }

  selectDate(dateStr: string): void {
    this.taskService.setSelectedDate(dateStr);
    const p = parseDateParts(dateStr);
    this.viewYear.set(p.year);
    this.viewMonth.set(p.month);
  }

  goToToday(): void {
    const today = getTodayISO();
    this.selectDate(today);
  }

  navigateMonth(direction: number): void {
    let m = this.viewMonth() + direction;
    let y = this.viewYear();
    if (m > 12) {
      m = 1;
      y += 1;
    } else if (m < 1) {
      m = 12;
      y -= 1;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  navigateWeek(direction: number): void {
    const newDate = addDays(this.selectedDate(), direction * 7);
    this.selectDate(newDate);
  }
}
