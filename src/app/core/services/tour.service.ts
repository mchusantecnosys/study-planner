import { Injectable, computed, signal } from '@angular/core';

export type TourStepId = 'welcome' | 'quick-add' | 'views' | 'sidebar' | 'sync' | 'lang';

export interface TourStep {
  id: TourStepId;
  targetSelector?: string;
  badgeKey: 'welcome' | 'quickAdd' | 'views' | 'sidebar' | 'sync' | 'lang';
  icon: string;
  preferredPlacement?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    badgeKey: 'welcome',
    icon: 'school',
    preferredPlacement: 'center',
  },
  {
    id: 'quick-add',
    targetSelector: '[data-tour="quick-add"]',
    badgeKey: 'quickAdd',
    icon: 'bolt',
    preferredPlacement: 'bottom',
  },
  {
    id: 'views',
    targetSelector: '[data-tour="views"]',
    badgeKey: 'views',
    icon: 'calendar_view_week',
    preferredPlacement: 'bottom',
  },
  {
    id: 'sidebar',
    targetSelector: '[data-tour="sidebar"]',
    badgeKey: 'sidebar',
    icon: 'auto_stories',
    preferredPlacement: 'left',
  },
  {
    id: 'sync',
    targetSelector: '[data-tour="sync"]',
    badgeKey: 'sync',
    icon: 'cloud_sync',
    preferredPlacement: 'bottom',
  },
  {
    id: 'lang',
    targetSelector: '[data-tour="lang"]',
    badgeKey: 'lang',
    icon: 'translate',
    preferredPlacement: 'bottom',
  },
];

const STORAGE_KEY = 'studyplanner_tour_completed';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  readonly steps = TOUR_STEPS;
  readonly isActive = signal<boolean>(false);
  readonly currentStepIndex = signal<number>(0);

  readonly currentStep = computed(() => this.steps[this.currentStepIndex()]);
  readonly totalSteps = computed(() => this.steps.length);
  readonly isFirstStep = computed(() => this.currentStepIndex() === 0);
  readonly isLastStep = computed(() => this.currentStepIndex() === this.steps.length - 1);

  readonly hasCompletedTour = signal<boolean>(this.checkCompletionState());

  private checkCompletionState(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Initializes the tour automatically on first visit if not yet completed.
   */
  initAutoTour(): void {
    if (!this.hasCompletedTour()) {
      // Delay slightly so DOM elements are rendered
      setTimeout(() => {
        this.startTour(false);
      }, 700);
    }
  }

  /**
   * Starts or resumes the tour.
   */
  startTour(force = true): void {
    if (!force && this.hasCompletedTour()) return;
    this.currentStepIndex.set(0);
    this.isActive.set(true);
  }

  nextStep(): void {
    if (this.isLastStep()) {
      this.finishTour();
    } else {
      this.currentStepIndex.update((idx) => Math.min(idx + 1, this.steps.length - 1));
    }
  }

  prevStep(): void {
    this.currentStepIndex.update((idx) => Math.max(idx - 1, 0));
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex.set(index);
    }
  }

  skipTour(): void {
    this.markAsCompleted();
    this.isActive.set(false);
  }

  finishTour(): void {
    this.markAsCompleted();
    this.isActive.set(false);
  }

  resetAndRestart(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.hasCompletedTour.set(false);
    this.startTour(true);
  }

  private markAsCompleted(): void {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    this.hasCompletedTour.set(true);
  }
}
