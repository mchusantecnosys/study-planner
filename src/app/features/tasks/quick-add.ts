import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { TaskType } from '../../core/models/task.model';

@Component({
  selector: 'app-quick-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="onSubmit($event)" class="w-full">
      <div
        class="flex items-center gap-2 p-1.5 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[10px] transition-all focus-within:border-[var(--color-ink)]"
      >
        <!-- Type quick switch (Deber vs Examen) -->
        <button
          type="button"
          (click)="toggleType()"
          class="px-2.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-wider rounded-[6px] transition-colors shrink-0 cursor-pointer"
          [class.bg-[var(--color-signal-wash)]]="taskType() === 'exam'"
          [class.text-[var(--color-signal)]]="taskType() === 'exam'"
          [class.bg-[var(--color-paper)]]="taskType() === 'assignment'"
          [class.text-[var(--color-ink-muted)]]="taskType() === 'assignment'"
          [title]="taskType() === 'exam' ? 'Crear como Examen' : 'Crear como Deber'"
        >
          {{ taskType() === 'exam' ? 'Examen' : 'Deber' }}
        </button>

        <!-- Task title input -->
        <input
          type="text"
          [value]="titleText()"
          (input)="onInput($event)"
          placeholder="¿Qué tienes que preparar hoy? Escribe y pulsa Añadir..."
          class="flex-1 bg-transparent border-none outline-none text-[0.9375rem] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] px-2 py-1 font-body"
          aria-label="Título de la tarea rápida para hoy"
        />

        <!-- Optional course select dropdown if multiple courses exist -->
        @if (courses().length > 0) {
          <select
            [value]="selectedCourse()"
            (change)="onCourseChange($event)"
            class="hidden sm:block text-[0.8125rem] bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-line)] rounded-[6px] px-2 py-1.5 outline-none cursor-pointer"
            aria-label="Seleccionar materia"
          >
            @for (c of courses(); track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        }

        <!-- Add Button (Primary: ink / paper, 44px height, rounded 8px) -->
        <button
          type="submit"
          [disabled]="!titleText().trim()"
          class="h-[36px] sm:h-[40px] px-4 rounded-[8px] bg-[var(--color-ink)] text-[var(--color-paper)] font-medium text-[0.875rem] transition-opacity hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          Añadir
        </button>
      </div>
    </form>
  `,
})
export class QuickAdd {
  private taskService = inject(TaskService);

  readonly taskCreated = output<void>();

  readonly titleText = signal<string>('');
  readonly taskType = signal<TaskType>('assignment');
  readonly selectedCourse = signal<string>('');
  readonly courses = this.taskService.uniqueCourses;

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.titleText.set(target.value);
  }

  onCourseChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCourse.set(target.value);
  }

  toggleType(): void {
    this.taskType.update((t) => (t === 'assignment' ? 'exam' : 'assignment'));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const title = this.titleText().trim();
    if (!title) return;

    const course = this.selectedCourse() || this.courses()[0] || 'General';
    await this.taskService.quickAddTodayTask(title, course, this.taskType());

    this.titleText.set('');
    this.taskType.set('assignment');
    this.taskCreated.emit();
  }
}
