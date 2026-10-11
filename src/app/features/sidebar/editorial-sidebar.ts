import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { formatDisplayDate } from '../../lib/dates';

@Component({
  selector: 'app-editorial-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="space-y-8 sticky top-6">
      <!-- 1. Countdown to Nearest Exam -->
      @if (nextExam(); as examInfo) {
        <section class="border-b border-[var(--color-line)] pb-7">
          <span class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-2">
            Próximo Examen
          </span>
          <div class="flex items-baseline gap-3 my-1">
            <span class="font-display text-[4rem] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)] tabular-nums">
              {{ examInfo.daysLeft }}
            </span>
            <span class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-signal)]">
              {{ examInfo.daysLeft === 1 ? 'DÍA' : 'DÍAS' }}
            </span>
          </div>
          <h3 class="font-display text-[1.125rem] font-bold leading-[1.3] text-[var(--color-ink)] mt-2">
            {{ examInfo.exam.title }}
          </h3>
          <div class="flex items-center gap-2 text-[0.8125rem] text-[var(--color-ink-muted)] mt-1.5">
            <span
              class="w-2 h-2 rounded-full shrink-0"
              [style.backgroundColor]="getCourseDot(examInfo.exam.course)"
              aria-hidden="true"
            ></span>
            <span class="font-medium text-[var(--color-ink)]">{{ examInfo.exam.course }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ formatExamDate(examInfo.exam.dueDate) }}</span>
          </div>
        </section>
      }

      <!-- 2. Weekly Workload (Carga semanal) -->
      <section class="border-b border-[var(--color-line)] pb-7">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
            Carga Semanal
          </span>
          <span class="text-[0.8125rem] text-[var(--color-ink-muted)] tabular-nums">
            {{ totalWeekTasks() }} tareas
          </span>
        </div>

        <!-- 7-day bar chart -->
        <div class="grid grid-cols-7 gap-2 items-end h-24 pt-2">
          @for (d of weeklyDistribution(); track d.dateStr) {
            <div class="flex flex-col items-center gap-1.5 h-full justify-end">
              <!-- Bar -->
              <div class="w-full max-w-[20px] bg-[var(--color-line)] rounded-[4px] relative overflow-hidden flex items-end justify-center transition-all duration-300 min-h-[6px]"
                [style.height.%]="d.heightPct"
                [class.!bg-[var(--color-ink)]]="d.isToday"
                [class.!bg-[var(--color-signal)]]="d.hasExam"
              >
              </div>

              <!-- Day letter -->
              <span
                class="text-[0.75rem] font-medium uppercase tracking-wider"
                [class.text-[var(--color-signal)]]="d.isToday"
                [class.font-bold]="d.isToday"
                [class.text-[var(--color-ink-muted)]]="!d.isToday"
              >
                {{ getDayInitial(d.dayOfWeek) }}
              </span>
            </div>
          }
        </div>
      </section>

      <!-- 3. Course Filter List -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
            Materias
          </span>
          @if (filter().course !== 'all') {
            <button
              type="button"
              (click)="clearCourseFilter()"
              class="text-[0.75rem] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline cursor-pointer"
            >
              Ver todas
            </button>
          }
        </div>

        <div class="space-y-1">
          @for (course of courses(); track course) {
            <button
              type="button"
              (click)="toggleCourse(course)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[0.875rem] font-medium transition-colors cursor-pointer text-left"
              [class.bg-[var(--color-ink)]]="filter().course.toLowerCase() === course.toLowerCase()"
              [class.text-[var(--color-paper)]]="filter().course.toLowerCase() === course.toLowerCase()"
              [class.text-[var(--color-ink)]]="filter().course.toLowerCase() !== course.toLowerCase()"
              [class.hover:bg-[var(--color-surface)]]="filter().course.toLowerCase() !== course.toLowerCase()"
              [attr.aria-pressed]="filter().course.toLowerCase() === course.toLowerCase()"
            >
              <div class="flex items-center gap-2.5 truncate">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  [style.backgroundColor]="getCourseDot(course)"
                  aria-hidden="true"
                ></span>
                <span class="truncate">{{ course }}</span>
              </div>

              @if (filter().course.toLowerCase() === course.toLowerCase()) {
                <span class="text-[0.75rem] text-[var(--color-paper)] font-semibold uppercase tracking-wider shrink-0 pl-2">
                  Filtrando
                </span>
              } @else {
                <span class="text-[0.75rem] text-[var(--color-ink-muted)] tabular-nums shrink-0 pl-2">
                  {{ getCoursePendingCount(course) }}
                </span>
              }
            </button>
          }
        </div>
      </section>
    </aside>
  `,
})
export class EditorialSidebar {
  private taskService = inject(TaskService);

  readonly nextExam = this.taskService.nextExam;
  readonly weeklyDistribution = this.taskService.weeklyDistribution;
  readonly courses = this.taskService.uniqueCourses;
  readonly filter = this.taskService.filter;

  totalWeekTasks(): number {
    return this.weeklyDistribution().reduce((acc, cur) => acc + cur.count, 0);
  }

  getCourseDot(course: string): string {
    return this.taskService.getCourseColor(course);
  }

  getCoursePendingCount(course: string): number {
    return this.taskService.tasks().filter(
      (t) => !t.completed && t.course.toLowerCase() === course.toLowerCase()
    ).length;
  }

  toggleCourse(course: string): void {
    const current = this.filter().course;
    if (current.toLowerCase() === course.toLowerCase()) {
      this.taskService.updateFilter({ course: 'all' });
    } else {
      this.taskService.updateFilter({ course });
    }
  }

  clearCourseFilter(): void {
    this.taskService.updateFilter({ course: 'all' });
  }

  getDayInitial(dayOfWeek: number): string {
    // 0 Sun, 1 Mon ... 6 Sat
    const initials = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    return initials[dayOfWeek] || 'L';
  }

  formatExamDate(isoDate: string): string {
    return formatDisplayDate(isoDate, { shortMonth: true });
  }
}
