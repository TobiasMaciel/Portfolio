import type { Language } from "@/context/LanguageContext";

/**
 * Experience dates are stored as "YYYY-MM" (end omitted while ongoing), and
 * every period and duration on the site is derived from them, so adding or
 * closing a job is the only edit needed and the totals stay current.
 */

const MONTHS = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

type YearMonth = { year: number; month: number }; // month: 0-11

const parse = (value: string): YearMonth => {
  const [year, month] = value.split("-").map(Number);
  return { year, month: month - 1 };
};

const now = (): YearMonth => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
};

const index = (ym: YearMonth) => ym.year * 12 + ym.month;

/** Months worked, counting both the first and the last month. */
export function monthsBetween(start: string, end?: string | null) {
  const to = end ? parse(end) : now();
  return Math.max(0, index(to) - index(parse(start)) + 1);
}

/** Total months across several jobs; overlapping months count once. */
export function totalMonths(jobs: { start: string; end?: string | null }[]) {
  const covered = new Set<number>();
  for (const job of jobs) {
    const from = index(parse(job.start));
    const to = index(job.end ? parse(job.end) : now());
    for (let m = from; m <= to; m++) covered.add(m);
  }
  return covered.size;
}

/** "3 años y 7 meses" / "3 years and 7 months" */
export function formatDuration(months: number, lang: Language) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = lang === "es" ? `${years} ${years === 1 ? "año" : "años"}` : `${years} ${years === 1 ? "year" : "years"}`;
  const m = lang === "es" ? `${rest} ${rest === 1 ? "mes" : "meses"}` : `${rest} ${rest === 1 ? "month" : "months"}`;
  if (years === 0) return m;
  if (rest === 0) return y;
  return lang === "es" ? `${y} y ${m}` : `${y} and ${m}`;
}

/** "más de 3 años" / "over 3 years"; under a year, the exact months. */
export function formatAtLeast(months: number, lang: Language) {
  const years = Math.floor(months / 12);
  if (years === 0) return formatDuration(months, lang);
  const unit = lang === "es" ? (years === 1 ? "año" : "años") : years === 1 ? "year" : "years";
  return lang === "es" ? `más de ${years} ${unit}` : `over ${years} ${unit}`;
}

/** "Desde abril 2023" / "Abril 2023 a marzo 2026" (and the English forms). */
export function formatRange(start: string, end: string | null | undefined, lang: Language) {
  const s = parse(start);
  const from = `${MONTHS[lang][s.month]} ${s.year}`;
  if (!end) return lang === "es" ? `Desde ${from}` : `Since ${from}`;
  const e = parse(end);
  const to = `${MONTHS[lang][e.month]} ${e.year}`;
  const text = lang === "es" ? `${from} a ${to}` : `${from} to ${to}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
