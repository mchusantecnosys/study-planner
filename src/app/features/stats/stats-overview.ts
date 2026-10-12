import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../core/services/task.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-stats-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <!-- Exámenes Próximos (Highlighted) -->
      <div
        class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs relative overflow-hidden group transition-all"
        [class.ring-1]="stats().upcomingExams7Days > 0"
        [class.ring-amber-400]="stats().upcomingExams7Days > 0"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-amber-800">
            {{ t().stats.examsTitle }}
          </span>
          <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <mat-icon class="!w-4 !h-4 !text-[18px]">school</mat-icon>
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {{ stats().totalExams }}
          </span>
          @if (stats().upcomingExams7Days > 0) {
            <span class="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
              {{ stats().upcomingExams7Days }} {{ t().stats.in7Days }}
            </span>
          }
        </div>
        <p class="text-xs text-stone-500 mt-1">{{ t().stats.examsDesc }}</p>
      </div>

      <!-- Deberes Pendientes -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-indigo-800">
            {{ t().stats.assignmentsTitle }}
          </span>
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <mat-icon class="!w-4 !h-4 !text-[18px]">assignment</mat-icon>
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {{ stats().totalAssignments }}
          </span>
          @if (stats().upcomingAssignments7Days > 0) {
            <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
              {{ stats().upcomingAssignments7Days }} {{ t().stats.in7Days }}
            </span>
          }
        </div>
        <p class="text-xs text-stone-500 mt-1">{{ t().stats.assignmentsDesc }}</p>
      </div>

      <!-- Pendientes vs Atrasadas -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-600">
            {{ t().stats.dueTitle }}
          </span>
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            [class]="stats().overdue > 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'"
          >
            <mat-icon class="!w-4 !h-4 !text-[18px]">
              {{ stats().overdue > 0 ? 'schedule_send' : 'pending_actions' }}
            </mat-icon>
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {{ stats().pending }}
          </span>
          @if (stats().overdue > 0) {
            <span class="text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">
              {{ stats().overdue }} {{ t().stats.late }}
            </span>
          }
        </div>
        <p class="text-xs text-stone-500 mt-1">
          {{ stats().overdue > 0 ? t().stats.dueDescOverdue : t().stats.dueDescAllGood }}
        </p>
      </div>

      <!-- Tasa de Cumplimiento -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {{ t().stats.completedTitle }}
          </span>
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <mat-icon class="!w-4 !h-4 !text-[18px]">task_alt</mat-icon>
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {{ stats().rate }}%
          </span>
          <span class="text-xs text-stone-500 font-medium">
            ({{ stats().completed }}/{{ stats().total }})
          </span>
        </div>
        <!-- Micro progress bar -->
        <div class="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            class="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            [style.width.%]="stats().rate"
          ></div>
        </div>
      </div>
    </div>
  `,
})
export class StatsOverview {
  private taskService = inject(TaskService);
  private i18n = inject(I18nService);

  readonly t = this.i18n.t;
  readonly stats = this.taskService.stats;
}
