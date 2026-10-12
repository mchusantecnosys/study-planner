import { Injectable, computed, signal } from '@angular/core';
import { Language, TRANSLATIONS, Translations } from '../i18n/translations';

const STORAGE_KEY = 'studyplanner_lang';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly currentLang = signal<Language>(this.getInitialLanguage());

  /**
   * Reactive signal with typed translations dictionary for current language.
   */
  readonly t = computed<Translations>(() => {
    return TRANSLATIONS[this.currentLang()];
  });

  constructor() {
    this.updateHtmlLang(this.currentLang());
  }

  setLanguage(lang: Language): void {
    if (lang === this.currentLang()) return;
    this.currentLang.set(lang);
    this.persistLanguage(lang);
    this.updateHtmlLang(lang);
  }

  toggleLanguage(): void {
    const nextLang: Language = this.currentLang() === 'es' ? 'en' : 'es';
    this.setLanguage(nextLang);
  }

  private getInitialLanguage(): Language {
    if (typeof window === 'undefined') {
      return 'es';
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') {
        return saved;
      }
      // Check browser preferences
      const navLang = navigator.language?.toLowerCase() || '';
      if (navLang.startsWith('en')) {
        return 'en';
      }
    } catch {
      // Fallback
    }

    return 'es';
  }

  private persistLanguage(lang: Language): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage might be restricted
      }
    }
  }

  private updateHtmlLang(lang: Language): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }
}
