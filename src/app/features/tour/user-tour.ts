import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TourService } from '../../core/services/tour.service';
import { I18nService } from '../../core/services/i18n.service';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

interface PopoverStyle {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  transform?: string;
}

@Component({
  selector: 'app-user-tour',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'handleKeydown($event)',
    '(window:resize)': 'handleResize()',
    '(window:scroll)': 'handleScroll()',
  },
  template: `
    @if (tour.isActive()) {
      <div
        class="fixed inset-0 z-[100] overflow-hidden pointer-events-auto select-none"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="t().tour.welcome.title"
      >
        <!-- Backdrop: only active when there is no element spotlight (e.g. Welcome step) -->
        @if (!targetRect()) {
          <div
            class="absolute inset-0 bg-slate-950/70 transition-opacity duration-300"
          ></div>
        }

        <!-- Target Element Spotlight Highlight Box (Crystal-clear unblurred cutout) -->
        @if (targetRect(); as rect) {
          <div
            class="absolute pointer-events-none rounded-xl transition-all duration-300 ease-out border-2 border-[var(--color-signal)] shadow-[0_0_0_9999px_rgba(15,23,42,0.7)]"
            [style.top.px]="rect.top - 8"
            [style.left.px]="rect.left - 8"
            [style.width.px]="rect.width + 16"
            [style.height.px]="rect.height + 16"
          >
            <!-- Pulsing corner accent -->
            <span class="absolute -top-1.5 -left-1.5 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-signal)] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-signal)]"></span>
            </span>
          </div>
        }

        <!-- Tour Bubble / Card Container -->
        <div
          class="fixed z-[105] transition-all duration-300 ease-out"
          [style.top]="popoverPosition().top"
          [style.left]="popoverPosition().left"
          [style.bottom]="popoverPosition().bottom"
          [style.right]="popoverPosition().right"
          [style.transform]="popoverPosition().transform"
        >
          <div
            class="w-[90vw] max-w-md sm:max-w-lg bg-[var(--color-surface)] text-[var(--color-ink)] border-2 border-[var(--color-line)] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden p-6 relative font-body ring-1 ring-black/5 dark:ring-white/10"
            style="background-color: var(--color-surface); color: var(--color-ink);"
          >
            <!-- Header: Badge & Close Button -->
            <div class="flex items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-lg bg-[var(--color-signal-wash)] text-[var(--color-signal)] flex items-center justify-center shrink-0 border border-[var(--color-signal)]/15"
                >
                  <mat-icon class="text-[18px] leading-none">{{ currentStep().icon }}</mat-icon>
                </div>
                <span
                  class="text-[11px] font-mono uppercase tracking-wider font-semibold text-[var(--color-signal)] bg-[var(--color-signal-wash)] px-2.5 py-0.5 rounded-full border border-[var(--color-signal)]/20"
                >
                  {{ currentStepInfo().badge }}
                </span>
                <span class="text-xs text-[var(--color-ink-muted)] font-mono font-medium">
                  {{ stepCounterText() }}
                </span>
              </div>

              <button
                type="button"
                (click)="tour.skipTour()"
                class="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)] p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[var(--color-line)]"
                [attr.aria-label]="t().tour.skip"
                [title]="t().tour.skip"
              >
                <mat-icon class="text-[18px] leading-none">close</mat-icon>
              </button>
            </div>

            <!-- Body: Title & Description -->
            <div class="space-y-2 mb-6">
              <h3 class="text-lg sm:text-xl font-display font-bold text-[var(--color-ink)] leading-snug">
                {{ currentStepInfo().title }}
              </h3>
              <p class="text-sm sm:text-base text-[var(--color-ink-muted)] leading-relaxed font-normal">
                {{ currentStepInfo().desc }}
              </p>
            </div>

            <!-- Footer: Progress Dots & Action Buttons -->
            <div class="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-line)]">
              <!-- Step Progress Indicators (Dots) -->
              <div class="flex items-center gap-1.5" role="tablist">
                @for (step of tour.steps; track step.id; let idx = $index) {
                  <button
                    type="button"
                    (click)="tour.goToStep(idx)"
                    class="h-2 rounded-full transition-all duration-200 cursor-pointer"
                    [class.w-6]="idx === tour.currentStepIndex()"
                    [class.bg-[var(--color-signal)]]="idx === tour.currentStepIndex()"
                    [class.w-2]="idx !== tour.currentStepIndex()"
                    [class.bg-[var(--color-line)]]="idx !== tour.currentStepIndex()"
                    [class.hover:bg-[var(--color-ink-muted)]]="idx !== tour.currentStepIndex()"
                    [attr.aria-label]="'Paso ' + (idx + 1)"
                  ></button>
                }
              </div>

              <!-- Navigation Buttons -->
              <div class="flex items-center gap-2">
                @if (!tour.isFirstStep()) {
                  <button
                    type="button"
                    (click)="tour.prevStep()"
                    class="px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[var(--color-line)]"
                  >
                    <mat-icon class="text-[16px] leading-none">arrow_back</mat-icon>
                    <span>{{ t().tour.prev }}</span>
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="tour.skipTour()"
                    class="px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)] rounded-lg transition-colors cursor-pointer border border-[var(--color-line)]"
                  >
                    {{ t().tour.skip }}
                  </button>
                }

                @if (!tour.isLastStep()) {
                  <button
                    type="button"
                    (click)="tour.nextStep()"
                    class="px-4 py-1.5 text-xs font-semibold bg-[var(--color-ink)] text-[var(--color-paper)] hover:opacity-90 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{{ t().tour.next }}</span>
                    <mat-icon class="text-[16px] leading-none">arrow_forward</mat-icon>
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="tour.finishTour()"
                    class="px-4 py-1.5 text-xs font-semibold bg-[var(--color-signal)] text-white hover:opacity-90 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <mat-icon class="text-[16px] leading-none">check_circle</mat-icon>
                    <span>{{ t().tour.finish }}</span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class UserTour {
  readonly tour = inject(TourService);
  private readonly i18n = inject(I18nService);

  readonly t = this.i18n.t;
  readonly currentStep = this.tour.currentStep;

  readonly targetRect = signal<TargetRect | null>(null);

  readonly currentStepInfo = computed(() => {
    const step = this.currentStep();
    const tourT = this.t().tour;
    switch (step.badgeKey) {
      case 'welcome':
        return tourT.welcome;
      case 'quickAdd':
        return tourT.quickAdd;
      case 'views':
        return tourT.views;
      case 'sidebar':
        return tourT.sidebar;
      case 'sync':
        return tourT.sync;
      case 'lang':
        return tourT.lang;
    }
  });

  readonly stepCounterText = computed(() => {
    const tmpl = this.t().tour.stepOf;
    return tmpl
      .replace('{current}', String(this.tour.currentStepIndex() + 1))
      .replace('{total}', String(this.tour.totalSteps()));
  });

  readonly popoverPosition = computed<PopoverStyle>(() => {
    const rect = this.targetRect();
    const step = this.currentStep();

    // Welcome step or no target element -> Center dialog
    if (!rect || step.id === 'welcome' || !step.targetSelector) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    if (typeof window === 'undefined') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isMobile = windowWidth < 640;

    // Mobile fallback: place card near bottom with safe padding
    if (isMobile) {
      return {
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }

    const popoverWidth = 440;
    const popoverHeight = 240;

    // Position based on placement preference and available viewport space
    if (step.preferredPlacement === 'left') {
      // Position to the left of the target
      const left = Math.max(20, rect.left - popoverWidth - 20);
      const top = Math.min(
        Math.max(20, rect.top),
        windowHeight - popoverHeight - 20
      );
      return {
        top: `${top}px`,
        left: `${left}px`,
      };
    }

    // Default to 'bottom'
    let top = rect.bottom + 16;
    if (top + popoverHeight > windowHeight - 20) {
      // If overflows bottom, flip to top
      top = Math.max(20, rect.top - popoverHeight - 16);
    }

    // Center horizontally aligned with target, clamped to viewport bounds
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    if (left < 20) left = 20;
    if (left + popoverWidth > windowWidth - 20) {
      left = windowWidth - popoverWidth - 20;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  });

  constructor() {
    // When currentStep or isActive changes, update the target element positioning
    effect(() => {
      const active = this.tour.isActive();
      // Track step changes
      this.currentStep();
      if (!active) {
        this.targetRect.set(null);
        return;
      }

      this.updateTarget();
    });
  }

  private updateTarget(): void {
    if (typeof window === 'undefined') return;

    const step = this.currentStep();
    if (!step.targetSelector) {
      this.targetRect.set(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(step.targetSelector!);
      if (el) {
        const domRect = el.getBoundingClientRect();
        this.targetRect.set({
          top: domRect.top,
          left: domRect.left,
          width: domRect.width,
          height: domRect.height,
          bottom: domRect.bottom,
          right: domRect.right,
        });
      } else {
        this.targetRect.set(null);
      }
    };

    // Immediate measurement
    measure();

    // Scroll into view if needed and re-measure after microtask / render
    setTimeout(() => {
      const el = document.querySelector(step.targetSelector!);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      measure();
    }, 60);
  }

  handleResize(): void {
    if (this.tour.isActive()) {
      this.updateTarget();
    }
  }

  handleScroll(): void {
    if (this.tour.isActive() && this.currentStep().targetSelector) {
      const el = document.querySelector(this.currentStep().targetSelector!);
      if (el) {
        const domRect = el.getBoundingClientRect();
        this.targetRect.set({
          top: domRect.top,
          left: domRect.left,
          width: domRect.width,
          height: domRect.height,
          bottom: domRect.bottom,
          right: domRect.right,
        });
      }
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.tour.isActive()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.tour.skipTour();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.tour.nextStep();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.tour.prevStep();
    }
  }
}
