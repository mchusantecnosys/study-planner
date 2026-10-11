/**
 * Utility functions for pure date manipulation without UTC timezone offsets.
 * Strictly operates on "YYYY-MM-DD" strings by breaking down year, month, and day.
 */

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const MONTH_SHORT_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const DAY_NAMES_ES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const DAY_NAMES_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Returns today's local date as "YYYY-MM-DD".
 */
export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a "YYYY-MM-DD" string into numeric year, month (1-12), and day.
 */
export function parseDateParts(dateStr: string): DateParts {
  if (!dateStr || !dateStr.includes('-')) {
    const today = getTodayISO();
    return parseDateParts(today);
  }
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;
  return { year, month, day };
}

/**
 * Formats numeric parts into "YYYY-MM-DD".
 */
export function formatPartsToISO(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the number of days in a given year and month (1-12).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Returns the day of the week for a given date (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay();
}

/**
 * Compares two "YYYY-MM-DD" strings.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareDateStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Checks if a "YYYY-MM-DD" date is today.
 */
export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

/**
 * Checks if a "YYYY-MM-DD" date is strictly before today.
 */
export function isDatePast(dateStr: string): boolean {
  return compareDateStrings(dateStr, getTodayISO()) < 0;
}

/**
 * Adds or subtracts days from a "YYYY-MM-DD" date.
 */
export function addDays(dateStr: string, days: number): string {
  const { year, month, day } = parseDateParts(dateStr);
  const target = new Date(year, month - 1, day);
  target.setDate(target.getDate() + days);
  const resYear = target.getFullYear();
  const resMonth = String(target.getMonth() + 1).padStart(2, '0');
  const resDay = String(target.getDate()).padStart(2, '0');
  return `${resYear}-${resMonth}-${resDay}`;
}

/**
 * Calculates the difference in days between two "YYYY-MM-DD" strings (b - a).
 */
export function diffInDays(a: string, b: string): number {
  const pA = parseDateParts(a);
  const pB = parseDateParts(b);
  const dtA = Date.UTC(pA.year, pA.month - 1, pA.day);
  const dtB = Date.UTC(pB.year, pB.month - 1, pB.day);
  return Math.round((dtB - dtA) / (1000 * 60 * 60 * 24));
}

/**
 * Returns a human-friendly Spanish relative label (e.g., "Hoy", "Mañana", "En 3 días", "Atrasado").
 */
export function getRelativeDateLabel(dateStr: string): string {
  const today = getTodayISO();
  const diff = diffInDays(today, dateStr);

  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  if (diff < -1) return `Atrasado (${Math.abs(diff)}d)`;
  if (diff <= 7) return `En ${diff} días`;
  return formatDisplayDate(dateStr, { shortMonth: true });
}

/**
 * Formats a "YYYY-MM-DD" string into Spanish display text.
 */
export function formatDisplayDate(
  dateStr: string,
  options?: { includeDayName?: boolean; shortMonth?: boolean; includeYear?: boolean }
): string {
  if (!dateStr) return '';
  const { year, month, day } = parseDateParts(dateStr);
  const dayOfWeek = getDayOfWeek(year, month, day);

  const monthLabel = options?.shortMonth
    ? MONTH_SHORT_ES[month - 1]
    : MONTH_NAMES_ES[month - 1];

  let result = `${day} de ${monthLabel}`;

  if (options?.includeYear !== false) {
    result += ` ${year}`;
  }

  if (options?.includeDayName) {
    result = `${DAY_NAMES_ES[dayOfWeek]}, ${result}`;
  }

  return result;
}

/**
 * Returns month name in Spanish for a given month index (1-12).
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES_ES[month - 1] || '';
}

/**
 * Returns weekday names starting with Monday (for European/Academic calendar layout).
 */
export function getAcademicWeekdays(): { name: string; short: string }[] {
  return [
    { name: 'Lunes', short: 'Lun' },
    { name: 'Martes', short: 'Mar' },
    { name: 'Miércoles', short: 'Mié' },
    { name: 'Jueves', short: 'Jue' },
    { name: 'Viernes', short: 'Vie' },
    { name: 'Sábado', short: 'Sáb' },
    { name: 'Domingo', short: 'Dom' },
  ];
}

export interface CalendarGridCell {
  dateStr: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dayOfWeek: number; // 0 Sun ... 6 Sat
}

/**
 * Generates the 35 or 42 cells needed for a monthly grid starting on Monday.
 */
export function buildMonthGrid(year: number, month: number): CalendarGridCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getDayOfWeek(year, month, 1); // 0 (Sun) to 6 (Sat)
  
  // Convert Sunday (0) to 7 so Monday is 1, Sunday is 7
  const normalizedFirstDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
  const paddingBefore = normalizedFirstDay - 1; // Days from previous month to display

  const cells: CalendarGridCell[] = [];
  const todayStr = getTodayISO();

  // 1. Previous month days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = paddingBefore - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const dateStr = formatPartsToISO(prevYear, prevMonth, d);
    cells.push({
      dateStr,
      day: d,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: compareDateStrings(dateStr, todayStr) < 0,
      dayOfWeek: getDayOfWeek(prevYear, prevMonth, d),
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatPartsToISO(year, month, d);
    cells.push({
      dateStr,
      day: d,
      month,
      year,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: compareDateStrings(dateStr, todayStr) < 0,
      dayOfWeek: getDayOfWeek(year, month, d),
    });
  }

  // 3. Next month days (fill grid to complete rows of 7, up to 35 or 42)
  const totalCellsSoFar = cells.length;
  const targetTotal = totalCellsSoFar > 35 ? 42 : 35;
  const paddingAfter = targetTotal - totalCellsSoFar;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let d = 1; d <= paddingAfter; d++) {
    const dateStr = formatPartsToISO(nextYear, nextMonth, d);
    cells.push({
      dateStr,
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: compareDateStrings(dateStr, todayStr) < 0,
      dayOfWeek: getDayOfWeek(nextYear, nextMonth, d),
    });
  }

  return cells;
}

/**
 * Builds the 7 days of the week containing a specific date (Monday to Sunday).
 */
export function buildWeekDays(referenceDateStr: string): CalendarGridCell[] {
  const { year, month, day } = parseDateParts(referenceDateStr);
  const dayOfWeek = getDayOfWeek(year, month, day); // 0 (Sun) to 6 (Sat)
  const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const mondayOffset = 1 - normalizedDay;
  const mondayStr = addDays(referenceDateStr, mondayOffset);

  const days: CalendarGridCell[] = [];
  const todayStr = getTodayISO();

  for (let i = 0; i < 7; i++) {
    const curDateStr = addDays(mondayStr, i);
    const p = parseDateParts(curDateStr);
    days.push({
      dateStr: curDateStr,
      day: p.day,
      month: p.month,
      year: p.year,
      isCurrentMonth: p.month === month,
      isToday: curDateStr === todayStr,
      isPast: compareDateStrings(curDateStr, todayStr) < 0,
      dayOfWeek: getDayOfWeek(p.year, p.month, p.day),
    });
  }

  return days;
}
