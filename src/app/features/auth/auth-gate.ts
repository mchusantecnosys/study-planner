import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-auth-gate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[75vh] flex items-center justify-center py-12 px-5">
      <div class="w-full max-w-xl text-center space-y-8">
        <!-- Badge kicker -->
        <span class="inline-block text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-signal)]">
          {{ t().authGate.kicker }}
        </span>

        <!-- Display Headline in Fraunces -->
        <div class="space-y-3">
          <h1 class="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)] text-balance">
            {{ t().authGate.title }}
          </h1>
          <p class="text-[1.0625rem] text-[var(--color-ink-muted)] max-w-[46ch] mx-auto leading-[1.5]">
            {{ t().authGate.description }}
          </p>
        </div>

        <!-- Local-First & Privacy Highlights (Line separated, no cards) -->
        <div class="border-y border-[var(--color-line)] py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div>
            <span class="block text-[0.8125rem] font-semibold text-[var(--color-ink)] mb-1">
              {{ t().authGate.highlight1Title }}
            </span>
            <p class="text-[0.8125rem] text-[var(--color-ink-muted)] leading-relaxed">
              {{ t().authGate.highlight1Desc }}
            </p>
          </div>
          <div>
            <span class="block text-[0.8125rem] font-semibold text-[var(--color-ink)] mb-1">
              {{ t().authGate.highlight2Title }}
            </span>
            <p class="text-[0.8125rem] text-[var(--color-ink-muted)] leading-relaxed">
              {{ t().authGate.highlight2Desc }}
            </p>
          </div>
          <div>
            <span class="block text-[0.8125rem] font-semibold text-[var(--color-ink)] mb-1">
              {{ t().authGate.highlight3Title }}
            </span>
            <p class="text-[0.8125rem] text-[var(--color-ink-muted)] leading-relaxed">
              {{ t().authGate.highlight3Desc }}
            </p>
          </div>
        </div>

        <!-- Google Login Action -->
        <div class="space-y-3 pt-2">
          <button
            type="button"
            (click)="onLoginClick()"
            [disabled]="isLoggingIn()"
            class="inline-flex items-center justify-center gap-3 h-[48px] px-8 rounded-[8px] bg-[var(--color-ink)] text-[var(--color-paper)] text-[0.9375rem] font-medium transition-opacity hover:opacity-85 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <!-- Google SVG Icon -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.7 5.6 6.5 10.1 6.5z"
              />
            </svg>
            <span>{{ isLoggingIn() ? t().authGate.connecting : t().authGate.loginWithGoogle }}</span>
          </button>
          <p class="text-[0.75rem] text-[var(--color-ink-muted)]">
            {{ t().authGate.privacyNote }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AuthGate {
  private firebaseService = inject(FirebaseService);
  private i18n = inject(I18nService);

  readonly t = this.i18n.t;
  readonly loginSuccess = output<void>();
  readonly isLoggingIn = signal<boolean>(false);

  async onLoginClick(): Promise<void> {
    this.isLoggingIn.set(true);
    try {
      const user = await this.firebaseService.signInWithGoogle();
      if (user) {
        this.loginSuccess.emit();
      }
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
