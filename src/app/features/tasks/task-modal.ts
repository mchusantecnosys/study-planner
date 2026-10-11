import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskCreateInput, TaskPriority, TaskType } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { addDays, getTodayISO } from '../../lib/dates';

@Component({
  selector: 'app-task-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      (keydown.escape)="closeModal.emit()"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="isEditMode() ? 'Editar tarea' : 'Crear nueva tarea'"
    >
      <!-- Backdrop button -->
      <button
        type="button"
        (click)="closeModal.emit()"
        class="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity cursor-pointer border-none"
        aria-label="Cerrar modal"
      ></button>

      <!-- Modal Dialog Window -->
      <div
        class="bg-[var(--color-surface)] rounded-[10px] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[var(--color-line)] relative z-10"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
          <div>
            <h2 class="font-display text-[1.25rem] font-bold text-[var(--color-ink)] leading-snug">
              {{ isEditMode() ? 'Editar Actividad' : 'Nueva Tarea o Examen' }}
            </h2>
            <p class="text-[0.8125rem] text-[var(--color-ink-muted)] mt-0.5">
              Planificación académica en fecha pura sin desfase horario
            </p>
          </div>
          <button
            type="button"
            (click)="closeModal.emit()"
            class="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-[6px] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <mat-icon class="!w-5 !h-5 !text-[20px]">close</mat-icon>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <!-- Type Selector (Segmented buttons) -->
          <div>
            <span class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-2">
              Tipo de Actividad <span class="text-[var(--color-signal)]">*</span>
            </span>
            <div class="grid grid-cols-2 gap-2 p-1 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[8px]">
              <button
                type="button"
                (click)="setType('assignment')"
                class="flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] text-[0.875rem] font-medium transition-all cursor-pointer"
                [class.bg-[var(--color-ink)]]="taskForm.controls.type.value === 'assignment'"
                [class.text-[var(--color-paper)]]="taskForm.controls.type.value === 'assignment'"
                [class.text-[var(--color-ink-muted)]]="taskForm.controls.type.value !== 'assignment'"
              >
                <span>Deber / Trabajo</span>
              </button>
              <button
                type="button"
                (click)="setType('exam')"
                class="flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] text-[0.875rem] font-medium transition-all cursor-pointer"
                [class.bg-[var(--color-signal-wash)]]="taskForm.controls.type.value === 'exam'"
                [class.text-[var(--color-signal)]]="taskForm.controls.type.value === 'exam'"
                [class.font-semibold]="taskForm.controls.type.value === 'exam'"
                [class.text-[var(--color-ink-muted)]]="taskForm.controls.type.value !== 'exam'"
              >
                <span>Examen / Evaluación</span>
              </button>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="title">
              Título de la actividad <span class="text-[var(--color-signal)]">*</span>
            </label>
            <input
              id="title"
              type="text"
              formControlName="title"
              placeholder="Ej: Examen Parcial de Álgebra Lineal"
              class="w-full px-3.5 py-2.5 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
            @if (taskForm.controls.title.touched && taskForm.controls.title.invalid) {
              <p class="text-[0.8125rem] text-[var(--color-signal)] mt-1">El título es obligatorio (mínimo 3 caracteres).</p>
            }
          </div>

          <!-- Course & Priority Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Course / Subject -->
            <div>
              <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="course">
                Materia <span class="text-[var(--color-signal)]">*</span>
              </label>
              <div class="relative">
                <input
                  id="course"
                  type="text"
                  formControlName="course"
                  list="course-suggestions"
                  placeholder="Ej: Cálculo II"
                  class="w-full px-3.5 py-2.5 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
                />
                <datalist id="course-suggestions">
                  @for (c of existingCourses(); track c) {
                    <option [value]="c"></option>
                  }
                </datalist>
              </div>
              @if (taskForm.controls.course.touched && taskForm.controls.course.invalid) {
                <p class="text-[0.8125rem] text-[var(--color-signal)] mt-1">La materia es obligatoria.</p>
              }
            </div>

            <!-- Priority -->
            <div>
              <span class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5">
                Prioridad
              </span>
              <div class="grid grid-cols-3 gap-1 p-1 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[8px]">
                <button
                  type="button"
                  (click)="setPriority('low')"
                  class="py-2 text-[0.8125rem] font-medium rounded-[6px] transition-all text-center cursor-pointer"
                  [class.bg-[var(--color-ink)]]="taskForm.controls.priority.value === 'low'"
                  [class.text-[var(--color-paper)]]="taskForm.controls.priority.value === 'low'"
                  [class.text-[var(--color-ink-muted)]]="taskForm.controls.priority.value !== 'low'"
                >
                  Baja
                </button>
                <button
                  type="button"
                  (click)="setPriority('medium')"
                  class="py-2 text-[0.8125rem] font-medium rounded-[6px] transition-all text-center cursor-pointer"
                  [class.bg-[var(--color-ink)]]="taskForm.controls.priority.value === 'medium'"
                  [class.text-[var(--color-paper)]]="taskForm.controls.priority.value === 'medium'"
                  [class.text-[var(--color-ink-muted)]]="taskForm.controls.priority.value !== 'medium'"
                >
                  Media
                </button>
                <button
                  type="button"
                  (click)="setPriority('high')"
                  class="py-2 text-[0.8125rem] font-medium rounded-[6px] transition-all text-center cursor-pointer"
                  [class.bg-[var(--color-signal-wash)]]="taskForm.controls.priority.value === 'high'"
                  [class.text-[var(--color-signal)]]="taskForm.controls.priority.value === 'high'"
                  [class.font-semibold]="taskForm.controls.priority.value === 'high'"
                  [class.text-[var(--color-ink-muted)]]="taskForm.controls.priority.value !== 'high'"
                >
                  Alta
                </button>
              </div>
            </div>
          </div>

          <!-- Due Date & Time -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Due Date (2 cols) -->
            <div class="sm:col-span-2">
              <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="dueDate">
                Fecha de Entrega <span class="text-[var(--color-signal)]">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                formControlName="dueDate"
                class="w-full px-3.5 py-2.5 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors tabular-nums"
              />
              <!-- Date Shortcuts -->
              <div class="flex items-center gap-1.5 mt-2">
                <button
                  type="button"
                  (click)="setShortcutDate(0)"
                  class="text-[0.75rem] font-medium px-2 py-0.5 rounded-[4px] bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  (click)="setShortcutDate(1)"
                  class="text-[0.75rem] font-medium px-2 py-0.5 rounded-[4px] bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  Mañana
                </button>
                <button
                  type="button"
                  (click)="setShortcutDate(3)"
                  class="text-[0.75rem] font-medium px-2 py-0.5 rounded-[4px] bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  En 3 días
                </button>
                <button
                  type="button"
                  (click)="setShortcutDate(7)"
                  class="text-[0.75rem] font-medium px-2 py-0.5 rounded-[4px] bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  En 1 semana
                </button>
              </div>
            </div>

            <!-- Time (1 col) -->
            <div>
              <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="time">
                Hora (Opcional)
              </label>
              <input
                id="time"
                type="time"
                formControlName="time"
                class="w-full px-3.5 py-2.5 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors tabular-nums"
              />
            </div>
          </div>

          <!-- Estimated Study Hours & Notes -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="estimatedHours">
                Horas Estimadas
              </label>
              <input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                max="100"
                formControlName="estimatedHours"
                placeholder="Ej: 4"
                class="w-full px-3.5 py-2.5 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)] mb-1.5" for="notes">
                Apuntes o Temario
              </label>
              <textarea
                id="notes"
                rows="2"
                formControlName="notes"
                placeholder="Ej: Capítulos 4 y 5. Llevar formulario impreso."
                class="w-full px-3.5 py-2 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.9375rem] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-ink)] transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-[var(--color-line)] flex items-center justify-end gap-3">
            <button
              type="button"
              (click)="closeModal.emit()"
              class="px-4 py-2 text-[0.875rem] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-[8px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid || isSubmitting()"
              class="h-[44px] px-5 rounded-[8px] bg-[var(--color-ink)] text-[var(--color-paper)] font-medium text-[0.875rem] transition-opacity hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ isEditMode() ? 'Guardar Cambios' : 'Crear Tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TaskModal implements OnInit {
  private taskService = inject(TaskService);

  readonly taskToEdit = input<Task | null>(null);
  readonly initialDate = input<string | null>(null);

  readonly closeModal = output<void>();
  readonly saved = output<Task>();

  readonly isSubmitting = signal<boolean>(false);
  readonly existingCourses = this.taskService.uniqueCourses;

  readonly isEditMode = signal<boolean>(false);

  readonly taskForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    course: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<TaskType>('assignment', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl<string>(getTodayISO(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    time: new FormControl<string>(''),
    priority: new FormControl<TaskPriority>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl<string>(''),
    estimatedHours: new FormControl<number | null>(null),
  });

  ngOnInit(): void {
    const editItem = this.taskToEdit();
    if (editItem) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: editItem.title,
        course: editItem.course,
        type: editItem.type,
        dueDate: editItem.dueDate,
        time: editItem.time || '',
        priority: editItem.priority,
        notes: editItem.notes || '',
        estimatedHours: editItem.estimatedHours || null,
      });
    } else {
      const presetDate = this.initialDate();
      if (presetDate) {
        this.taskForm.patchValue({ dueDate: presetDate });
      }
    }
  }

  setType(type: TaskType): void {
    this.taskForm.controls.type.setValue(type);
  }

  setPriority(p: TaskPriority): void {
    this.taskForm.controls.priority.setValue(p);
  }

  setShortcutDate(daysOffset: number): void {
    const target = addDays(getTodayISO(), daysOffset);
    this.taskForm.controls.dueDate.setValue(target);
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.taskForm.getRawValue();

    try {
      const editItem = this.taskToEdit();
      if (editItem) {
        await this.taskService.updateTask(editItem.id, {
          title: formVal.title,
          course: formVal.course,
          type: formVal.type,
          dueDate: formVal.dueDate,
          time: formVal.time || undefined,
          priority: formVal.priority,
          notes: formVal.notes || undefined,
          estimatedHours: formVal.estimatedHours || undefined,
        });
        this.closeModal.emit();
      } else {
        const input: TaskCreateInput = {
          title: formVal.title,
          course: formVal.course,
          type: formVal.type,
          dueDate: formVal.dueDate,
          time: formVal.time || undefined,
          priority: formVal.priority,
          notes: formVal.notes || undefined,
          estimatedHours: formVal.estimatedHours || undefined,
        };
        const created = await this.taskService.createTask(input);
        this.saved.emit(created);
        this.closeModal.emit();
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
