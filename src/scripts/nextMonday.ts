import { DateTime } from "luxon";

const TARGET_WEEKDAY = 1;
const TARGET_HOUR = 20;

export function getNextMonday20EuropeMadrid(now: Date = new Date()): Date {
  const nowMadrid = DateTime.fromJSDate(now).setZone("Europe/Madrid");

  let candidate = nowMadrid.set({
    hour: TARGET_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  let daysUntilMonday = (TARGET_WEEKDAY - nowMadrid.weekday + 7) % 7;

  if (daysUntilMonday === 0 && nowMadrid >= candidate) {
    daysUntilMonday = 7;
  }

  candidate = candidate.plus({ days: daysUntilMonday });
  return candidate.toJSDate();
}

export interface CountDown {
  days: number;
  hours: number;
  minutes: number;
}

export function diffToCountdown(diffMs: number): CountDown {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes };
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}