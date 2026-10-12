import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { I18nService } from '../../core/services/i18n.service';
import { formatDisplayDate, getRelativeDateLabel, isDatePast } from '../../lib/dates';

@Component({
  selector: 'app-task-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div
      class="grid grid-cols-[2.75rem_1fr_auto] items-center min-h-[56px] py-2 border-b border-[var(--color-line)] group transition-colors"
      [class.opacity-60]="task().completed"
    >
      <!-- 1. Checkbox with 44x44px touch area (The Touch Target Rule) -->
      <div class="flex items-center justify-start">
        <button
          type="button"
          (click)="onToggle($event)"
          class="w-11 h-11 flex items-center justify-center cursor-pointer -ml-2 rounded-[6px]"
          [attr.aria-label]="task().completed ? t().taskRow.markPending : t().taskRow.markComplete"
        >
          <span
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors"
            [class.bg-[var(--color-success)]]="task().completed"
            [class.border-[var(--color-success)]]="task().completed"
            [class.text-[var(--color-paper)]]="task().completed"
            [class.border-[var(--color-ink-muted)]]="!task().completed"
            [class.bg-transparent]="!task().completed"
          >
            @if (task().completed) {
              <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">check</mat-icon>
            }
          </span>
        </button>
      </div>

      <!-- 2. Content: Title and Meta (dot + course) -->
      <div class="min-w-0 pr-3">
        <div class="flex items-center gap-2 flex-wrap">
          @if (task().type === 'exam') {
            <!-- Exam badge: signal-wash background, signal text, 4px rounded, 2px 7px padding -->
            <span
              class="px-[7px] py-[2px] rounded-[4px] bg-[var(--color-signal-wash)] text-[var(--color-signal)] text-[0.6875rem] font-semibold uppercase tracking-[0.04em] shrink-0 font-body"
            >
              {{ t().taskRow.examBadge }}
            </span>
          }

          <!-- Task Title: Fraunces 1.125rem for Exam, Hanken Grotesk 1rem for assignment -->
          <span
            class="break-words leading-tight"
            [class.font-display]="task().type === 'exam'"
            [class.text-[1.125rem]]="task().type === 'exam'"
            [class.font-bold]="task().type === 'exam'"
            [class.font-body]="task().type !== 'exam'"
            [class.text-[1rem]]="task().type !== 'exam'"
            [class.font-medium]="task().type !== 'exam'"
            [class.text-[var(--color-ink)]]="!task().completed"
            [class.line-through]="task().completed"
            [class.text-[var(--color-ink-muted)]]="task().completed"
          >
            {{ task().title }}
          </span>
        </div>

        <!-- Meta Line: 8px course dot + course name (The Dot-Only Rule) -->
        <div class="flex items-center gap-2 text-[0.8125rem] text-[var(--color-ink-muted)] mt-1">
          <span
            class="w-2 h-2 rounded-full shrink-0"
            [style.backgroundColor]="courseDotColor()"
            aria-hidden="true"
          ></span>
          <span>{{ task().course }}</span>

          @if (task().time) {
            <span aria-hidden="true">·</span>
            <span class="tabular-nums">{{ task().time }}</span>
          }

          @if (task().estimatedHours) {
            <span aria-hidden="true">·</span>
            <span>{{ task().estimatedHours }}h</span>
          }

          @if (task().notes) {
            <span aria-hidden="true">·</span>
            <span class="truncate max-w-[200px] sm:max-w-xs">{{ task().notes }}</span>
          }
        </div>
      </div>

      <!-- 3. Date & Actions on the right -->
      <div class="flex items-center gap-3 shrink-0 text-right">
        <!-- Relative or full date -->
        <div class="text-[0.8125rem] tabular-nums">
          @if (isOverdue()) {
            <span class="text-[var(--color-signal)] font-semibold">
              {{ overdueLabel() }}
            </span>
          } @else {
            <span class="text-[var(--color-ink-muted)]">
              {{ dateLabel() }}
            </span>
          }
        </div>

        <!-- Quick actions (Edit / Delete) visible on hover or focus -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            (click)="onEdit($event)"
            class="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-[6px] cursor-pointer"
            [title]="t().taskRow.editTooltip"
            [attr.aria-label]="t().taskRow.editTooltip"
          >
            <mat-icon class="!w-4 !h-4 !text-[16px]">edit</mat-icon>
          </button>
          <button
            type="button"
            (click)="onDelete($event)"
            class="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-signal)] rounded-[6px] cursor-pointer"
            [title]="t().taskRow.deleteTooltip"
            [attr.aria-label]="t().taskRow.deleteTooltip"
          >
            <mat-icon class="!w-4 !h-4 !text-[16px]">delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TaskRow {
  private taskService = inject(TaskService);
  private i18n = inject(I18nService);

  readonly t = this.i18n.t;
  readonly task = input.required<Task>();
  readonly edit = output<Task>();

  courseDotColor(): string {
    return this.taskService.getCourseColor(this.task().course);
  }

  isOverdue(): boolean {
    const t = this.task();
    return !t.completed && isDatePast(t.dueDate);
  }

  overdueLabel(): string {
    const lang = this.i18n.currentLang();
    const label = getRelativeDateLabel(this.task().dueDate, lang);
    if (label === 'Ayer' || label === 'Yesterday') {
      return this.t().taskRow.overdueYesterday;
    }
    if (label.startsWith('Atrasado') || label.startsWith('Overdue')) {
      return label;
    }
    const formatted = formatDisplayDate(this.task().dueDate, { shortMonth: true }, lang);
    return `${this.t().taskRow.overduePrefix} (${formatted})`;
  }

  dateLabel(): string {
    return getRelativeDateLabel(this.task().dueDate, this.i18n.currentLang());
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.taskService.toggleTaskCompletion(this.task().id);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.task());
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(this.t().taskRow.confirmDelete)) {
      this.taskService.deleteTask(this.task().id);
    }
  }
}
